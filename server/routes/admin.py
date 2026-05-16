from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, current_user
from models import User, Scan, Log

admin_bp = Blueprint('admin', __name__)

def admin_required():
    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Admin privileges required'}), 403
    return None

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    admin_check = admin_required()
    if admin_check: return admin_check

    total_users = User.query.count()
    total_scans = Scan.query.count()
    compromised_scans = Scan.query.filter_by(result='COMPROMISED').count()
    
    recent_logs = Log.query.order_by(Log.timestamp.desc()).limit(10).all()
    logs_data = [{'action': l.action, 'ip': l.ip_address, 'time': l.timestamp.isoformat()} for l in recent_logs]

    return jsonify({
        'total_users': total_users,
        'total_scans': total_scans,
        'compromised_scans': compromised_scans,
        'recent_logs': logs_data
    }), 200
