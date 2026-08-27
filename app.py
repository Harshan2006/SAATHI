from flask import Flask
from flask_cors import CORS
from database.connection import get_connection
from routes.problems import problems_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(problems_bp)


@app.route("/")
def home():
    try:
        conn = get_connection()
        conn.close()
        return "SAATHI backend + PostgreSQL connected!"
    except Exception as e:
        return f"Database connection failed: {e}"


if __name__ == "__main__":
    app.run(debug=True)