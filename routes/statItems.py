from flask import Blueprint, render_template, request, jsonify, current_app, redirect, session, url_for
from bson import ObjectId

items_bp = Blueprint("stats", __name__, url_prefix="/stats")

def col():
    return current_app.db.items  # 'items' collection

@items_bp.route("/new")
def add_quizz():
    # print("User in session:", session.get("user"))
    return render_template("add_quizz.html", user=session.get("user"))

# ── CREATE ──────────────────────────────────────────────
@items_bp.route("/create", methods=["POST"])
def create_item_form():
    data = {
        "title": request.form.get("title"),
        "description": request.form.get("description"),
        "year": request.form.get("year"),
        "scope": request.form.get("scope"),
        "answer": request.form.get("answer"),
        "source": request.form.get("source"),
    }
    col().insert_one(data)
    return redirect(url_for("home"))


# ── READ ALL ─────────────────────────────────────────────
@items_bp.route("/", methods=["GET"])
def get_items():
    items = list(col().find())
    for item in items:
        item["_id"] = str(item["_id"])
    return jsonify(items)


## NOT USED YET - PLACEHOLDERS ##

# # ── READ ONE ─────────────────────────────────────────────
# @items_bp.route("/<id>", methods=["GET"])
# def get_item(id):
#     try:
#         item = col().find_one({"_id": ObjectId(id)})
#     except Exception:
#         return jsonify({"error": "Invalid ID format"}), 400

#     if not item:
#         return jsonify({"error": "Item not found"}), 404

#     item["_id"] = str(item["_id"])
#     return jsonify(item)


# # ── UPDATE ───────────────────────────────────────────────
# @items_bp.route("/<id>", methods=["PUT"])
# def update_item(id):
#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "No data provided"}), 400

#     try:
#         result = col().update_one({"_id": ObjectId(id)}, {"$set": data})
#     except Exception:
#         return jsonify({"error": "Invalid ID format"}), 400

#     if result.matched_count == 0:
#         return jsonify({"error": "Item not found"}), 404

#     return jsonify({"updated": True})


# # ── DELETE ───────────────────────────────────────────────
# @items_bp.route("/<id>", methods=["DELETE"])
# def delete_item(id):
#     try:
#         result = col().delete_one({"_id": ObjectId(id)})
#     except Exception:
#         return jsonify({"error": "Invalid ID format"}), 400

#     if result.deleted_count == 0:
#         return jsonify({"error": "Item not found"}), 404

#     return jsonify({"deleted": True})