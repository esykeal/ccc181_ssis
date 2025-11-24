from app.db import get_db_connection
from psycopg2.extras import DictCursor
import psycopg2.errors
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class Users(UserMixin):
    def __init__(self, id, username, email, user_password):
        self.id = str(id)
        self.username = username
        self.email = email
        self.user_password = user_password

    @classmethod
    def create_user(cls, username, email, password):
        hashed_pass = generate_password_hash(password)
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        try:
            cur.execute("""
                INSERT INTO user_table (username, email, user_password)
                VALUES (%s, %s, %s) RETURNING id
            """, (username, email, hashed_pass))
            new_id = cur.fetchone()['id']
            conn.commit()
            return {"success": True, "id": new_id}
        except psycopg2.errors.UniqueViolation as e:
            conn.rollback()
            error_msg = str(e)
            if 'username' in error_msg:
                return {"success": False, "error": "Username already taken"}
            elif 'email' in error_msg:
                return {"success": False, "error": "Email already in use"}
            return {"success": False, "error": "Registration failed"}
        except Exception as e: 
            print(f"Error creating user: {e}") 
            conn.rollback()
            return {"success": False, "error": "An error occurred"}
        finally:
            cur.close()
            conn.close()

    @classmethod
    def get_all(cls):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        try:
            cur.execute("SELECT id, username, email FROM user_table")
            rows = cur.fetchall()
            users = [dict(row) for row in rows]
            return users
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
        return cls(row['id'], row['username'], row['email'], row['user_password']) if row else None

    @classmethod
    def get_by_id(cls, user_id):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        cur.execute("SELECT * FROM user_table WHERE id = %s", (user_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        return cls(row['id'], row['username'], row['email'], row['user_password']) if row else None

    @classmethod
    def update_user(cls, user_id, username, email, password=None):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        try:
            if password:
                hashed_pw = generate_password_hash(password)
                cur.execute("""
                    UPDATE user_table SET username=%s, email=%s, user_password=%s 
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
    
    @classmethod
    def update_avatar(cls, user_id, image_url):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=DictCursor)
        try:
            cur.execute("""
                UPDATE user_table 
                SET pfp_url = %s 
                WHERE id = %s
                RETURNING pfp_url
            """, (image_url, user_id))
            
            updated_row = cur.fetchone()
            conn.commit()
            return updated_row['pfp_url'] if updated_row else None
        except Exception as e:
            print(f"Error updating avatar: {e}")
            conn.rollback()
            return None
        finally:
            cur.close()
            conn.close()

    def check_password(self, password):
        return check_password_hash(self.user_password, password)
    
    def to_dict(self):
        return {
            "id": self.id, 
            "username": self.username, 
            "email": self.email,
            "pfp_url": self.pfp_url if hasattr(self, 'pfp_url') else None
        }