from flask import Flask, jsonify, render_template
import pymysql
import sqlalchemy
import flask_sqlalchemy
import pandas
import os
from libs import scraper

##detect your environment, and conditionally load config file
if not os.environ.get('DYNO'):
    import config
    print(config.name)

##detect your environment, and conditionally load database url
if os.environ.get("JAWSDB_URL"):
    dburl = os.environ["JAWSDB_URL"]
else:
    dburl = config.dburl

# create an engine for your database connection
engine = sqlalchemy.create_engine(dburl)

# Use pandas to read in a sql table
df = pandas.read_sql("SELECT * FROM TABLENAME_HERE", engine)


app = Flask(__name__)

# render out an index page
@app.route("/")
def home():
    return render_template("index.html")

# respond with JSON
@app.route("/data")
def data():
    return jsonify(df.to_json(orient="records"))

@app.route("/scrape")
def scrape():
    return jsonify(scraper.scrape_news())

if __name__ == "__main__":
    app.run()
