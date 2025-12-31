from app.db import get_db_connection
from psycopg2.extras import DictCursor

class StudentModel:
    def __init__(self, id, student_id, firstname, lastname, program_code, year, gender, pfp_url):
        self.id = id
        self.student_id = student_id
        self.firstname = firstname
        self.lastname = lastname
        self.program_code = program_code
        self.year = year
        self.gender = gender
        self.pfp_url = pfp_url

    @classmethod
    def get_all(cls):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, student_id, firstname, lastname, program_code, year, gender, pfp_url
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
                "gender": row["gender"],
                "pfp_url": row["pfp_url"]
            })
        return students

    @classmethod
    def get_by_id(cls, student_id):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, student_id, firstname, lastname, program_code, year, gender, pfp_url 
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
                    "gender": row[6],
                    "pfp_url": row[7]
            }
        return None

    @classmethod
    def add(cls, student_id, firstname, lastname, program_code, year, gender, pfp_url=None):
        conn = get_db_connection()
        cur = conn.cursor()
        
        try:
            cur.execute("""
                INSERT INTO student_table 
                (student_id, firstname, lastname, program_code, year, gender, pfp_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id, student_id, firstname, lastname, program_code, year, gender, pfp_url
            """, (student_id, firstname, lastname, program_code, year, gender, pfp_url))
            
            row = cur.fetchone()
            conn.commit()
            
            return {
                "id": row[0],
                "student_id": row[1],
                "firstname": row[2],
                "lastname": row[3],
                "program_code": row[4],
                "year": row[5],
                "gender": row[6],
                "pfp_url": row[7]
            }
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    @classmethod
    def update(cls, original_student_id, new_student_id, firstname, lastname, program_code, year, gender, pfp_url):
        conn = get_db_connection()
        cur = conn.cursor()
        
        try:
            cur.execute("""
                UPDATE student_table 
                SET student_id = %s,
                    firstname = %s,
                    lastname = %s,
                    program_code = %s,
                    year = %s,
                    gender = %s,
                    pfp_url = %s
                WHERE student_id = %s
                RETURNING id, student_id, firstname, lastname, program_code, year, gender, pfp_url
            """, (new_student_id, firstname, lastname, program_code, year, gender, pfp_url, original_student_id))
            
            row = cur.fetchone()
            conn.commit()
            
            if row:
                return {
                    "id": row[0],
                    "student_id": row[1],
                    "firstname": row[2],
                    "lastname": row[3],
                    "program_code": row[4],
                    "year": row[5],
                    "gender": row[6],
                    "pfp_url": row[7]
                }
            return None
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

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

    @classmethod
    def by_pagination(cls, page: int, limit: int, sort_by: str = None, sort_order: str = 'ASC', search: str = '', filters: dict = None):
        offset = (page - 1) * limit

        allowed_columns = {'student_id', 'firstname', 'lastname', 'program_code', 'year', 'gender'}
        if not sort_by or sort_by not in allowed_columns:
            sort_by = 'student_id'
        
        sort_order = 'DESC' if sort_order.upper() == 'DESC' else 'ASC'

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)

        try:
            base_query = """
                SELECT id, student_id, firstname, lastname, program_code, year, gender, pfp_url
                FROM student_table
                WHERE 1=1
            """
            count_query = "SELECT COUNT(*) AS total_count FROM student_table WHERE 1=1"

            params = []

            if search:
                search_term = f"%{search}%"
                search_clause = """
                    AND (student_id ILIKE %s 
                        OR firstname ILIKE %s 
                        OR lastname ILIKE %s 
                        OR gender ILIKE %s 
                        OR year::text ILIKE %s)
                """
                base_query += search_clause
                count_query += search_clause
                params.extend([search_term] * 5)

            if filters:
                if filters.get('program'):
                    base_query += " AND program_code = ANY(%s)"
                    count_query += " AND program_code = ANY(%s)"
                    params.append(filters['program'])

                if filters.get('year'):
                    base_query += " AND year = ANY(%s)"
                    count_query += " AND year = ANY(%s)"
                    params.append(filters['year'])

                if filters.get('gender'):
                    base_query += " AND gender = ANY(%s)"
                    count_query += " AND gender = ANY(%s)"
                    params.append(filters['gender'])

            base_query += f" ORDER BY {sort_by} {sort_order} LIMIT %s OFFSET %s"

            count_params = list(params) 
            
            params.extend([limit, offset])

            cur.execute(base_query, tuple(params))
            rows = cur.fetchall()
            
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
                    "gender": row["gender"],
                    "pfp_url": row["pfp_url"] 
                }) 

            return {
                "data": students,
                "page": page,
                "limit": limit,
                "total": total
            }
        
        except Exception as e:
            print(f"Pagination Error: {e}")
            return {"data": [], "page": page, "limit": limit, "total": 0} 

        finally:
            cur.close()
            conn.close()