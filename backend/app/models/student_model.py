from app.db import get_db_connection

class StudentModel:
    def __init__(self, id, student_id, firstname, lastname, program_code, year, gender):
        self.id = id
        self.student_id = student_id
        self.firstname = firstname
        self.lastname = lastname
        self.program_code = program_code
        self.year = year
        self.gender = gender

    # --- LIST (Read All) ---
    @classmethod
    def get_all(cls):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, student_id, firstname, lastname, program_code, year, gender 
            FROM student_table
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        students = []
        for row in rows:
            students.append({
                "id": row[0],
                "student_id": row[1],
                "firstname": row[2],
                "lastname": row[3],
                "program_code": row[4],
                "year": row[5],
                "gender": row[6]
            })
        return students

    # --- READ (Get One by Student ID) ---
    @classmethod
    def get_by_id(cls, student_id):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, student_id, firstname, lastname, program_code, year, gender 
            FROM student_table 
            WHERE student_id = %s
        """, (student_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()

        if row:
            return {
                "id": row[0],
                "student_id": row[1],
                "firstname": row[2],
                "lastname": row[3],
                "program_code": row[4],
                "year": row[5],
                "gender": row[6]
            }
        return None

    # --- CREATE ---
    @classmethod
    def add(cls, student_id, firstname, lastname, program_code, year, gender):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute("""
                INSERT INTO student_table (student_id, firstname, lastname, program_code, year, gender) 
                VALUES (%s, %s, %s, %s, %s, %s) 
                RETURNING id, student_id, firstname, lastname, program_code, year, gender
            """, (student_id, firstname, lastname, program_code, year, gender))
            new_row = cur.fetchone()
            conn.commit()
            return {
                "id": new_row[0],
                "student_id": new_row[1],
                "firstname": new_row[2],
                "lastname": new_row[3],
                "program_code": new_row[4],
                "year": new_row[5],
                "gender": new_row[6]
            }
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    # --- UPDATE ---
    @classmethod
    def update(cls, original_student_id, new_student_id, firstname, lastname, program_code, year, gender):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute("""
                UPDATE student_table 
                SET student_id=%s, firstname=%s, lastname=%s, program_code=%s, year=%s, gender=%s
                WHERE student_id = %s 
                RETURNING id, student_id, firstname, lastname, program_code, year, gender
            """, (new_student_id, firstname, lastname, program_code, year, gender, original_student_id))
            
            updated_row = cur.fetchone()
            conn.commit()
            
            if updated_row:
                return {
                    "id": updated_row[0],
                    "student_id": updated_row[1],
                    "firstname": updated_row[2],
                    "lastname": updated_row[3],
                    "program_code": updated_row[4],
                    "year": updated_row[5],
                    "gender": updated_row[6]
                }
            return None
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    # --- DELETE ---
    @classmethod
    def delete(cls, student_id):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute("DELETE FROM student_table WHERE student_id = %s RETURNING id", (student_id,))
            deleted_id = cur.fetchone()
            conn.commit()
            return True if deleted_id else False
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()