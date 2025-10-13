from app.db import get_db_connection
from psycopg2.extras import DictCursor

class CollegeModel:
    def __init__(self, id, college_code, college_name):
        self.id = id
        self.college_code = college_code
        self.college_name = college_name

    # --- LIST (Read All) ---
    @classmethod
    def get_all(cls):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        
        cur.execute("SELECT id, college_code, college_name FROM college_table")
        rows = cur.fetchall() 
        
        cur.close()
        conn.close()
        
        colleges = []
        for row in rows:
            colleges.append({
                "id": row["id"], 
                "college_code": row["college_code"], 
                "college_name": row["college_name"]
            })
        return colleges
    
    # --- READ (Get one by code) ---
    @classmethod
    def get_by_code(cls, code):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        
        cur.execute("SELECT id, college_code, college_name FROM college_table WHERE college_code = %s", (code,))
        row = cur.fetchone()
        
        cur.close()
        conn.close()

        if row:
            return {
                "id": row["id"], 
                "college_code": row["college_code"], 
                "college_name": row["college_name"]
            }
        return None
    
    @classmethod
    def get_by_name(cls, college_name):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        cur.execute("SELECT id, college_code, college_name FROM college_table WHERE college_name = %s", (college_name,))
        row = cur.fetchone()
        cur.close()
        conn.close()

        if row:
            return {
                "id": row["id"], 
                "college_code": row["college_code"], 
                "college_name": row["college_name"]
            }
        return None

    # --- CREATE ---
    @classmethod
    def add(cls, code, name):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        
        try:
            cur.execute(
                "INSERT INTO college_table (college_code, college_name) VALUES (%s, %s) RETURNING id, college_code, college_name",
                (code, name)
            )
            new_row = cur.fetchone()
            conn.commit()
            
            return {
                "id": new_row["id"], 
                "college_code": new_row["college_code"], 
                "college_name": new_row["college_name"]
            }
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    # --- UPDATE ---
    @classmethod
    def update(cls, original_code, new_code, new_name):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
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
                    "id": updated_row["id"], 
                    "college_code": updated_row["college_code"], 
                    "college_name": updated_row["college_name"]
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
        cur = conn.cursor(cursor_factory=DictCursor)
        try:
            cur.execute("DELETE FROM college_table WHERE college_code = %s RETURNING id", (code,))
            deleted_row = cur.fetchone()
            conn.commit()
            return True if deleted_row else False
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    @classmethod
    def get_count(cls):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        try:
            cur.execute("SELECT COUNT(*) FROM college_table")
            count_row = cur.fetchone()
            return count_row['count'] 
        except Exception as e:
            return 0
        finally:
            cur.close()
            conn.close()

    @classmethod
    def by_pagination(cls, page: int, limit: int, sort_by: str = None, sort_order: str = 'ASC'):
        offset = (page - 1) * limit

        allowed_columns = {'college_code', 'college_name', 'id'}
        
        if not sort_by or sort_by not in allowed_columns:
            sort_by = 'id' 
        
        if sort_order.upper() not in ['ASC', 'DESC']:
            sort_order = 'ASC'
        else:
            sort_order = sort_order.upper()

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)

        try:
            query = f"""
                SELECT id, college_code, college_name
                FROM college_table
                ORDER BY {sort_by} {sort_order}
                LIMIT %s OFFSET %s
            """
            
            cur.execute(query, (limit, offset))
            rows = cur.fetchall()
            
            cur.execute("SELECT COUNT(*) AS total_count FROM college_table")
            total_row = cur.fetchone()
            total = total_row['total_count'] if total_row else 0
            
            colleges = []
            for row in rows:
                colleges.append({
                    "id": row["id"], 
                    "college_code": row["college_code"], 
                    "college_name": row["college_name"]
                })
                
            return {
                    "data": colleges,
                    "page": page,
                    "limit": limit,
                    "total": total
                }

        finally:
            cur.close()
            conn.close()