import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from database.connection import get_connection
from routes.problems import problems_bp
from routes.transcribe import transcribe_bp
from routes.documents import documents_bp
from routes.input_parsing import input_parsing_bp
from routes.auth import auth_bp
from routes.notifications import notifications_bp
from routes.feedback import feedback_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev_secret_key_saathi_2026")
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=False, # Set to True in production with HTTPS
    PERMANENT_SESSION_LIFETIME=604800 # 7 days
)

# CORS - Allowing the Vite development server
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# Register Blueprints
app.register_blueprint(problems_bp)
app.register_blueprint(transcribe_bp)
app.register_blueprint(documents_bp)
app.register_blueprint(input_parsing_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(notifications_bp)
app.register_blueprint(feedback_bp)

@app.route("/")
def home():
    try:
        conn = get_connection()
        conn.close()
        return "SAATHI backend + PostgreSQL connected!"
    except Exception as e:
        return f"Database connection failed: {e}"

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
