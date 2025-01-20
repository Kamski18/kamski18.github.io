// Credit hours for subjects
const CREDIT_HOUR = {
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
};

// Grade weightages
const GRADE_WEIGHTAGES = {
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
};

// Initialize the form with subjects
window.onload = function () {
    const subjectsContainer = document.getElementById("subjectInputs");
    Object.keys(CREDIT_HOUR).forEach(subject => {
        const label = document.createElement("label");
        label.textContent = `${subject} Grade:`;

        const input = document.createElement("input");
        input.type = "text";
        input.name = subject;
        input.id = subject;
        input.required = true;

        subjectsContainer.appendChild(label);
        subjectsContainer.appendChild(input);
    });
};

// Handle form submission
document.getElementById("pngForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const grades = new FormData(event.target);
    const weightages = {};
    let result = null;

    // Calculate weightages
    for (const [subject, grade] of grades.entries()) {
        const upperGrade = grade.toUpperCase().trim();
        if (!(upperGrade in GRADE_WEIGHTAGES)) {
            result = "Invalid grade input!";
            break;
        }
        weightages[subject] = GRADE_WEIGHTAGES[upperGrade];
    }

    // If no error, calculate the PNG
    if (result === null) {
        const totalCreditHours = Object.values(CREDIT_HOUR).reduce((acc, hours) => acc + hours, 0);
        const productOfCredHourWeightages = Object.keys(weightages).reduce((acc, subject) => {
            return acc + CREDIT_HOUR[subject] * weightages[subject];
        }, 0);

        result = (productOfCredHourWeightages / totalCreditHours).toFixed(3);
    }

    // Display the result
    document.getElementById("result").textContent = result;
});
