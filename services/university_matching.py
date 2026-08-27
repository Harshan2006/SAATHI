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
        score = match["similarity_score"]

        if university_id not in universities:
            universities[university_id] = {
                "university_id": university_id,
                "university_name": university_name,
                "faculty_scores": []
            }

        universities[university_id]["faculty_scores"].append(score)

    results = []

    for university in universities.values():

        scores = university["faculty_scores"]

        best_score = max(scores)
        average_score = sum(scores) / len(scores)

        university_score = (
            (best_score * 0.70) +
            (average_score * 0.30)
        )

        results.append({
            "university_id": university["university_id"],
            "university_name": university["university_name"],
            "best_faculty_score": round(best_score, 4),
            "average_faculty_score": round(average_score, 4),
            "faculty_count": len(scores),
            "university_score": round(university_score, 4)
        })

    results.sort(
        key=lambda x: x["university_score"],
        reverse=True
    )

    return results[:limit]