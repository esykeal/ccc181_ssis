from app.db import get_db_connection
from psycopg2.extras import DictCursor

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
                "id": row["id"],
                "student_id": row["student_id"],
                "firstname": row["firstname"],
                "lastname": row["lastname"],
                "program_code": row["program_code"],
                "year": row["year"],
                "gender": row["gender"]
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
                "id": row["id"],
                "student_id": row["student_id"],
                "firstname": row["firstname"],
                "lastname": row["lastname"],
                "program_code": row["program_code"],
                "year": row["year"],
                "gender": row["gender"]
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
                "id": new_row["id"],
                "student_id": new_row["student_id"],
                "firstname": new_row["firstname"],
                "lastname": new_row["lastname"],
                "program_code": new_row["program_code"],
                "year": new_row["year"],
                "gender": new_row["gender"]
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
                "id": updated_row["id"],
                "student_id": updated_row["student_id"],
                "firstname": updated_row["firstname"],
                "lastname": updated_row["lastname"],
                "program_code": updated_row["program_code"],
                "year": updated_row["year"],
                "gender": updated_row["gender"]
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

    @classmethod
    def get_count(cls):
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute("SELECT COUNT(*) FROM student_table")
            count = cur.fetchone()[0]
            return count
        except Exception as e:
            return 0
        finally:
            cur.close()
            conn.close()

    #
    @classmethod
    def by_pagination(cls, page: int, limit: int, sort_by: str = None, sort_order: str = 'ASC', search: str = ''):
        offset = (page - 1) * limit

        # 1. Allowlist
        allowed_columns = {'student_id', 'firstname', 'lastname', 'program_code', 'year', 'gender'}
        if not sort_by or sort_by not in allowed_columns:
            sort_by = 'student_id'
        
        if sort_order.upper() not in ['ASC', 'DESC']:
            sort_order = 'ASC'
        else:
            sort_order = sort_order.upper()

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)

        try:
            base_query = """
                SELECT id, student_id, firstname, lastname, program_code, year, gender
                FROM student_table
            """
            count_query = "SELECT COUNT(*) AS total_count FROM student_table"

            params = []

            if search:
                search_term = f"%{search}%"
                where_clause = """
                    WHERE (student_id ILIKE %s 
                        OR firstname ILIKE %s 
                        OR lastname ILIKE %s 
                        OR gender ILIKE %s 
                        OR year::text ILIKE %s)
                """
                base_query += where_clause
                count_query += where_clause
                params.extend([search_term] * 5) 

            # 3. Sort & Paginate
            base_query += f" ORDER BY {sort_by} {sort_order} LIMIT %s OFFSET %s"
            params.extend([limit, offset])

            cur.execute(base_query, tuple(params))
            rows = cur.fetchall()

            # 4. Count Total
            count_params = [search_term] * 5 if search else []
            cur.execute(count_query, tuple(count_params))
            total_row = cur.fetchone()
            total = total_row['total_count'] if total_row else 0

            students = []
            for row in rows:
                students.append({
                    "id": row["id"],
                    "student_id": row["student_id"],
                    "firstname": row["firstname"],
                    "lastname": row["lastname"],
                    "program_code": row["program_code"],
                    "year": row["year"],
                    "gender": row["gender"]
                }) 

            return {
                "data": students,
                "page": page,
                "limit": limit,
                "total": total
            }
        
        finally:
            cur.close()
            conn.close()