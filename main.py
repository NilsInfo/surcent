from flask import Flask, abort

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<h1>Hello, World!</h1>"

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