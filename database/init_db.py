import os
import sys
from pathlib import Path

# Add root directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from database.connection import get_connection

def init_db():
    schema_path = Path(__file__).parent / "schema.sql"
    if not schema_path.exists():
        print(f"Error: {schema_path} not found")
        return

    with open(schema_path, "r") as f:
        schema_sql = f.read()

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            print("Applying schema...")
            cursor.execute(schema_sql)
            conn.commit()
            print("Database initialized successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    init_db()
