#
from app.db import get_db_connection
from psycopg2.extras import DictCursor

class ProgramModel:
    def __init__(self, id, program_code, program_name, college_code):
        self.id = id
        self.program_code = program_code
        self.program_name = program_name
        self.college_code = college_code

    @classmethod
    def get_all(cls):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        
        cur.execute("SELECT id, program_code, program_name, college_code FROM program_table")
        rows = cur.fetchall()
        
        cur.close()
        conn.close()
        
        programs = []
        for row in rows:
            programs.append({
                "id": row["id"],
                "program_code": row["program_code"],
                "program_name": row["program_name"],
                "college_code": row["college_code"]
            })
        return programs

    @classmethod
    def get_by_code(cls, code):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        
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
                "id": row["id"],
                "program_code": row["program_code"],
                "program_name": row["program_name"],
                "college_code": row["college_code"]
            }
        return None
    
    @classmethod
    def get_by_name(cls, program_name):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        cur.execute("""
            SELECT id, program_code, program_name, college_code 
            FROM program_table 
            WHERE LOWER(TRIM(program_name)) = LOWER(TRIM(%s))
        """, (program_name,))
        row = cur.fetchone()
        cur.close()
        conn.close()

        if row:
            return {
                "id": row["id"],
                "program_code": row["program_code"],
                "program_name": row["program_name"],
                "college_code": row["college_code"]
            }
        return None

    @classmethod
    def add(cls, code, name, college_code):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        try:
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
                "id": new_row["id"],
                "program_code": new_row["program_code"],
                "program_name": new_row["program_name"],
                "college_code": new_row["college_code"]
            }
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    @classmethod
    def update(cls, original_code, new_code, new_name, new_college_code):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
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
                    "id": updated_row["id"],
                    "program_code": updated_row["program_code"],
                    "program_name": updated_row["program_name"],
                    "college_code": updated_row["college_code"]
                }
            return None
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    @classmethod
    def delete(cls, code):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
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

    @classmethod
    def get_count(cls):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        try:
            cur.execute("SELECT COUNT(*) FROM program_table")
            count = cur.fetchone()[0]
            return count
        except Exception as e:
            return 0
        finally:
            cur.close()
            conn.close()    

    @classmethod
    def by_pagination(cls, page: int, limit: int, sort_by: str = None, sort_order: str = 'ASC', search: str = ''):
        offset = (page - 1) * limit

        allowed_columns = {'program_code', 'program_name', 'college_code', 'id'}

        if not sort_by or sort_by not in allowed_columns:
            sort_by = 'id'

        if sort_order.upper() not in ['ASC', 'DESC']:
            sort_order = 'ASC'
        else:
            sort_order = sort_order.upper()

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)

        try:
            base_query = """
                SELECT id, program_code, program_name, college_code
                FROM program_table
            """
            count_query = "SELECT COUNT(*) AS total_count FROM program_table"

            params = []

            if search:
                search_term = f"%{search}%"
                where_clause = " WHERE (program_code ILIKE %s OR program_name ILIKE %s OR college_code ILIKE %s)"

                base_query += where_clause
                count_query += where_clause
                params.extend([search_term, search_term, search_term]) 

            base_query += f" ORDER BY {sort_by} {sort_order} LIMIT %s OFFSET %s"
            params.extend([limit, offset])

            cur.execute(base_query, tuple(params))
            rows = cur.fetchall()
            
            count_params = [search_term, search_term, search_term] if search else []
            cur.execute(count_query, tuple(count_params))
            
            total_row = cur.fetchone()
            total = total_row['total_count'] if total_row else 0
            
            programs = []
            for row in rows:
                programs.append({
                    "id": row["id"], 
                    "program_code": row["program_code"], 
                    "program_name": row["program_name"],
                    "college_code" : row["college_code"]
                })
                
            return {
                    "data": programs,
                    "page": page,
                    "limit": limit,
                    "total": total
                }

        finally:
            cur.close()
            conn.close()