from app.college.college_controller import college_bp
from app.program.program_controller import program_bp
def create_app():

    app = Flask(__name__)

    app.register_blueprint(college_bp)
    app.register_blueprint(program_bp)


    return app
