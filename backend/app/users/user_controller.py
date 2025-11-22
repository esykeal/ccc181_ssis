from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models.user_model import Users
from app.services.cloudinary_service import upload_image

user_bp = Blueprint('users', __name__, url_prefix='/users')

@user_bp.route("/update", methods=["PUT"])
@login_required
def update():
    data = request.json
    updated = Users.update_user(
        current_user.id,
        data.get('username', current_user.username),
        data.get('email', current_user.email),
        data.get('password')
    )
    if updated:
        return jsonify({"success": True, "user": updated})
    return jsonify({"error": "Failed to update"}), 400

@user_bp.route("/", methods=["GET"])
@login_required
def get_all_users():
    users = Users.get_all()
    return jsonify(users), 200

@user_bp.route("/upload-avatar", methods=["POST"])
@login_required
def upload_avatar():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    image_url = upload_image(file)
    
    if not image_url:
        return jsonify({"error": "Upload to Cloudinary failed"}), 500
    updated_pfp = Users.update_avatar(current_user.id, image_url)
    
    if updated_pfp:
        return jsonify({
            "success": True, 
            "message": "Avatar updated successfully",
            "pfp_url": updated_pfp
        }), 200
        
    return jsonify({"error": "Database update failed"}), 500