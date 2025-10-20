from app.db import get_db_connection
from psycopg2.extras import DictCursor
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class Users(UserMixin):
    def __init__(self, id, username, email, password_hash):
        self.id = str(id)
        self.username = username
        self.email = email
        self.password_hash = password_hash

    @classmethod
    def create_user(cls, username, email, password):
        hashed_pass = generate_password_hash(password)
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        try:
            cur.execute("""
                INSERT INTO user_table (username, email, password_hash)
                VALUES (%s, %s, %s) RETURNING id
            """, (username, email, hashed_pass))
            new_id = cur.fetchone()['id']
            conn.commit()
            return new_id
        except Exception:
            conn.rollback()
            return None
        finally:
            cur.close()
            conn.close()

    @classmethod
    def get_by_username(cls, username):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        cur.execute("SELECT * FROM user_table WHERE username = %s", (username,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        return cls(row['id'], row['username'], row['email'], row['password_hash']) if row else None

    @classmethod
    def get_by_id(cls, user_id):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        cur.execute("SELECT * FROM user_table WHERE id = %s", (user_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        return cls(row['id'], row['username'], row['email'], row['password_hash']) if row else None

    @classmethod
    def update_user(cls, user_id, username, email, password=None):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        try:
            if password:
                hashed_pw = generate_password_hash(password)
                cur.execute("""
                    UPDATE user_table SET username=%s, email=%s, password_hash=%s 
                    WHERE id=%s RETURNING id, username, email
                """, (username, email, hashed_pw, user_id))
            else:
                cur.execute("""
                    UPDATE user_table SET username=%s, email=%s 
                    WHERE id=%s RETURNING id, username, email
                """, (username, email, user_id))
            
            row = cur.fetchone()
            conn.commit()
            return row
        except Exception:
            conn.rollback()
            return None
        finally:
            cur.close()
            conn.close()

    # Required for login
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {"id": self.id, "username": self.username, "email": self.email}