import psycopg2
import random
from os import getenv
from dotenv import load_dotenv

load_dotenv()

# --- DATA: Name Pools ---
first_names = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
    "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
    "Christopher", "Lisa", "Daniel", "Nancy", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
    "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
    "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Melissa", "George", "Deborah", "Timothy", "Stephanie"
]

last_names = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
]

def get_db_connection():
    return psycopg2.connect(
        host=getenv('DB_HOST'),
        database=getenv('DB_NAME'),
        user=getenv('DB_USERNAME'),
        password=getenv('DB_PASSWORD'),
        port=getenv('DB_PORT')
    )

def seed_students():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        print("🔌 Connected to database...")

        # 1. Get valid programs so we don't assign students to non-existent courses
        cur.execute("SELECT program_code FROM program_table")
        valid_programs = [r[0] for r in cur.fetchall()]

        if not valid_programs:
            print("❌ No programs found! Run seed_programs.py first.")
            return

        print("🎓 Generating and Seeding 300 Students...")
        
        for i in range(300):
            # Random Attributes
            year_level = random.randint(1, 4)
            gender = random.choice(['Male', 'Female', 'Other'])
            f_name = random.choice(first_names)
            l_name = random.choice(last_names)
            program = random.choice(valid_programs)
            
            # ID Format: 2024-0001
            student_id = f"2024-{str(i+1).zfill(4)}"

            cur.execute("""
                INSERT INTO student_table (student_id, firstname, lastname, program_code, year, gender)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (student_id) DO NOTHING;
            """, (student_id, f_name, l_name, program, year_level, gender))

        conn.commit()
        print("✅ Students seeded successfully!")

    except Exception as e:
        print("❌ Error seeding students:", e)
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    seed_students()