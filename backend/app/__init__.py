from app.college.college_controller import college_bp
def create_app():
    
    app = Flask(__name__)

    app.register_blueprint(college_bp)

    return app
