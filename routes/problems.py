from flask import Blueprint, request, jsonify, session
from database.connection import get_connection
from services.llm import analyze_problem
from services.embeddings import generate_embedding
from services.matching import match_faculty
from services.university_matching import match_universities
from pathlib import Path
from services.input_parser import extract_input
import os

UPLOAD_FOLDER = Path("uploads")
UPLOAD_FOLDER.mkdir(exist_ok=True)

problems_bp = Blueprint("problems", __name__)

@problems_bp.route("/api/problems", methods=["POST"])
def create_problem():
    data = request.get_json()
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    required_fields = ["title", "description"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO problems (
                    user_id, title, description, domain, latitude, longitude, status
                )
                VALUES (%s, %s, %s, %s, %s, %s, 'Submitted')
                RETURNING id;
                """,
                (user_id, data["title"], data["description"], data.get("domain"),
                 data.get("latitude"), data.get("longitude"))
            )
            problem_id = cursor.fetchone()[0]
            
            # Initial timeline step
            cursor.execute(
                "INSERT INTO status_updates (problem_id, stage, status, stakeholder, message) VALUES (%s, %s, %s, %s, %s)",
                (problem_id, "Submitted", "completed", "Citizen", "Complaint successfully filed.")
            )
            
            # Submission notification
            cursor.execute(
                "INSERT INTO notifications (user_id, type, message, complaint_id) VALUES (%s, %s, %s, %s)",
                (user_id, "Submission", f"Problem '{data['title']}' submitted.", problem_id)
            )
        conn.commit()
        return jsonify({"message": "Problem submitted", "problem_id": problem_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@problems_bp.route("/api/problems", methods=["GET"])
def get_problems():
    user_id = session.get("user_id")
    my_complaints = request.args.get("my_complaints") == "true"
    
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            query = """
                SELECT p.id, p.user_id, p.title, p.description, p.domain, p.severity,
                       p.affected_people, p.status, p.latitude, p.longitude, 
                       p.created_at, p.updated_at,
                       (SELECT COUNT(*) FROM supports WHERE problem_id = p.id) as support_count
                FROM problems p
            """
            params = []
            if my_complaints and user_id:
                query += " WHERE p.user_id = %s"
                params.append(user_id)
            
            query += " ORDER BY p.created_at DESC;"
            cursor.execute(query, params)
            rows = cursor.fetchall()

        problems = []
        for r in rows:
            problems.append({
                "id": r[0], "user_id": r[1], "title": r[2], "description": r[3],
                "domain": r[4], "severity": r[5], "affected_people": r[6], "status": r[7],
                "latitude": r[8], "longitude": r[9], "created_at": r[10].isoformat(),
                "updated_at": r[11].isoformat(), "supportCount": r[12]
            })
        return jsonify({"problems": problems}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@problems_bp.route("/api/problems/<int:problem_id>", methods=["GET"])
def get_problem(problem_id):
    user_id = session.get("user_id")
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT p.id, p.title, p.description, p.domain, p.severity,
                       p.affected_people, p.status, p.ai_summary, p.ai_keywords,
                       p.required_expertise, p.latitude, p.longitude,
                       p.created_at, p.updated_at, u.name,
                (SELECT COUNT(*) FROM supports WHERE problem_id = p.id) as support_count
                FROM problems p JOIN users u ON p.user_id = u.id WHERE p.id = %s
            """, (problem_id,))
            r = cursor.fetchone()
            if not r: return jsonify({"error": "Not found"}), 404

            # Fetch timeline
            cursor.execute("SELECT stage, status, stakeholder, message, created_at FROM status_updates WHERE problem_id = %s ORDER BY created_at ASC", (problem_id,))
            timeline_rows = cursor.fetchall()
            timeline = [{"stage": t[0], "status": t[1], "stakeholder": t[2], "description": t[3], "date": t[4].isoformat()} for t in timeline_rows]

        return jsonify({
            "id": r[0], "title": r[1], "description": r[2], "domain": r[3], "severity": r[4],
            "affected_people": r[5], "status": r[6], "ai_summary": r[7], "ai_keywords": r[8],
            "required_expertise": r[9], "latitude": r[10], "longitude": r[11],
            "created_at": r[12].isoformat(), "updated_at": r[13].isoformat(),
            "supportCount": r[15], "timeline": timeline, "user": {"name": r[14]}
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@problems_bp.route("/api/problems/<int:problem_id>/support", methods=["POST"])
def support_problem(problem_id):
    user_id = session.get("user_id")
    if not user_id: return jsonify({"error": "Auth required"}), 401
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO supports (user_id, problem_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", (user_id, problem_id))
        conn.commit()
        return jsonify({"message": "Supported"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@problems_bp.route("/api/problems/<int:problem_id>/analyze", methods=["POST"])
def analyze_problem_route(problem_id):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT title, description, user_id FROM problems WHERE id = %s", (problem_id,))
            p = cursor.fetchone()
            if not p: return jsonify({"error": "Not found"}), 404
            
            analysis = analyze_problem(p[0], p[1])
            embedding = generate_embedding(f"{p[0]} {p[1]} {analysis['summary']}")
            
            cursor.execute("""
                UPDATE problems SET ai_summary=%s, domain=%s, severity=%s, affected_people=%s,
                ai_keywords=%s, required_expertise=%s, embedding=%s::vector, status='Under Review'
                WHERE id=%s
            """, (analysis["summary"], analysis["domain"], analysis["severity"], analysis["affected_people"],
                  analysis["keywords"], analysis["required_expertise"], str(embedding), problem_id))
            
            cursor.execute("INSERT INTO status_updates (problem_id, stage, status, stakeholder, message) VALUES (%s, %s, %s, %s, %s)",
                           (problem_id, "AI Screening", "completed", "SAATHI AI", "Problem analyzed and categorized."))
        conn.commit()
        return jsonify({"analysis": analysis}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@problems_bp.route("/api/problems/<int:problem_id>/priority", methods=["PUT"])
def update_problem_priority(problem_id):
    user_id = session.get("user_id")
    priority = (request.get_json(silent=True) or {}).get("priority")
    allowed_priorities = {"Low", "Medium", "High", "Critical"}

    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    if priority not in allowed_priorities:
        return jsonify({"error": "Priority must be Low, Medium, High, or Critical"}), 400

    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE problems SET severity=%s WHERE id=%s AND user_id=%s",
                (priority.upper(), problem_id, user_id),
            )
            if cursor.rowcount == 0:
                return jsonify({"error": "Problem not found"}), 404
        conn.commit()
        return jsonify({"priority": priority}), 200
    except Exception as exc:
        if conn:
            conn.rollback()
        return jsonify({"error": str(exc)}), 500
    finally:
        if conn:
            conn.close()

@problems_bp.route("/api/problems/nearby", methods=["GET"])
def get_nearby_problems():
    lat = request.args.get("lat", type=float)
    lng = request.args.get("lng", type=float)
    if lat is None or lng is None: return jsonify([]), 200
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT p.id, p.title, p.domain, p.status, p.latitude, p.longitude,
                (SELECT COUNT(*) FROM supports WHERE problem_id = p.id) as support_count
                FROM problems p 
                WHERE ABS(latitude - %s) < 0.1 AND ABS(longitude - %s) < 0.1
                LIMIT 20
            """, (lat, lng))
            rows = cursor.fetchall()
        return jsonify([{"id": r[0], "title": r[1], "domain": r[2], "status": r[3], "latitude": r[4], "longitude": r[5], "supportCount": r[6]} for r in rows]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

@problems_bp.route("/api/parse-input", methods=["POST"])
def parse_input():
    if "file" not in request.files: return jsonify({"error": "No file"}), 400
    file = request.files["file"]
    path = UPLOAD_FOLDER / file.filename
    file.save(path)
    try:
        res = extract_input(str(path))
        return jsonify(res), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Force GC to release file handles (e.g. PdfReader on Windows)
        import gc
        gc.collect()
        try:
            if path.exists(): os.remove(path)
        except PermissionError:
            pass  # File still locked on Windows; will be cleaned up next time

@problems_bp.route("/api/problems/<int:problem_id>/matches", methods=["GET"])
def get_faculty_matches(problem_id):
    try:
        results = match_faculty(problem_id)
        if results is None:
            return jsonify({"error": "Problem not found"}), 404
        return jsonify({"matches": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@problems_bp.route("/api/problems/<int:problem_id>/universities", methods=["GET"])
def get_university_matches(problem_id):
    try:
        results = match_universities(problem_id)
        if results is None:
            return jsonify({"error": "Problem not found"}), 404
        return jsonify({"universities": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
