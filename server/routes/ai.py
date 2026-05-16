import os
import re
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user
from models import Scan

ai_bp = Blueprint('ai', __name__)

def local_analysis(pwd):
    patterns = []
    p = pwd.lower()
    
    # 1. Sequential Numerics
    if re.search(r'(123|234|345|456|567|678|789|890)', p): 
        patterns.append("Sequential Numerics Detected")
    
    # 2. Keyboard Patterns
    if re.search(r'(qwerty|asdfgh|zxcvbn)', p): 
        patterns.append("Keyboard Sequence Detected")
    
    # 3. Common Weak Words
    weak_words = ['password', 'admin', 'welcome', 'login', '123456']
    if any(word in p for word in weak_words):
        patterns.append("Common Weak Keyword Detected")

    # 4. Repeated Characters
    if re.search(r'(.)\1\1', p):
        patterns.append("Character Repetition Detected")

    advice = "Ensure your password uses a mix of unique characters and avoids predictable sequences."
    return {"patterns": patterns, "advice": advice, "engine": "Local Heuristic"}

@ai_bp.route('/password-analysis', methods=['POST'])
@jwt_required()
def password_analysis():
    data = request.get_json()
    pwd = data.get('password', '')
    result = local_analysis(pwd)
    return jsonify(result)

@ai_bp.route('/analysis', methods=['GET'])
@jwt_required()
def dashboard_analysis():
    # Fetch real user history from database
    history = Scan.query.filter_by(user_id=current_user.id).all()
    compromised_count = len([s for s in history if 'compromised' in (s.result or '').lower()])
    
    # Calculate Dynamic Score
    if not history:
        score = 100
        level = "Safe"
        summary = "No scans performed yet. Your system is ready."
        recommendations = [
            {"title": "Run First Scan", "description": "Check your primary email for potential leaks.", "priority": "High"}
        ]
    elif compromised_count > 0:
        score = max(30, 100 - (compromised_count * 15))
        level = "Critical" if compromised_count > 3 else "At Risk"
        summary = f"Detected {compromised_count} potential data leaks in your history."
        recommendations = [
            {"title": "Immediate Password Reset", "description": "Change passwords for all compromised accounts.", "priority": "High"},
            {"title": "Check Dark Web", "description": "Monitor if your personal info is being sold.", "priority": "Medium"}
        ]
    else:
        score = 95
        level = "Safe"
        summary = "All recent scans are clean. Maintain your security hygiene."
        recommendations = [
            {"title": "Enable 2FA", "description": "Add an extra layer of security to your accounts.", "priority": "Medium"},
            {"title": "Update Recovery Info", "description": "Ensure your backup email/phone is current.", "priority": "Low"}
        ]

    return jsonify({
        "risk_metrics": {"score": score, "level": level, "summary": summary},
        "recommendations": recommendations
    })

@ai_bp.route('/privacy-analysis', methods=['POST'])
@jwt_required()
def privacy_analysis():
    data = request.get_json()
    habits = data.get('habits', {})
    
    # Calculate score locally without AI (Matching Frontend Keys)
    score = 50 # Base score
    suggestions = []
    
    if habits.get('use2FA'):
        score += 30
    else:
        suggestions.append({"title": "Enable 2FA", "desc": "Two-factor authentication is the best defense against account takeovers.", "priority": "High"})
        
    if habits.get('reusedPasswords'):
        score -= 40
        suggestions.append({"title": "Stop Password Reuse", "desc": "Using the same password everywhere makes you vulnerable if one site is breached.", "priority": "High"})
    else:
        score += 10

    if habits.get('updateRegularly'):
        score += 10
    else:
        suggestions.append({"title": "Regular Updates", "desc": "Change sensitive passwords every 3-6 months to minimize exposure.", "priority": "Medium"})

    # Bound score between 0 and 100
    final_score = max(0, min(100, score))
    
    level = "Safe"
    if final_score < 40: level = "Critical"
    elif final_score < 75: level = "At Risk"

    return jsonify({
        "score": final_score, 
        "level": level, 
        "suggestions": suggestions if suggestions else [{"title": "Great Habits!", "desc": "Maintain your current security posture.", "priority": "Low"}]
    })
