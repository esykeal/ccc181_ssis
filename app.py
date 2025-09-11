from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("base.html")

@app.route('/hello')
def hello():
    return "Hello World"

@app.route('/greet/<name>')
def greet(name):
    return f"Hello {name}"

@app.route('/add/<int:number1>/<int:number2>')
def add(number1, number2):
    number3 = (number1 + number2)
    return f"Sum is {number3}"

@app.route('/handle_url_params')
def handle_params():
    params = request.args
    if 'greeting' in params.keys() and 'name' in params.keys():
        greeting = request.args.get('greeting')
        name = request.args.get('name')
        return f"{greeting} {name}"
    else:
        return 'Missing some parameters'
        

if __name__ == '__main__':
    app.run(host='127.0.0.1', debug=True)