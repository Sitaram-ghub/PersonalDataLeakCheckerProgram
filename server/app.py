import os
from flask import Flask, jsonify, send_from_directory
from config import Config
from extensions import db, jwt, bcrypt, cors, migrate, limiter
from routes import register_routes
from models import User
from dotenv import load_dotenv

load_dotenv()

def create_app(config_class=Config):
    # Set static folder to the compiled React build
    app = Flask(__name__, static_folder='../client/dist', static_url_path='/')
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    migrate.init_app(app, db)
    limiter.init_app(app)

    # Register blueprints
    register_routes(app)

    # JWT user lookup callback
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        return User.query.filter_by(id=identity).one_or_none()

    # Serve React Frontend
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(404)
    def not_found_error(error):
        # In production, redirect to React app instead of JSON error
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'ok'}), 200

    return app

try:
    app = create_app()
    with app.app_context():
        db.create_all()
    print("Server initialized successfully")
except Exception as e:
    print(f"CRITICAL STARTUP ERROR: {e}")
    import traceback
    traceback.print_exc()
    raise e

if __name__ == '__main__':
    app.run(debug=True, port=5000)
