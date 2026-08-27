from database.connection import get_connection
from services.matching import match_faculty


def match_universities(problem_id, limit=5):

    faculty_matches = match_faculty(problem_id, limit=20)

    if faculty_matches is None:
        return None

    universities = {}

    for match in faculty_matches:

        university_id = match["university_id"]
        university_name = match["university_name"]
        score = match["similarity"]

        if university_id not in universities:
            universities[university_id] = {
                "university_id": university_id,
                "university_name": university_name,
                "faculty_scores": []
            }

        universities[university_id]["faculty_scores"].append(score)

    results = []

    # Enrich the grouped faculty results with the university information the
    # citizen-facing recommendation cards need.
    university_details = {}
    if universities:
        conn = get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT id, name, description, location FROM universities WHERE id = ANY(%s)",
                    (list(universities.keys()),),
                )
                university_details = {
                    row[0]: {"name": row[1], "description": row[2], "location": row[3]}
                    for row in cursor.fetchall()
                }
        finally:
            conn.close()

    for university in universities.values():

        scores = university["faculty_scores"]

        best_score = max(scores)
        average_score = sum(scores) / len(scores)

        university_score = (
            (best_score * 0.70) +
            (average_score * 0.30)
        )

        results.append({
            "id": university["university_id"],
            "name": university_details.get(university["university_id"], {}).get("name") or university["university_name"],
            "description": university_details.get(university["university_id"], {}).get("description") or "Recommended from matched faculty expertise.",
            "location": university_details.get(university["university_id"], {}).get("location") or "Location not listed",
            "similarity": round(max(0, university_score), 4),
            "matchedFacultyCount": len(scores),
        })

    results.sort(
        key=lambda x: x["university_score"],
        reverse=True
    )

    return results[:limit]
