from flask import Blueprint, request, jsonify
from database.connection import get_connection
from services.llm import analyze_problem
from services.embeddings import generate_embedding
from services.matching import match_faculty
from services.university_matching import match_universities


problems_bp = Blueprint("problems", __name__)


@problems_bp.route("/api/problems", methods=["POST"])
def create_problem():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    required_fields = ["name", "title", "description"]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    try:
        conn = get_connection()

        with conn.cursor() as cursor:

            # Create user
            cursor.execute(
                """
                INSERT INTO users (name, email, role, organization)
                VALUES (%s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    data["name"],
                    data.get("email"),
                    data.get("role", "CITIZEN"),
                    data.get("organization")
                )
            )

            user_id = cursor.fetchone()[0]

            # Create problem
            cursor.execute(
                """
                INSERT INTO problems (
                    user_id,
                    title,
                    description,
                    domain,
                    latitude,
                    longitude
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    user_id,
                    data["title"],
                    data["description"],
                    data.get("domain"),
                    data.get("latitude"),
                    data.get("longitude")
                )
            )

            problem_id = cursor.fetchone()[0]

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Problem submitted successfully",
            "problem_id": problem_id
        }), 201

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

@problems_bp.route("/api/problems", methods=["GET"])
def get_problems():
    try:
        conn = get_connection()

        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    user_id,
                    title,
                    description,
                    domain,
                    severity,
                    affected_people,
                    status,
                    ai_summary,
                    ai_keywords,
                    latitude,
                    longitude,
                    created_at
                FROM problems
                ORDER BY created_at DESC;
            """)

            rows = cursor.fetchall()

        conn.close()

        problems = []

        for row in rows:
            problems.append({
                "id": row[0],
                "user_id": row[1],
                "title": row[2],
                "description": row[3],
                "domain": row[4],
                "severity": row[5],
                "affected_people": row[6],
                "status": row[7],
                "ai_summary": row[8],
                "ai_keywords": row[9],
                "latitude": row[10],
                "longitude": row[11],
                "created_at": row[12]
            })

        return jsonify({
            "count": len(problems),
            "problems": problems
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

@problems_bp.route("/api/problems/<int:problem_id>", methods=["GET"])
def get_problem(problem_id):
    try:
        conn = get_connection()

        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT
                    p.id,
                    p.user_id,
                    u.name,
                    u.email,
                    u.role,
                    u.organization,
                    p.title,
                    p.description,
                    p.domain,
                    p.severity,
                    p.affected_people,
                    p.status,
                    p.ai_summary,
                    p.ai_keywords,
                    p.latitude,
                    p.longitude,
                    p.created_at,
                    p.updated_at
                FROM problems p
                JOIN users u ON p.user_id = u.id
                WHERE p.id = %s;
            """, (problem_id,))

            row = cursor.fetchone()

        conn.close()

        if not row:
            return jsonify({
                "error": "Problem not found"
            }), 404

        problem = {
            "id": row[0],
            "user": {
                "id": row[1],
                "name": row[2],
                "email": row[3],
                "role": row[4],
                "organization": row[5]
            },
            "title": row[6],
            "description": row[7],
            "domain": row[8],
            "severity": row[9],
            "affected_people": row[10],
            "status": row[11],
            "ai_summary": row[12],
            "ai_keywords": row[13],
            "latitude": row[14],
            "longitude": row[15],
            "created_at": row[16],
            "updated_at": row[17]
        }

        return jsonify(problem), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
    

@problems_bp.route("/api/problems/<int:problem_id>/analyze", methods=["POST"])
def analyze_problem_route(problem_id):
    try:
        conn = get_connection()

        # Get problem
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT title, description
                FROM problems
                WHERE id = %s;
            """, (problem_id,))

            problem = cursor.fetchone()

        if not problem:
            conn.close()

            return jsonify({
                "error": "Problem not found"
            }), 404

        title, description = problem

        # 1. Analyze with Groq
        analysis = analyze_problem(title, description)

        # 2. Build semantic text for embedding
        embedding_text = f"""
        Problem: {title}

        Description: {description}

        Summary: {analysis["summary"]}

        Domain: {analysis["domain"]}

        Keywords: {", ".join(analysis["keywords"])}

        Required Expertise: {", ".join(analysis["required_expertise"])}
        """

        # 3. Generate embedding
        embedding = generate_embedding(embedding_text)

        # 4. Store AI analysis + embedding
        with conn.cursor() as cursor:
            sql = """
                UPDATE problems
                SET
                    ai_summary = %s,
                    domain = %s,
                    severity = %s,
                    affected_people = %s,
                    ai_keywords = %s,
                    required_expertise = %s,
                    embedding = %s::vector,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s;
            """

            params = (
                analysis["summary"],
                analysis["domain"],
                analysis["severity"],
                analysis["affected_people"],
                analysis["keywords"],
                analysis["required_expertise"],
                str(embedding),
                problem_id
            )

            cursor.execute(sql, params)

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Problem analyzed and embedded successfully",
            "problem_id": problem_id,
            "analysis": analysis
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


@problems_bp.route("/api/problems/<int:problem_id>/matches", methods=["GET"])
def get_matches(problem_id):

    try:
        matches = match_faculty(problem_id)

        if matches is None:
            return jsonify({
                "error": "Problem not found"
            }), 404

        return jsonify({
            "problem_id": problem_id,
            "matches": matches
        }), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

@problems_bp.route(
    "/api/problems/<int:problem_id>/universities",
    methods=["GET"]
)
def get_university_matches(problem_id):

    try:
        matches = match_universities(problem_id)

        if matches is None:
            return jsonify({
                "error": "Problem not found"
            }), 404

        return jsonify({
            "problem_id": problem_id,
            "universities": matches
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500