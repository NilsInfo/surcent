from flask import Blueprint, request, redirect, url_for, render_template, session, current_app
import bcrypt

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

def col():
    return current_app.db.users  # 'users' collection


@auth_bp.route("/register", methods=["GET"])
def register():
    return render_template("register.html")


@auth_bp.route("/register", methods=["POST"])
def register_post():
    login = request.form.get("login")
    password = request.form.get("password")

    # Check if login already exists
    if col().find_one({"login": login}):
        return "Login already taken", 409

    # Hash the password
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    col().insert_one({
        "login": login,
        "password": hashed
    })

    return redirect(url_for("home"))

@auth_bp.route("/login", methods=["POST"])
def login_post():
    login = request.form.get("login")
    password = request.form.get("password")

    user = col().find_one({"login": login})

    if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return "Invalid credentials", 401

    session["user"] = login  # store user in session
    return redirect(url_for("home"))

@auth_bp.route("/login", methods=["GET"])
def login_get():
    return render_template("login.html")

    
@auth_bp.route("/logout", methods=["GET"])
def logout():
    session.pop("user", None)
    return redirect(url_for("home"))

