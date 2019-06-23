from flask import Flask, jsonify, render_template, send_file

app = Flask(__name__)

# render out an index page
@app.route("/")
def home():
    return render_template("index.html")

@app.route('/team_img/<team_name>')
def team_img(team_name):
    # team_name = team_name.replace("\'",'').lower()
    # file_name=(f'static/images/{team_name}.png')
    # return send_file(file_name)
    return send_file(f'static/images/{team_name}.png')

if __name__ == "__main__":
    app.run()
