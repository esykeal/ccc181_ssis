from flask import Blueprint, jsonify, request
from app.models.student_model import StudentModel
from app.models.program_model import ProgramModel
from app.services.cloudinary_service import upload_image

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
    data = request.form
    
    file = request.files.get('avatar')

    print(f"DEBUG RECEIVING -> Form: {data} | File: {file}")

    if not data.get('student_id') or not data.get('firstname') or not data.get('lastname'):
        return jsonify({"error": "Missing required fields"}), 400

    if StudentModel.get_by_id(data.get('student_id')):
        return jsonify({"error": "Student ID already exists"}), 409
        
    if not ProgramModel.get_by_code(data.get('program_code')):
         return jsonify({"error": "Program code does not exist"}), 400

    pfp_url = None
    if file:
        try:
            print(f"Uploading file: {file.filename}") 
            pfp_url = upload_image(file) 
            print(f"Cloudinary URL generated: {pfp_url}")
        except Exception as e:
            print(f"Upload failed: {e}")
    try:
        new_student = StudentModel.add(
            data['student_id'],
            data['firstname'],
            data['lastname'],
            data['program_code'],
            int(data['year']),
            data['gender'],
            pfp_url 
        )
        return jsonify(new_student), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@student_bp.route('/<string:student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.form
    file = request.files.get('avatar')
    
    current_student = StudentModel.get_by_id(student_id)
    if not current_student:
        return jsonify({"error": "Student not found"}), 404
    
    if 'program_code' in data:
         from app.models.program_model import ProgramModel 
         if not ProgramModel.get_by_code(data['program_code']):
             return jsonify({"error": "New program code does not exist"}), 400

    pfp_url = current_student.get('pfp_url') 
    
    if file:
        print(f"Uploading new avatar for {student_id}...")
        try:
            uploaded_url = upload_image(file)
            if uploaded_url:
                pfp_url = uploaded_url 
        except Exception as e:
            print(f"Upload failed: {e}")

    try:
        updated_student = StudentModel.update(
            student_id,                                            
            data.get('student_id', current_student['student_id']), 
            data.get('firstname', current_student['firstname']),
            data.get('lastname', current_student['lastname']),
            data.get('program_code', current_student['program_code']),
            int(data.get('year', current_student['year'])),
            data.get('gender', current_student['gender']),
            pfp_url 
        )
        return jsonify(updated_student), 200
    except Exception as e:
        print(f"Update Error: {e}")
        return jsonify({"error": str(e)}), 500

@student_bp.route('/<string:student_id>', methods=['DELETE'])
def delete_student(student_id):
    try:
        if StudentModel.delete(student_id):
            return jsonify({"message": "Student deleted successfully"}), 200
        return jsonify({"error": "Student not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500