from app.db import get_db_connection

class ProgramModel:
    def __init__(self, id, program_code, program_name, college_code):
        self.id = id
        self.program_code = program_code
        self.program_name = program_name
        self.college_code = college_code

    # --- LIST (Read All) ---
    @classmethod
    def get_all(cls):
        conn = get_db_connection()
        cur = conn.cursor()
        
        # We select all columns, including the foreign key college_code
        cur.execute("SELECT id, program_code, program_name, college_code FROM program_table")
        rows = cur.fetchall()
        
        cur.close()
        conn.close()
        
        programs = []
        for row in rows:
            programs.append({
                "id": row[0],
                "program_code": row[1],
                "program_name": row[2],
                "college_code": row[3]
            })
        return programs

    # --- READ (Get One by Code) ---
    @classmethod
    def get_by_code(cls, code):
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, program_code, program_name, college_code 
            FROM program_table 
            WHERE program_code = %s
        """, (code,))
        
        row = cur.fetchone()
        cur.close()
        conn.close()

        if row:
            return {
                "id": row[0],
                "program_code": row[1],
                "program_name": row[2],
                "college_code": row[3]
            }
        return None

    # --- CREATE ---
    @classmethod
    def add(cls, code, name, college_code):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            # We must include college_code in the INSERT
            cur.execute(
                """
                INSERT INTO program_table (program_code, program_name, college_code) 
                VALUES (%s, %s, %s) 
                RETURNING id, program_code, program_name, college_code
                """,
                (code, name, college_code)
            )
            new_row = cur.fetchone()
            conn.commit()
            
            return {
                "id": new_row[0],
                "program_code": new_row[1],
                "program_name": new_row[2],
                "college_code": new_row[3]
            }
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    # --- UPDATE ---
    @classmethod
    def update(cls, original_code, new_code, new_name, new_college_code):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                """
                UPDATE program_table 
                SET program_code = %s, program_name = %s, college_code = %s 
                WHERE program_code = %s 
                RETURNING id, program_code, program_name, college_code
                """,
                (new_code, new_name, new_college_code, original_code)
            )
            updated_row = cur.fetchone()
            conn.commit()
            
            if updated_row:
                return {
                    "id": updated_row[0],
                    "program_code": updated_row[1],
                    "program_name": updated_row[2],
                    "college_code": updated_row[3]
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
    def delete(cls, code):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute("DELETE FROM program_table WHERE program_code = %s RETURNING id", (code,))
            deleted_id = cur.fetchone()
            conn.commit()
            return True if deleted_id else False
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()