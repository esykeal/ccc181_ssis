from flask import Blueprint, jsonify, request
from app.models.college_model import CollegeModel

college_bp = Blueprint('colleges', __name__, url_prefix='/colleges')

# 1. LIST: Get all colleges
@college_bp.route('/', methods=['GET'])
def get_colleges():
    colleges = CollegeModel.get_all()
    return jsonify(colleges)

# 2. READ: Get one college by code
@college_bp.route('/<string:code>', methods=['GET'])
def get_college(code):
    college = CollegeModel.get_by_code(code)
    if college:
        return jsonify(college)
    return jsonify({"error": "College not found"}), 404

# 3. CREATE: Add a new college
@college_bp.route('/', methods=['POST'])
def add_college():
    data = request.json
    
    # Simple validation
    if not data or 'college_code' not in data or 'college_name' not in data:
        return jsonify({"error": "Missing college_code or college_name"}), 400

    try:
        new_college = CollegeModel.add(data['college_code'], data['college_name'])
        return jsonify(new_college), 201
    except Exception as e:
        # Check for duplicate key error (Postgres error code 23505)
        if "duplicate key value" in str(e):
             return jsonify({"error": "College code already exists"}), 409
        return jsonify({"error": str(e)}), 500
    
# 4. UPDATE: Edit a college
@college_bp.route('/<string:code>', methods=['PUT'])
def update_college(code):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Use existing values if new ones aren't provided
    current_college = CollegeModel.get_by_code(code)
    if not current_college:
        return jsonify({"error": "College not found"}), 404

    new_code = data.get('college_code', current_college['college_code'])
    new_name = data.get('college_name', current_college['college_name'])

    try:
        updated_college = CollegeModel.update(code, new_code, new_name)
        if updated_college:
            return jsonify(updated_college)
        return jsonify({"error": "Update failed"}), 500
    except Exception as e:
        if "duplicate key value" in str(e):
             return jsonify({"error": "New college code already exists"}), 409
        return jsonify({"error": str(e)}), 500
    
# 5. DELETE: Remove a college
@college_bp.route('/<string:code>', methods=['DELETE'])
def delete_college(code):
    try:
        success = CollegeModel.delete(code)
        if success:
            return jsonify({"message": "College deleted successfully"}), 200
        return jsonify({"error": "College not found"}), 404
    except Exception as e:
        if "update or delete on table" in str(e) and "violates foreign key constraint" in str(e):
             return jsonify({
                 "error": "Cannot delete college. It has related programs. Delete programs first."
             }), 400
        return jsonify({"error": str(e)}), 500