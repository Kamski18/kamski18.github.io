from flask import Flask, render_template, request

app = Flask(__name__)

# Credit hours for subjects
CREDIT_HOUR = {
    "BM": 6,
    "BI": 6,
    "SEJ": 4,
    "MATH": 6,
    "ADDMATH": 6,
    "BIO": 6,
    "PHYS": 6,
    "CHEM": 6,
    "PAI": 5,
    "PJK": 3,
    "SENIREKA": 2,
    "SK": 2,
}

# Grade weightages
GRADE_WEIGHTAGES = {
    "L": 3.820925926,
    "A+": 4.0,
    "A": 4.0,
    "A-": 3.67,
    "B+": 3.33,
    "B": 3.0,
    "B-": 2.67,
    "C+": 2.33,
    "C": 2.0,
    "C-": 1.67,
    "D+": 1.33,
    "D": 1.0,
    "D-": 0.67,
    "E": 0.0,
    "F": 0.0,
}

@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    if request.method == "POST":
        grades = request.form
        weightages = {}

        # Calculate weightages
        for subject, grade in grades.items():
            if grade.upper() not in GRADE_WEIGHTAGES:
                result = "Invalid grade input!"
                break
            weightages[subject] = GRADE_WEIGHTAGES[grade.upper()]

        if not result:  # No errors
            total_credit_hours = sum(CREDIT_HOUR.values())
            product_of_credhour_weightages = sum(
                CREDIT_HOUR[subject] * weightages[subject]
                for subject in weightages
            )
            result = round(product_of_credhour_weightages / total_credit_hours, 3)

    return render_template("index.html", subjects=CREDIT_HOUR.keys(), result=result)

if __name__ == "__main__":
    app.run(debug=True)
