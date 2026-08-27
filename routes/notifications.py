from flask import Blueprint, jsonify, session
from database.connection import get_connection

notifications_bp = Blueprint("notifications", __name__)

@notifications_bp.route("/api/notifications", methods=["GET"])
def get_notifications():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, type, message, complaint_id, read, created_at
                FROM notifications
                WHERE user_id = %s
                ORDER BY created_at DESC;
                """,
                (user_id,)
            )
            rows = cursor.fetchall()

        notifications = []
        for row in rows:
            notifications.append({
                "id": row[0],
                "type": row[1],
                "message": row[2],
                "complaint_id": row[3],
                "read": row[4],
                "created_at": row[5].isoformat()
            })

        return jsonify(notifications), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@notifications_bp.route("/api/notifications/<int:notification_id>/read", methods=["POST"])
def mark_as_read(notification_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE notifications SET read = TRUE WHERE id = %s AND user_id = %s",
                (notification_id, user_id)
            )
        conn.commit()
        return jsonify({"message": "Notification marked as read"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()
