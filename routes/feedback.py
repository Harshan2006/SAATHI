from flask import Blueprint, request, jsonify, session
from database.connection import get_connection

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/api/feedback", methods=["POST"])
def submit_feedback():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    problem_id = data.get("problem_id")
    rating = data.get("rating")
    comment = data.get("comment")
    resolution_status = data.get("resolution_status")

    if not all([problem_id, rating]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO feedback (problem_id, user_id, rating, comment, resolution_status)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (problem_id, user_id, rating, comment, resolution_status)
            )
            feedback_id = cursor.fetchone()[0]
        conn.commit()
        return jsonify({"message": "Feedback submitted successfully", "id": feedback_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@feedback_bp.route("/api/feedback", methods=["GET"])
def get_user_feedback():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT f.id, f.problem_id, p.title, f.rating, f.comment, f.resolution_status, f.created_at
                FROM feedback f
                JOIN problems p ON f.problem_id = p.id
                WHERE f.user_id = %s
                ORDER BY f.created_at DESC;
                """,
                (user_id,)
            )
            rows = cursor.fetchall()

        feedback_list = []
        for row in rows:
            feedback_list.append({
                "id": row[0],
                "problem_id": row[1],
                "problem_title": row[2],
                "rating": row[3],
                "comment": row[4],
                "resolution_status": row[5],
                "created_at": row[6].isoformat()
            })

        return jsonify(feedback_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()
