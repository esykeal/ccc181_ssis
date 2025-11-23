from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager 
from flask_session import Session
from app.models.user_model import Users
from .config import SECRET_KEY
import os

from app.college.college_controller import college_bp
from app.program.program_controller import program_bp
from app.student.student_controller import student_bp
from app.stats.stats_controller import stats_bp
from app.users.auth_controller import auth_bp
from app.users.user_controller import user_bp

def create_app():
    app = Flask(__name__, 
                static_folder="../dist", 
                static_url_path="/")
    
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY environment variable is required")
    
    app.config.from_mapping(SECRET_KEY=SECRET_KEY)
    app.config.update(
        SESSION_TYPE='filesystem',
        SESSION_COOKIE_NAME='session',
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Lax',
        SESSION_COOKIE_SECURE=False,
        PERMANENT_SESSION_LIFETIME=86400, 
        SESSION_REFRESH_EACH_REQUEST=True,
    )

    Session(app)

    CORS(app, 
         origins=["http://localhost:5173", "http://127.0.0.1:5000", "http://localhost:5000"], 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "Accept"],
         expose_headers=["Set-Cookie"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.session_protection = "strong"

    @login_manager.user_loader
    def load_user(user_id):
        return Users.get_by_id(user_id)

    app.register_blueprint(college_bp, url_prefix='/api/college')
    app.register_blueprint(program_bp, url_prefix='/api/programs')
    app.register_blueprint(student_bp, url_prefix='/api/student')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')

    @app.route("/")
    def serve():
        if os.path.exists(os.path.join(app.static_folder, "index.html")):
            return send_from_directory(app.static_folder, "index.html")
        return "Frontend not built", 404

    @app.errorhandler(404)
    def not_found(e):
        path = request.path
        
        if path and os.path.exists(os.path.join(app.static_folder, path.lstrip("/"))):
             return send_from_directory(app.static_folder, path.lstrip("/"))
        
        if os.path.exists(os.path.join(app.static_folder, "index.html")):
            return send_from_directory(app.static_folder, "index.html")
        
        return jsonify({"error": "Frontend build not found"}), 404

    return app