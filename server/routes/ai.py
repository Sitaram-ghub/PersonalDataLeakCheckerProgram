from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user
from models import Scan
import re

ai_bp = Blueprint('ai', __name__)

def local_password_analysis(pwd):
    patterns = []
    p = pwd.toLowerCase() if hasattr(pwd, 'toLowerCase') else pwd.lower()
    
    if re.search(r'(123|234|345|456|567|678|789|890)', p): patterns.append("Numerical Sequence Detected")
    if re.search(r'(abc|bcd|cde|def|efg|fgh|ghi|hij|jkl|klm|lmn|nop|pqr|qrs|rst|stu|tuv|vwx|wxy|xyz)', p): patterns.append("Alphabetical Sequence Detected")
    if re.search(r'(qwerty|asdfgh|zxcvbn)', p): patterns.append("Keyboard Row Pattern")
    if re.search(r'(password|admin|welcome|login|testing|123456)', p): patterns.append("Common Weak Keyword")
    if re.search(r'(19|20)\d{2}', p): patterns.append("Potential Year/Date Pattern")
    if re.search(r'(.)\1\1', p): patterns.append("Character Repetition Pattern")
    
    advice = "Strong passwords should avoid sequences and common words. Use a mix of symbols and cases."
    if len(patterns) > 2: advice = "This password is highly predictable. Use a random passphrase instead."
    elif not patterns: advice = "Great complexity! This password follows strong security principles."
    
    return {"patterns": patterns, "advice": advice}

@ai_bp.route('/analysis', methods=['GET'])
@jwt_required()
def dashboard_analysis():
    history = Scan.query.filter_by(user_id=current_user.id).all()
    compromised = [s for s in history if 'compromised' in s.result.lower()]
    
    score = 100 - (len(compromised) * 20)
    score = max(0, min(100, score))
    
    level = "Safe"
    if score < 70: level = "Medium Risk"
    if score < 40: level = "High Risk"
    
    recommendations = [
        {"title": "Enable 2FA", "description": "Always use two-factor authentication for sensitive accounts.", "priority": "High"},
        {"title": "Password Rotation", "description": "Update your primary passwords every 90 days.", "priority": "Medium"}
    ]
    
    if compromised:
        recommendations.insert(0, {"title": "Critical Breach Mitigation", "description": f"Found {len(compromised)} compromised accounts. Change these passwords immediately.", "priority": "High"})

    return jsonify({
        "risk_metrics": {"score": score, "level": level, "summary": f"Based on {len(history)} scans."},
        "recommendations": recommendations
    })

@ai_bp.route('/password-analysis', methods=['POST'])
@jwt_required()
def password_analysis():
    data = request.get_json()
    pwd = data.get('password', '')
    return jsonify(local_password_analysis(pwd))

@ai_bp.route('/privacy-analysis', methods=['POST'])
@jwt_required()
def privacy_analysis():
    data = request.get_json()
    habits = data.get('habits', {})
    
    score = 100
    suggestions = []
    
    if habits.get('reusedPasswords'):
        score -= 25
        suggestions.append({"title": "Stop Password Reuse", "desc": "Using the same password everywhere is dangerous.", "priority": "High"})
    
    if not habits.get('use2FA'):
        score -= 20
        suggestions.append({"title": "Enable 2FA", "desc": "Security is significantly weaker without 2FA.", "priority": "High"})

    if not habits.get('updateRegularly'):
        score -= 10
        suggestions.append({"title": "Regular Updates", "desc": "Old passwords are more likely to be in leaks.", "priority": "Medium"})

    level = "Safe"
    if score < 75: level = "Medium Risk"
    if score < 50: level = "High Risk"

    return jsonify({
        "score": max(0, score),
        "level": level,
        "suggestions": suggestions
    })
