from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user, login_required, current_user
from app.models.user_model import Users

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route("/me", methods=["GET"])
def get_me():
    if current_user.is_authenticated:
        return jsonify({"success": True, "user": current_user.to_dict()})
    return jsonify({"success": False, "user": None})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = Users.get_by_username(data.get('username'))
    if user and user.check_password(data.get('password')):
        login_user(user, remember=True)
        
        from flask import session
        session.permanent = True
        
        return jsonify({"success": True, "user": user.to_dict()})
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    result = Users.create_user(data.get('username'), data.get('email'), data.get('password'))
    if result.get('success'):
        return jsonify({"message": "Account created. Please log in."}), 201
    return jsonify({"error": result.get('error')}), 409

@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True})