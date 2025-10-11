from flask import Blueprint, jsonify, request
from app.models.program_model import ProgramModel
from app.models.college_model import CollegeModel

# Define Blueprint
program_bp = Blueprint('programs', __name__, url_prefix='/programs')

# --- LIST (Get All) ---
@program_bp.route('/', methods=['GET'])
def get_programs():
    programs = ProgramModel.get_all()
    return jsonify(programs)

# --- READ (Get One) ---
@program_bp.route('/<string:code>', methods=['GET'])
def get_program(code):
    program = ProgramModel.get_by_code(code)
    if program:
        return jsonify(program)
    return jsonify({"error": "Program not found"}), 404

# --- CREATE (Add New) ---
@program_bp.route('/', methods=['POST'])
def add_program():
    data = request.json
    
    # Validate required fields
    if not data or 'program_code' not in data or 'program_name' not in data or 'college_code' not in data:
        return jsonify({"error": "Missing required fields: program_code, program_name, or college_code"}), 400\
        
    if not CollegeModel.get_by_code(data['college_code']):
        return jsonify({"error": "College code does not exist"}), 400

    try:
        new_program = ProgramModel.add(
            data['program_code'], 
            data['program_name'], 
            data['college_code']
        )
        return jsonify(new_program), 201
    except Exception as e:
        error_msg = str(e)
        if "duplicate key value" in error_msg:
             return jsonify({"error": "Program code already exists"}), 409
        if "foreign key constraint" in error_msg:
            return jsonify({"error": "College code does not exist"}), 400
            
        return jsonify({"error": error_msg}), 500

# --- UPDATE ---
@program_bp.route('/<string:code>', methods=['PUT'])
def update_program(code):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    current_program = ProgramModel.get_by_code(code)
    if not current_program:
        return jsonify({"error": "Program not found"}), 404

    new_code = data.get('program_code', current_program['program_code'])
    new_name = data.get('program_name', current_program['program_name'])
    new_college = data.get('college_code', current_program['college_code'])

    if new_code != current_program['program_code']:
        if ProgramModel.get_by_code(new_code):
            return jsonify({"error": f"Program code '{new_code}' already exists"}), 400

    if new_name != current_program['program_name']:
        if ProgramModel.get_by_name(new_name):
            return jsonify({"error": f"Program name '{new_name}' already exists"}), 400

    if new_college != current_program['college_code']:
         from app.models.college_model import CollegeModel
         if not CollegeModel.get_by_code(new_college):
             return jsonify({"error": "New college code does not exist"}), 400

    try:
        updated_program = ProgramModel.update(code, new_code, new_name, new_college)
        if updated_program:
            return jsonify(updated_program)
        return jsonify({"error": "Update failed"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- DELETE ---
@program_bp.route('/<string:code>', methods=['DELETE'])
def delete_program(code):
    try:
        success = ProgramModel.delete(code)
        if success:
            return jsonify({"message": "Program deleted successfully"}), 200
        return jsonify({"error": "Program not found"}), 404
        
    except Exception as e:
        error_msg = str(e)
        if "update or delete on table" in error_msg and "violates foreign key constraint" in error_msg:
             return jsonify({
                 "error": "Cannot delete this program because it has enrolled students. Please delete the students first."
             }), 400
        return jsonify({"error": error_msg}), 500