from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from extensions import db, limiter
from models import Scan, Log
import requests
from flask import current_app

check_bp = Blueprint('check', __name__)

def xon_check_breach(account):
    url = f"https://api.xposedornot.com/v1/check-email/{account}"
    headers = {
        "user-agent": "Personal-Data-Leak-Checker-App"
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            # XposedOrNot returns 200 OK even if not found, just with an Error key
            if "Error" in data and data["Error"] == "Not found":
                return {"status": "NO BREACH FOUND", "breach_count": 0, "details": []}
                
            breach_list = data.get("breaches", [[]])[0] if "breaches" in data else []
            
            if len(breach_list) == 0:
                return {"status": "NO BREACH FOUND", "breach_count": 0, "details": []}
                
            details = [{"Name": b, "BreachDate": "Unknown", "DataClasses": []} for b in breach_list]
            return {
                "status": "COMPROMISED",
                "breach_count": len(breach_list),
                "details": details
            }
        elif response.status_code == 404:
            return {"status": "NO BREACH FOUND", "breach_count": 0, "details": []}
        else:
            return {"error": "Failed to query XposedOrNot API. Please try again later.", "status_code": response.status_code}
    except requests.exceptions.RequestException:
        return {"error": "Failed to connect to leak database API."}

@check_bp.route('/', methods=['POST'])
@jwt_required(optional=True)
@limiter.limit("20 per minute")
def check_leak():
    data = request.get_json()
    if not data or not data.get('input'):
        return jsonify({'error': 'Missing input data'}), 400

    scan_input = data.get('input')
    scan_type = data.get('type', 'email') # default to email

    result = xon_check_breach(scan_input)
    if "error" in result:
        return jsonify({'error': result['error']}), 500

    # Log scan to DB if user is authenticated
    if current_user:
        new_scan = Scan(
            user_id=current_user.id,
            scan_input=scan_input,
            scan_type=scan_type,
            result=result['status'],
            breach_count=result['breach_count'],
            details=result['details']
        )
        db.session.add(new_scan)
        
        # Log action
        new_log = Log(action="Performed leak check", user_id=current_user.id, ip_address=request.remote_addr)
        db.session.add(new_log)
        
        db.session.commit()
    else:
        # Anonymous scan logging
        new_log = Log(action="Performed anonymous leak check", ip_address=request.remote_addr)
        db.session.add(new_log)
        db.session.commit()

    return jsonify(result), 200
