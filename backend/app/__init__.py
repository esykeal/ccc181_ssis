from flask import Flask
from flask_cors import CORS
from app.college.college_controller import college_bp
from app.program.program_controller import program_bp
from app.student.student_controller import student_bp
from app.stats.stats_controller import stats_bp

def create_app():
    app = Flask(__name__)

    CORS(app)

    app.register_blueprint(college_bp)
    app.register_blueprint(program_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(stats_bp)

    return app