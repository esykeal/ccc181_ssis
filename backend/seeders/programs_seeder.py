import psycopg2
from os import getenv
from dotenv import load_dotenv

load_dotenv()

# --- DATA: 30 Programs ---
programs_data = [
    # CCS
    ("BSCS", "BS in Computer Science", "CCS"),
    ("BSIT", "BS in Information Technology", "CCS"),
    ("BSIS", "BS in Information Systems", "CCS"),
    ("MIT", "Master of Information Technology", "CCS"),
    # COE
    ("BSCE", "BS in Civil Engineering", "COE"),
    ("BSEE", "BS in Electrical Engineering", "COE"),
    ("BSME", "BS in Mechanical Engineering", "COE"),
    ("BSCpE", "BS in Computer Engineering", "COE"),
    ("BSECE", "BS in Electronics Engineering", "COE"),
    # CBA
    ("BSA", "BS in Accountancy", "CBA"),
    ("BSBA-FM", "BSBA Financial Management", "CBA"),
    ("BSBA-MM", "BSBA Marketing Management", "CBA"),
    ("BSHM", "BS in Hospitality Management", "CBA"),
    ("BSTM", "BS in Tourism Management", "CBA"),
    # CAS
    ("BA-COMM", "BA in Communication", "CAS"),
    ("BS-PSYCH", "BS in Psychology", "CAS"),
    ("BA-POLSCI", "BA in Political Science", "CAS"),
    ("BS-BIO", "BS in Biology", "CAS"),
    ("BA-ENG", "BA in English Language", "CAS"),
    # CON
    ("BSN", "BS in Nursing", "CON"),
    ("BSM", "BS in Midwifery", "CON"),
    ("BSPT", "BS in Physical Therapy", "CON"),
    ("BSMT", "BS in Medical Technology", "CON"),
    # CED
    ("BEED", "Bachelor of Elementary Education", "CED"),
    ("BSED-ENG", "BSED Major in English", "CED"),
    ("BSED-MATH", "BSED Major in Mathematics", "CED"),
    ("BSED-SCI", "BSED Major in Science", "CED"),
    # CAFA
    ("BSARCH", "BS in Architecture", "CAFA"),
    ("BFA-ID", "BFA Industrial Design", "CAFA"),
    ("BFA-VC", "BFA Visual Communication", "CAFA"),
]

def get_db_connection():
    return psycopg2.connect(
        host=getenv('DB_HOST'),
        database=getenv('DB_NAME'),
        user=getenv('DB_USERNAME'),
        password=getenv('DB_PASSWORD'),
        port=getenv('DB_PORT')
    )

def seed_programs():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        print("🔌 Connected to database...")

        print(f"📚 Seeding {len(programs_data)} Programs...")
        for p_code, p_name, c_code in programs_data:
            cur.execute("""
                INSERT INTO program_table (program_code, program_name, college_code)
                VALUES (%s, %s, %s)
                ON CONFLICT (program_code) DO NOTHING;
            """, (p_code, p_name, c_code))

        conn.commit()
        print("✅ Programs seeded successfully!")

    except Exception as e:
        print("❌ Error seeding programs:", e)
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    seed_programs()