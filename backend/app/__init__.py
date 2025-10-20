from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager 
from app.models.user_model import Users
from config import SECRET_KEYs

# Import your blueprints
from app.college.college_controller import college_bp
from app.program.program_controller import program_bp
from app.student.student_controller import student_bp
from app.stats.stats_controller import stats_bp
from app.users.auth_controller import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_mapping(SECRET_KEY = SECRET_KEYs)

    CORS(app, supports_credentials=True)

    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return Users.get_by_id(user_id)

    app.register_blueprint(college_bp)
    app.register_blueprint(program_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(auth_bp) 

    return app