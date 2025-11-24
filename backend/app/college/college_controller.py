from flask import Blueprint, jsonify, request
from app.models.college_model import CollegeModel

college_bp = Blueprint('colleges', __name__, url_prefix='/colleges')

@college_bp.route('/', methods=['GET'])
def get_colleges():
    page = request.args.get('page', type=int)
    limit = request.args.get('limit', type=int)
    sort_by = request.args.get('sort_by', 'college_code')
    sort_order = request.args.get('sort_order', 'asc')
    search = request.args.get('search', '') 

    if page is not None and limit is not None:
        return get_paginated_colleges_handler(page, limit, sort_by, sort_order, search)
    
    try:
        colleges = CollegeModel.get_all()
        return jsonify(colleges), 200
    except Exception as e:
        return jsonify({"error": f"Database error: {e}"}), 500

def get_paginated_colleges_handler(page: int, limit: int, sort_by: str, sort_order: str, search: str):
    """Handles the pagination query and response structuring."""
    try:
        page = max(1, page)
        limit = max(1, limit)
        
        pagination_data = CollegeModel.by_pagination(page, limit, sort_by, sort_order, search)
        
        return jsonify(pagination_data), 200

    except Exception as e:
        print(f"Error fetching paginated colleges: {e}")
        return jsonify({
            "error": "Internal Server Error",
            "message": "Could not retrieve paginated college data."
        }), 500

@college_bp.route('/<string:code>', methods=['GET'])
def get_college(code):
    try:
        college = CollegeModel.get_by_code(code)
        if college:
            return jsonify(college)
        return jsonify({"error": "College not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Database error: {e}"}), 500

@college_bp.route('/', methods=['POST'])
def add_college():
    data = request.json

    if not data or 'college_code' not in data or 'college_name' not in data:
        return jsonify({"error": "Missing college_code or college_name"}), 400

    college_code = data['college_code'].strip()
    college_name = data['college_name'].strip()

    existing_code = CollegeModel.get_by_code(college_code)
    existing_name = CollegeModel.get_by_name(college_name)

    if existing_code and existing_name:
        return jsonify({"error": "College already exists"}), 409

    if existing_code:
        return jsonify({"error": "College code already exists"}), 409

    if existing_name:
        return jsonify({"error": "College name already exists"}), 409

    try:
        new_college = CollegeModel.add(college_code, college_name)
        return jsonify(new_college), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@college_bp.route('/<string:code>', methods=['PUT'])
def update_college(code):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    current_college = CollegeModel.get_by_code(code)
    if not current_college:
        return jsonify({"error": "College not found"}), 404

    new_code = data.get('college_code', current_college['college_code'])
    new_name = data.get('college_name', current_college['college_name'])

    if new_code != current_college['college_code'] and CollegeModel.get_by_code(new_code):
        return jsonify({"error": f"College code '{new_code}' already exists"}), 400
    
    if new_name != current_college['college_name'] and CollegeModel.get_by_name(new_name):
        return jsonify({"error": f"College name '{new_name}' already exists"}), 400

    try:
        updated_college = CollegeModel.update(code, new_code, new_name)
        if updated_college:
            return jsonify(updated_college)
        return jsonify({"error": "Update failed"}), 404 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@college_bp.route('/<string:code>', methods=['DELETE'])
def delete_college(code):
    try:
        success = CollegeModel.delete(code)
        if success:
            return jsonify({"message": "College deleted successfully"}), 200
        return jsonify({"error": "College not found"}), 404
    except Exception as e:
        if "foreign key constraint" in str(e):
             return jsonify({
                 "error": "Unable to delete college because there are programs (and students) listed under it."
             }), 400
        return jsonify({"error": str(e)}), 500