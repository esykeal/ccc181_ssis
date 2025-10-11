import psycopg2
from os import getenv
from dotenv import load_dotenv

load_dotenv()

# --- DATA: 7 Colleges ---
colleges_data = [
    ("CCS", "College of Computer Studies"),
    ("COE", "College of Engineering"),
    ("CBA", "College of Business Administration"),
    ("CAS", "College of Arts and Sciences"),
    ("CON", "College of Nursing"),
    ("CED", "College of Education"),
    ("CAFA", "College of Architecture and Fine Arts"),
]

def get_db_connection():
    return psycopg2.connect(
        host=getenv('DB_HOST'),
        database=getenv('DB_NAME'),
        user=getenv('DB_USERNAME'),
        password=getenv('DB_PASSWORD'),
        port=getenv('DB_PORT')
    )

def seed_colleges():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        print("🔌 Connected to database...")

        print(f"🏛️  Seeding {len(colleges_data)} Colleges...")
        for code, name in colleges_data:
            cur.execute("""
                INSERT INTO college_table (college_code, college_name)
                VALUES (%s, %s)
                ON CONFLICT (college_code) DO NOTHING;
            """, (code, name))

        conn.commit()
        print("✅ Colleges seeded successfully!")

    except Exception as e:
        print("❌ Error seeding colleges:", e)
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    seed_colleges()