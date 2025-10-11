from flask import Blueprint, jsonify
from app.models.student_model import StudentModel
from app.models.college_model import CollegeModel
from app.models.program_model import ProgramModel

stats_bp = Blueprint('stats', __name__, url_prefix='/stats')

@stats_bp.route('/', methods=['GET'])
def get_dashboard_stats():
    try:
        return jsonify({
            "total_students": StudentModel.get_count(),
            "total_colleges": CollegeModel.get_count(),
            "total_programs": ProgramModel.get_count()
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500