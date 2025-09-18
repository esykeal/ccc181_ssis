from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import config

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Hello World'

if __name__ == '__main__':
    app.run(debug=True, port=5000)