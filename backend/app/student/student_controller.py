from flask import Blueprint, jsonify, request
from app.models.student_model import StudentModel
from app.models.program_model import ProgramModel

student_bp = Blueprint('student', __name__, url_prefix='/student')

@student_bp.route('/', methods=['GET'])
def get_students():
    page = request.args.get('page', type=int)
    limit = request.args.get('limit', type=int)
    sort_by = request.args.get('sort_by', 'student_id')
    sort_order = request.args.get('sort_order', 'asc')
    search = request.args.get('search', '')

    if page is not None and limit is not None:
        return get_paginated_student_handler(page, limit, sort_by, sort_order, search)

    try:
        students = StudentModel.get_all()
        return jsonify(students)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(StudentModel.get_all())

def get_paginated_student_handler(page, limit, sort_by, sort_order, search):
    try:
        page = max(1, page)
        limit = max(1, limit)

        pagination_data = StudentModel.by_pagination(page, limit, sort_by, sort_order, search)
        return jsonify(pagination_data), 200
    except Exception as e:
        print(f"Error fetching paginated programs: {e}")
        return jsonify({"error": str(e)}), 500

@student_bp.route('/<string:student_id>', methods=['GET'])
def get_student(student_id):
    student = StudentModel.get_by_id(student_id)
    if student:
        return jsonify(student)
    return jsonify({"error": "Student not found"}), 404

@student_bp.route('/', methods=['POST'])
def add_student():
    data = request.json
    required_fields = ['student_id', 'firstname', 'lastname', 'program_code', 'year', 'gender']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
        
    if not ProgramModel.get_by_code(data['program_code']):
        return jsonify({"error": "Program code does not exist"}), 400

    try:
        new_student = StudentModel.add(
            data['student_id'], data['firstname'], data['lastname'],
            data['program_code'], data['year'], data['gender']
        )
        return jsonify(new_student), 201
    except Exception as e:
        error_msg = str(e)
        if "duplicate key value" in error_msg:
             return jsonify({"error": "Student ID already exists"}), 409
        if "foreign key constraint" in error_msg:
            return jsonify({"error": "Program code does not exist"}), 400
        if "check constraint" in error_msg:
             return jsonify({"error": "Invalid year (1-4) or gender"}), 400
             
        return jsonify({"error": error_msg}), 500

@student_bp.route('/<string:student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    current_student = StudentModel.get_by_id(student_id)
    if not current_student:
        return jsonify({"error": "Student not found"}), 404
    
    if 'program_code' in data:
         if not ProgramModel.get_by_code(data['program_code']):
             return jsonify({"error": "New program code does not exist"}), 400

    try:
        updated_student = StudentModel.update(
            student_id,
            data.get('student_id', current_student['student_id']),
            data.get('firstname', current_student['firstname']),
            data.get('lastname', current_student['lastname']),
            data.get('program_code', current_student['program_code']),
            data.get('year', current_student['year']),
            data.get('gender', current_student['gender'])
        )
        return jsonify(updated_student), 200
    except Exception as e:
        error_msg = str(e)
        if "foreign key constraint" in error_msg:
            return jsonify({"error": "New program code does not exist"}), 400
        return jsonify({"error": error_msg}), 500

@student_bp.route('/<string:student_id>', methods=['DELETE'])
def delete_student(student_id):
    try:
        if StudentModel.delete(student_id):
            return jsonify({"message": "Student deleted successfully"}), 200
        return jsonify({"error": "Student not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500