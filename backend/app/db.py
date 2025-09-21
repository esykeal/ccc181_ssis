import psycopg2
from os import getenv

def get_db_connection():
    conn = psycopg2.connect(
        host=getenv('DB_HOST'),
        database=getenv('DB_NAME'),
        user=getenv('DB_USERNAME'),
        password=getenv('DB_PASSWORD'),
        port=getenv('DB_PORT')
    )
    return conn