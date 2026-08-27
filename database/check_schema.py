from database.connection import get_connection

def check_schema():
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            tables = ["users", "problems", "notifications", "feedback", "status_updates"]
            for table in tables:
                print(f"\nTable: {table}")
                try:
                    cursor.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}';")
                    columns = cursor.fetchall()
                    if not columns:
                        print("  Does not exist.")
                    for col in columns:
                        print(f"  - {col[0]} ({col[1]})")
                except Exception as e:
                    print(f"  Error checking table: {e}")
    except Exception as e:
        print(f"Connection error: {e}")
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    check_schema()
