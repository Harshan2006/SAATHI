from database.connection import get_connection

def migrate():
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            print("--- Starting Final Migration ---")
            
            # 1. Update Users Table
            print("Updating users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;")
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;")
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;")
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS joined_date DATE DEFAULT CURRENT_DATE;")
            
            # 2. Update Problems Table
            print("Updating problems table...")
            cursor.execute("ALTER TABLE problems ALTER COLUMN longitude TYPE DOUBLE PRECISION;")
            cursor.execute("ALTER TABLE problems ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Submitted';")
            cursor.execute("ALTER TABLE problems ADD COLUMN IF NOT EXISTS required_expertise TEXT[];")

            # 3. Create Supporting Tables
            print("Creating feature tables...")
            
            # Timeline / Status Updates
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS status_updates (
                    id SERIAL PRIMARY KEY,
                    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
                    stage TEXT NOT NULL,
                    status TEXT NOT NULL,
                    message TEXT,
                    stakeholder TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            # Community Supports
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS supports (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, problem_id)
                );
            """)

            # Feedback
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS feedback (
                    id SERIAL PRIMARY KEY,
                    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                    comment TEXT,
                    resolution_status TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Notifications
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS notifications (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    type TEXT,
                    message TEXT,
                    complaint_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
                    read BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # 4. Mock Data for Experts (To ensure Matching works)
            # Check if universities exist, if not add some
            cursor.execute("SELECT COUNT(*) FROM universities")
            if cursor.fetchone()[0] == 0:
                print("Adding mock universities...")
                cursor.execute("""
                    INSERT INTO universities (name, description, location) VALUES 
                    ('BIT Mesra', 'Birla Institute of Technology', 'Ranchi'),
                    ('NIT Jamshedpur', 'National Institute of Technology', 'Jamshedpur'),
                    ('IIT ISM Dhanbad', 'Indian Institute of Technology', 'Dhanbad');
                """)

            conn.commit()
            print("--- Migration Successful! ---")
    except Exception as e:
        print(f"--- Migration Failed: {e} ---")
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    migrate()
