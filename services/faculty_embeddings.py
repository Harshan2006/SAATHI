from database.connection import get_connection
from services.embeddings import generate_embedding


def embed_faculty():

    conn = get_connection()

    try:
        with conn.cursor() as cursor:

            cursor.execute("""
                SELECT id, name, department, expertise
                FROM faculty
                WHERE embedding IS NULL;
            """)

            faculty_members = cursor.fetchall()

            for faculty_id, name, department, expertise in faculty_members:

                text = f"""
                Faculty: {name}
                Department: {department}
                Expertise: {expertise}
                """

                embedding = generate_embedding(text)

                cursor.execute("""
                    UPDATE faculty
                    SET embedding = %s::vector
                    WHERE id = %s;
                """, (
                    str(embedding),
                    faculty_id
                ))

        conn.commit()

    finally:
        conn.close()


if __name__ == "__main__":
    embed_faculty()