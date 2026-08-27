from database.connection import get_connection

def migrate():
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            print("Adding auth columns to users table...")
            # Add missing columns to users
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;")
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;")
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;")
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS joined_date DATE DEFAULT CURRENT_DATE;")
            
            print("Updating problems table...")
            cursor.execute("ALTER TABLE problems ALTER COLUMN longitude TYPE DOUBLE PRECISION;")
            
            # Create status_updates table if missing
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS status_updates (
                    id SERIAL PRIMARY KEY,
                    problem_id INTEGER REFERENCES problems(id),
                    stage TEXT NOT NULL,
                    status TEXT NOT NULL,
                    message TEXT,
                    stakeholder TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            # Create notifications table if missing
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS notifications (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    type TEXT,
                    message TEXT,
                    complaint_id INTEGER,
                    read BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Create feedback table if missing
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS feedback (
                    id SERIAL PRIMARY KEY,
                    problem_id INTEGER REFERENCES problems(id),
                    user_id INTEGER REFERENCES users(id),
                    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                    comment TEXT,
                    resolution_status TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            # Create supports table if missing
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS supports (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    problem_id INTEGER REFERENCES problems(id),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, problem_id)
                );
            """)

            conn.commit()
            print("Migration successful!")
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    migrate()
