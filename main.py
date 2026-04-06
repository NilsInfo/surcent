from flask import Flask, abort, render_template, request, redirect, url_for, session
import os
from pymongo import MongoClient
from config import Config
from utils.checkLogin import login_required

app = Flask(__name__)
app.config.from_object(Config)

client = MongoClient(app.config['MONGO_URI'])
db = client.get_default_database()
app.db = db

app.secret_key = os.getenv('SECRET_KEY', 'defaultsecretkey')

# registering the blueprints inform main.py that routes are defined in statItems.py and auth.py
from routes.statItems import items_bp
app.register_blueprint(items_bp)
from routes.auth import auth_bp
app.register_blueprint(auth_bp)
from routes.quizz import quizz_bp
app.register_blueprint(quizz_bp)

@app.route("/")
@login_required
def home():
    # print("User in session:", session.get("user"))
    return render_template("home.html", user=session.get("user"))

@app.route("/user")
@login_required
def get_user():
    return {
        "username" : "",
        "stats_done" : "",
        "best_score": "",
    }

@app.get("/stat/<id>")
@login_required
def get_stat(id):
    return {
        "title": "",
        "description": "",
        "number": "",
        "sources": "",
    }

@app.get("/stat/next")
@login_required
def get_next_stat(cookies):
    return {
        "title": "",
        "description": "",
        "number": "",
        "sources": "",
    }


@app.post("/stat")
@login_required
def post_stat(content):
    abort(401)