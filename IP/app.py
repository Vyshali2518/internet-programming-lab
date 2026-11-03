from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)


def create_database():
    conn = sqlite3.connect("student.db")

    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            regno TEXT,
            gender TEXT,
            department TEXT,
            email TEXT,
            hobbies TEXT
        )
    """)

    conn.commit()
    conn.close()


@app.route("/")
def home():
    return render_template("Form.html")


@app.route("/submit", methods=["POST"])
def submit():

    name = request.form["name"]
    regno = request.form["regno"]
    gender = request.form["gender"]
    department = request.form["department"]
    email = request.form["email"]

    hobbies = request.form.getlist("hobbies")
    hobbies = ", ".join(hobbies)

    conn = sqlite3.connect("student.db")

    conn.execute("""
        INSERT INTO students
        (name, regno, gender, department, email, hobbies)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (name, regno, gender, department, email, hobbies))

    conn.commit()
    conn.close()

    return """
    <h2>Student details stored successfully!</h2>
    <br>
    <a href="/">Go Back to Form</a>
    """


if __name__ == "__main__":
    create_database()
    app.run(debug=True)