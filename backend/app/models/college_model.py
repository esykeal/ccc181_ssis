from app.db import get_db_connection

class CollegeModel:
    def __init__(self, id, college_code, college_name):
        self.id = id
        self.college_code = college_code
        self.college_name = college_name

    #Lists all Colleges
    @classmethod
    def get_all(cls):
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT id, college_code, college_name FROM college_table")
        rows = cur.fetchall() # Returns a list of tuples
        
        cur.close()
        conn.close()
        
        # Convert tuples to dictionary format for JSON response
        colleges = []
        for row in rows:
            colleges.append({
                "id": row[0],
                "college_code": row[1],
                "college_name": row[2]
            })
        return colleges
    
    #Read(Get one by code)
    @classmethod
    def get_by_code(cls, code):
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Make sure 'college_table' matches your actual database table name!
        cur.execute("SELECT id, college_code, college_name FROM college_table WHERE college_code = %s", (code,))
        row = cur.fetchone()
        
        cur.close()
        conn.close()

        if row:
            return {
                "id": row[0],
                "college_code": row[1],
                "college_name": row[2]
            }
        return None
    
    @classmethod
    def get_by_name(cls, college_name):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, college_code, college_name FROM college_table WHERE college_name = %s", (college_name,))
        row = cur.fetchone()
        cur.close()
        conn.close()

        if row:
            return {
                "id": row[0],
                "college_code": row[1],
                "college_name": row[2]
            }
        return None

    #Creates 
    @classmethod
    def add(cls, code, name):
        conn = get_db_connection()
        cur = conn.cursor()
        
        try:
            cur.execute(
                "INSERT INTO college_table (college_code, college_name) VALUES (%s, %s) RETURNING id, college_code, college_name",
                (code, name)
            )
            new_row = cur.fetchone()
            conn.commit()
            
            return {
                "id": new_row[0],
                "college_code": new_row[1],
                "college_name": new_row[2]
            }
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    #Updates
    @classmethod
    def update(cls, original_code, new_code, new_name):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                """
                UPDATE college_table 
                SET college_code = %s, college_name = %s 
                WHERE college_code = %s 
                RETURNING id, college_code, college_name
                """,
                (new_code, new_name, original_code)
            )
            updated_row = cur.fetchone()
            conn.commit()
            
            if updated_row:
                return {
                    "id": updated_row[0],
                    "college_code": updated_row[1],
                    "college_name": updated_row[2]
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
            cur.execute("DELETE FROM college_table WHERE college_code = %s RETURNING id", (code,))
            deleted_id = cur.fetchone()
            conn.commit()
            return True if deleted_id else False
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    @classmethod
    def get_count(cls):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute("SELECT COUNT(*) FROM college_table")
            count = cur.fetchone()[0]
            return count
        except Exception as e:
            return 0
        finally:
            cur.close()
            conn.close()