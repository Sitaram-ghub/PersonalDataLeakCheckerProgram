from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, current_user
from models import Scan

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    return jsonify({
        'id': current_user.id,
        'name': current_user.name,
        'email': current_user.email,
        'is_admin': current_user.is_admin,
        'created_at': current_user.created_at.isoformat()
    }), 200

@user_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    scans = Scan.query.filter_by(user_id=current_user.id).order_by(Scan.created_at.desc()).limit(20).all()
    scan_list = []
    for scan in scans:
        scan_list.append({
            'id': scan.id,
            'input': scan.scan_input,
            'type': scan.scan_type,
            'result': scan.result,
            'breach_count': scan.breach_count,
            'created_at': scan.created_at.isoformat()
        })
    return jsonify({'history': scan_list}), 200
