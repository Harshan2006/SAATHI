from database.connection import get_connection
from services.embeddings import generate_embedding

def match_faculty(problem_id, limit=5):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            # Check if embedding already exists
            cursor.execute("SELECT embedding, domain, title, required_expertise FROM problems WHERE id = %s;", (problem_id,))
            problem = cursor.fetchone()
            if not problem: return None

            embedding, domain, title, required_expertise = problem

            # If embedding is missing, generate it now (safety fallback)
            if embedding is None:
                expertise_text = f"Problem Domain: {domain}\nProblem: {title}\nRequired Expertise: {', '.join(required_expertise or [])}"
                problem_embedding = generate_embedding(expertise_text)
                cursor.execute("UPDATE problems SET embedding = %s::vector WHERE id = %s;", (str(problem_embedding), problem_id))
                embedding = str(problem_embedding)
            
            # Semantic matching using pgvector
            cursor.execute("""
                SELECT f.id, f.name, f.department, f.expertise, u.id, u.name,
                1 - (f.embedding <=> %s::vector) AS similarity
                FROM faculty f
                JOIN universities u ON f.university_id = u.id
                WHERE f.embedding IS NOT NULL
                ORDER BY f.embedding <=> %s::vector
                LIMIT %s;
            """, (embedding, embedding, limit))

            rows = cursor.fetchall()
            return [{
                "id": r[0], "name": r[1], "department": r[2], "expertise": r[3],
                "university_id": r[4], "university_name": r[5], "similarity": round(float(r[6]), 4)
            } for r in rows]
    finally:
        conn.close()
