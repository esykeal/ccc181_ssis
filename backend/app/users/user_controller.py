from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models.user_model import Users

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