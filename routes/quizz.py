from flask import jsonify, Blueprint, session, request, jsonify, render_template, current_app, session, redirect, url_for
from bson import ObjectId
import random

quizz_bp = Blueprint("quizz", __name__, url_prefix="/quizz")


def quizzes():
    return current_app.db.items  

    
def quizzes_users():
    return current_app.db.userQuizzes;  

@quizz_bp.route("/", methods=["GET"])
def quizz():
    quizzesDone = list(quizzes_users().find({"user": session.get("user")}))
    ids = [q["_id"] for q in quizzesDone]
    if(len(quizzesDone) < quizzes().count_documents({})):
        item = random.choice(list(quizzes().find({"_id": {"$nin": ids}})))
    else:
        return "You have answered all quizzes!", 400
    print(item)
    context = {
        "user": session.get("user"),
        "userQuizzesDone": len(quizzesDone),
        "totalQuizzes": quizzes().count_documents({}),
        "question": item.get("title"),
        "id": str(item.get("_id"))
    }
    return render_template("quizz.html", **context)


@quizz_bp.route("/answer", methods=["GET", "POST"])
def quizz_answer():
    if "user" not in session:
        return redirect(url_for("auth.login_get"))
    value = request.form.get("value")
    id = request.form.get("id")
    print(id, value)
    # Compare value with the correct answer
    item = current_app.db.items.find_one({"_id": ObjectId(id)})
    retmess = ""
    if not item:
        return "Item not found", 404
    else:
        if item.get("answer") == value:
            retmess = "Correct!"    
        else:
            retmess = "Incorrect, BIG LOSER"

    current_app.db.userQuizzes.insert_one({
        "user": session["user"],
        "quiz_id": id,
        "answer": value,
        "correct": item.get("answer") == value
    })
    return jsonify({"message": f"You answered: {value} {retmess}. The correct answer was: {item.get('answer')}"})