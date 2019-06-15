from flask import Flask, jsonify, render_template

app = Flask(__name__)


# render out an index page
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/baseball")
def baseball():
    return render_template("baseball.html")

@app.route("/basketball")
def basketball():
    return render_template("basketball.html")

@app.route("/football")
def football():
    return render_template("football.html")
    
if __name__ == "__main__":
    app.run()
