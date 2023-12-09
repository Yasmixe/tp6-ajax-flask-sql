from flask import Flask, render_template, request, redirect
from flaskext.mysql import MySQL
import json
from flask import Flask, make_response, jsonify

app = Flask(__name__)

mysql = MySQL()

app.config["MYSQL_DATABASE_HOST"] = "localhost"
app.config["MYSQL_DATABASE_PORT"] = 3306
app.config["MYSQL_DATABASE_USER"] = "root"
app.config["MYSQL_DATABASE_PASSWORD"] = "pass_root"
app.config["MYSQL_DATABASE_DB"] = "db_persons"

mysql.init_app(app)


@app.route("/")
def form():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM person")
    data = cursor.fetchall()
    cursor.close()

    return render_template("exo5.html", data=data)


@app.route("/api/persons", methods=["GET"])
def selectpersons():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nom, prenom, points FROM person")
    data = cursor.fetchall()
    row_header = [x[0] for x in cursor.description]
    cursor.close()
    json_data = []
    for result in data:
        json_data.append(dict(zip(row_header, result)))

    return make_response(jsonify(json_data), 200)


@app.route("/api/persons", methods=["POST"])
def insertperson():
    # logique
    nom = request.form["valNom"]
    prenom = request.form["valPrenom"]
    points = request.form["valPoints"]

    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute("SELECT MAX(id) FROM person")
    max_id = cursor.fetchall()[0][0]
    new_id = str(max_id + 1)

    cursor.execute(
        "INSERT INTO person (id, nom, prenom, points) VALUES (%s, %s, %s, %s)",
        (new_id, nom, prenom, points),
    )
    conn.commit()
    cursor.close()
    json_data = [{"id": int(new_id)}]
    return make_response(jsonify(json_data), 201)


@app.route("/api/persons/<string:id>", methods=["PUT"])
def updatepersons(id):
    # logique
    nom = request.form["valNom"]
    prenom = request.form["valPrenom"]
    points = request.form["valPoints"]

    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE person SET "
        'nom="' + nom + '", '
        'prenom="' + prenom + '", '
        "points=" + points + " WHERE id=" + id
    )
    conn.commit()
    cursor.close()
    return make_response("Record updated", 200)


@app.route("/api/persons/<string:id>", methods=["DELETE"])
def deleteperson(id):
    # logique
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM person where id=" + id)

    conn.commit()
    cursor.close()
    return make_response("Record deleted", 204)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
