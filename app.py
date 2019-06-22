from flask import Flask, jsonify, render_template

app = Flask(__name__)


# render out an index page
@app.route("/")
def home():
    return render_template("index.html")

    
if __name__ == "__main__":
    app.run()
