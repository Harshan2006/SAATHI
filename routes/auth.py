from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from database.connection import get_connection

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    role = data.get("role", "CITIZEN")

    if not all([name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                return jsonify({"error": "User already exists"}), 400

            password_hash = generate_password_hash(password)
            cursor.execute(
                """
                INSERT INTO users (name, email, password_hash, role, phone)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, name, email, role;
                """,
                (name, email, password_hash, role, phone)
            )
            user = cursor.fetchone()
            conn.commit()

        session["user_id"] = user[0]
        session.permanent = True
        return jsonify({"id": user[0], "name": user[1], "email": user[2], "role": user[3]}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password required"}), 400

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, email, password_hash, role FROM users WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()

        if user and check_password_hash(user[3], password):
            session["user_id"] = user[0]
            session.permanent = True # Keep session alive
            return jsonify({"id": user[0], "name": user[1], "email": user[2], "role": user[4]}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@auth_bp.route("/api/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logged out"}), 200

@auth_bp.route("/api/me", methods=["GET"])
def get_me():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, email, role, phone, location, joined_date FROM users WHERE id = %s",
                (user_id,)
            )
            user = cursor.fetchone()

            if not user:
                return jsonify({"error": "Not found"}), 404

            cursor.execute("SELECT COUNT(*) FROM problems WHERE user_id = %s", (user_id,))
            submitted = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM problems WHERE user_id = %s AND status = 'Resolved'", (user_id,))
            resolved = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM problems WHERE user_id = %s AND status NOT IN ('Resolved', 'Rejected')", (user_id,))
            in_progress = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM supports WHERE user_id = %s", (user_id,))
            support_given = cursor.fetchone()[0]

        return jsonify({
            "id": user[0], "name": user[1], "email": user[2], "role": user[3],
            "phone": user[4], "location": user[5], "joinedDate": str(user[6]),
            "stats": {"submitted": submitted, "resolved": resolved, "inProgress": in_progress, "supportGiven": support_given}
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@auth_bp.route("/api/profile", methods=["PUT"])
def update_profile():
    user_id = session.get("user_id")
    if not user_id: return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json()
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE users SET name=%s, phone=%s, location=%s WHERE id=%s",
                (data.get("name"), data.get("phone"), data.get("location"), user_id)
            )
        conn.commit()
        return jsonify({"message": "Profile updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()
