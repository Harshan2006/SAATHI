from database.connection import get_connection
from services.embeddings import generate_embedding


def match_faculty(problem_id, limit=5):

    conn = get_connection()

    try:
        with conn.cursor() as cursor:

            # Get problem
            cursor.execute("""
                SELECT
                    id,
                    title,
                    domain,
                    required_expertise
                FROM problems
                WHERE id = %s;
            """, (problem_id,))

            problem = cursor.fetchone()

            if not problem:
                return None

            (
                problem_id,
                title,
                domain,
                required_expertise
            ) = problem

            # Build expertise profile
            expertise_text = f"""
            Problem Domain: {domain}

            Problem: {title}

            Required Expertise:
            {", ".join(required_expertise or [])}
            """

            # Generate problem expertise embedding
            problem_embedding = generate_embedding(expertise_text)

            # Store embedding
            cursor.execute("""
                UPDATE problems
                SET embedding = %s::vector
                WHERE id = %s;
            """, (
                str(problem_embedding),
                problem_id
            ))

            # Semantic faculty matching
            cursor.execute("""
                SELECT
                    f.id,
                    f.name,
                    f.department,
                    f.expertise,
                    u.id,
                    u.name,
                    1 - (f.embedding <=> %s::vector) AS similarity
                FROM faculty f
                JOIN universities u
                    ON f.university_id = u.id
                WHERE f.embedding IS NOT NULL
                ORDER BY f.embedding <=> %s::vector
                LIMIT %s;
            """, (
                str(problem_embedding),
                str(problem_embedding),
                limit
            ))

            rows = cursor.fetchall()

        results = []

        for row in rows:

            (
                faculty_id,
                faculty_name,
                department,
                expertise,
                university_id,
                university_name,
                similarity
            ) = row

            results.append({
                "faculty_id": faculty_id,
                "faculty_name": faculty_name,
                "department": department,
                "expertise": expertise,
                "university_id": university_id,
                "university_name": university_name,
                "similarity_score": round(float(similarity), 4)
            })

        return results

    finally:
        conn.close()