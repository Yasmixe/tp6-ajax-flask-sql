from flask import Flask, render_template
from flaskext.mysql import MySQL
from flask import jsonify, make_response, request

app = Flask(__name__)

mysql = MySQL()

app.config["MYSQL_DATABASE_HOST"] = "localhost"
app.config["MYSQL_DATABASE_PORT"] = 3306
app.config["MYSQL_DATABASE_USER"] = "root"
app.config["MYSQL_DATABASE_PASSWORD"] = "pass_root"
app.config["MYSQL_DATABASE_DB"] = "db_persons"

mysql.init_app(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/persons", methods=["GET"])
def selectPersons():
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute("USE db_persons")
    cursor.execute("SELECT id, nom, prenom, points from PERSON")

    data = cursor.fetchall()
    row_headers = [x[0] for x in cursor.description]

    cursor.close()

    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))

    return make_response(jsonify(json_data), 200)


@app.route("/api/persons", methods=["POST"])
def insertPerson():
    nom = request.form["valNom"]
    prenom = request.form["valPrenom"]
    points = request.form["valPoints"]

    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute("SELECT max(id) from PERSON")
    max_ID = cursor.fetchall()[0][0]
    new_ID = str(max_ID + 1)

    req = (
        "INSERT INTO person VALUES("
        + new_ID
        + ', "'
        + nom
        + '", "'
        + prenom
        + '", '
        + points
        + ")"
    )

    cursor.execute(req)

    conn.commit()
    cursor.close()

    json_data = [{"id": int(new_ID)}]

    return make_response(jsonify(json_data), 201)


@app.route("/api/persons/<string:id>", methods=["PUT"])
def updatePerson(id):
    nom = request.form["valNom"]
    prenom = request.form["valPrenom"]
    points = request.form["valPoints"]

    conn = mysql.connect()

    cursor = conn.cursor()

    cursor.execute("USE db_persons")
    cursor.execute(
        "UPDATE person set "
        'nom="' + nom + '"'
        ', prenom="' + prenom + '"'
        ", points =" + points + " where id =" + id
    )
    conn.commit()
    cursor.close()

    return make_response("Record updated", 200)


@app.route("/api/persons/<string:id>", methods=["DELETE"])
def deletePerson(id):
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute("USE db_persons")

    cursor.execute("DELETE FROM person where id=" + id)

    conn.commit()
    cursor.close()

    return make_response("Record deleted", 204)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
