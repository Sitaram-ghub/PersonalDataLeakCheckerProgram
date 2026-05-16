from flask import Blueprint
from .auth import auth_bp
from .check import check_bp
from .user import user_bp
from .admin import admin_bp
from .ai import ai_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(check_bp, url_prefix='/api/check')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
