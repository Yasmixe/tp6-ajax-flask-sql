from flask import Flask, render_template, request, redirect
from flaskext.mysql import MySQL
import json

app = Flask(__name__)

mysql = MySQL()

app.config["MYSQL_DATABASE_HOST"] = "localhost"
app.config["MYSQL_DATABASE_PORT"] = 3306
app.config["MYSQL_DATABASE_USER"] = "root"
app.config["MYSQL_DATABASE_PASSWORD"] = "pass_root"
app.config["MYSQL_DATABASE_DB"] = "db_persons"

mysql.init_app(app)
persons = [
    {"id": 1000, "nom": "john", "prenom": "doe", "points": 15},
    {"id": 1000, "nom": "john", "prenom": "doe", "points": 8},
    {"id": 1000, "nom": "bob leponge", "prenom": "doe", "points": 15},
]


@app.route("/")
def bouton():
    return render_template("exo2.html")


@app.route("/getData")
def doGetData():
    persons_json = json.dumps(persons)
    return persons_json


if __name__ == "__main__":
    app.run(debug=True, port=5000)
