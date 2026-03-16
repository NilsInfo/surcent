from flask import Flask, abort, render_template, request, redirect, url_for
from pymongo import MongoClient
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

client = MongoClient(app.config['MONGO_URI'])
db = client.get_default_database()
app.db = db

from routes.statItems import items_bp
app.register_blueprint(items_bp)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/user")
def get_user():
    return {
        "username" : "",
        "stats_done" : "",
        "best_score": "",
    }

@app.post("/login")
def login():
    abort(401)

@app.get("/stat/<id>")
def get_stat(id):
    return {
        "title": "",
        "description": "",
        "number": "",
        "sources": "",
    }

@app.get("/stat/next")
def get_next_stat(cookies):
    return {
        "title": "",
        "description": "",
        "number": "",
        "sources": "",
    }


@app.post("/stat")
def post_stat(content):
    abort(401)