from flask import Flask, render_template, request, redirect
from flaskext.mysql import MySQL

app = Flask(__name__)

mysql = MySQL()

app.config["MYSQL_DATABASE_HOST"] = "localhost"
app.config["MYSQL_DATABASE_PORT"] = 3306
app.config["MYSQL_DATABASE_USER"] = "root"
app.config["MYSQL_DATABASE_PASSWORD"] = "pass_root"
app.config["MYSQL_DATABASE_DB"] = "db_persons"

mysql.init_app(app)


@app.route("/")
def bouton():
    return render_template("exo1.html")


@app.route("/show", methods=["POST"])
def show():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM person")
    data = cursor.fetchall()
    cursor.close()

    return render_template("exo12.html", data=data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
