from flask import Flask, render_template
from flaskext.mysql import MySQL
from flask import jsonify, make_response, request

app = Flask(__name__)

# on crée une instance du connecteur flask_mysql
mysql = MySQL()


# on précise notre configuration pour le connecteur
app.config["MYSQL_DATABASE_HOST"] = "localhost"
app.config["MYSQL_DATABASE_PORT"] = 3306
app.config["MYSQL_DATABASE_USER"] = "root"
app.config["MYSQL_DATABASE_PASSWORD"] = "pass_root"
app.config["MYSQL_DATABASE_DB"] = "db_persons"


# on intitialise notre connecteur avec la configuration de notre application flask
mysql.init_app(app)


# Affichage des données
@app.route("/")
def index():
    return render_template("index2.html")


# Logique select (on prévoit une route qui va récupérer les données)
@app.route("/api/persons", methods=["GET"])
def selectPersons():
    # connexion a la bd
    conn = mysql.connect()
    cursor = conn.cursor()
    # requete sql select
    # cursor.execute("USE db_persons")
    cursor.execute("SELECT id, nom, prenom, points from PERSON")

    # préparer le fichier JSON
    data = cursor.fetchall()
    row_headers = [x[0] for x in cursor.description]

    cursor.close()

    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))

    # envoi des données sous format json
    return make_response(jsonify(json_data), 200)


# Logique insert  (pour ajouter une personne)
@app.route("/api/persons", methods=["POST"])
def insertPerson():
    # recuperation des données du formulaire
    nom = request.form["valNom"]
    prenom = request.form["valPrenom"]
    points = request.form["valPoints"]

    # connexion a la bd
    conn = mysql.connect()
    cursor = conn.cursor()

    # cursor.execute("USE db_persons")
    # recupérer le max id
    cursor.execute("SELECT max(id) from PERSON")
    max_ID = cursor.fetchall()[0][0]
    new_ID = str(max_ID + 1)

    # requete sql insert
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

    # on confirme la requete
    conn.commit()
    cursor.close()

    # On peut retourner le id de la personne créée
    json_data = [{"id": int(new_ID)}]

    # envoi des données sous format json
    return make_response(jsonify(json_data), 201)


# logique update (pour modifier un tuple (une personne) selon la clé primaire id)
@app.route("/api/persons/<string:id>", methods=["PUT"])
def updatePerson(id):
    # recupération des données du formulaire
    nom = request.form["valNom"]
    prenom = request.form["valPrenom"]
    points = request.form["valPoints"]

    # connexion a la bd
    conn = mysql.connect()
    cursor = conn.cursor()

    # cursor.execute("USE db_persons")

    # requete sql update
    cursor.execute(
        "UPDATE person set "
        'nom="' + nom + '"'
        ', prenom="' + prenom + '"'
        ", points =" + points + " where id =" + id
    )

    # confirmer la requete
    conn.commit()
    cursor.close()

    # envoi des données sous format json
    return make_response("Record updated", 200)


# Logique delete (pour supprimer une personne (un tuple, un ligne de la table) selon la clé primaire id)
@app.route("/api/persons/<string:id>", methods=["DELETE"])
def deletePerson(id):
    # connexion a la bd
    conn = mysql.connect()
    cursor = conn.cursor()

    # requete sql delete
    # cursor.execute("USE db_persons")
    cursor.execute("DELETE FROM person where id=" + id)
    conn.commit()
    cursor.close()

    return make_response("Record deleted", 204)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
