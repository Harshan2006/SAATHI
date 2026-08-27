import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

DOMAINS = [
    "Education",
    "Agriculture",
    "Healthcare",
    "Water Management",
    "Environment",
    "Energy",
    "Urban Development",
    "Accessibility",
    "Public Administration",
    "Rural Livelihoods",
    "Infrastructure"
]

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_problem(title, description):

    prompt = f"""
You are an AI system for SAATHI, a societal problem-solving platform
for Jharkhand.

Analyze the following citizen-submitted problem.

TITLE:
{title}

DESCRIPTION:
{description}

Extract:

- summary: concise summary of the problem
- domain: choose exactly ONE domain from this list:
  Education
  Agriculture
  Healthcare
  Water Management
  Environment
  Energy
  Urban Development
  Accessibility
  Public Administration
  Rural Livelihoods
  Infrastructure
- severity: LOW, MEDIUM, HIGH, or CRITICAL. Apply this rubric strictly:
  LOW = limited inconvenience, no safety/health risk, and few people affected.
  MEDIUM = service disruption affecting a local group, but no immediate danger.
  HIGH = substantial or prolonged disruption, significant health/safety risk, or many households affected.
  CRITICAL = immediate threat to life, a major disaster, or essential-service failure requiring emergency action.
  Do not choose HIGH or CRITICAL merely because the citizen requests urgent action.
- affected_people: who is affected
- keywords: important keywords
- required_expertise: academic/technical expertise needed to solve it

Return ONLY a JSON object.

The JSON must contain exactly these fields:

{{
    "summary": "string",
    "domain": "string",
    "severity": "LOW",
    "affected_people": "string",
    "keywords": ["string"],
    "required_expertise": ["string"]
}}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": "Return only valid JSON. Do not include markdown, explanations, or code fences."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = response.choices[0].message.content

    if not content:
        raise ValueError("Groq returned an empty response")

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise ValueError(f"Groq returned invalid JSON: {content}")
