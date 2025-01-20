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

document.getElementById("subjects").addEventListener("change", updateSubjectInputs);

function updateSubjectInputs() {
    const selectedSubjects = Array.from(document.getElementById("subjects").selectedOptions).map(option => option.value);
    const subjectInputsContainer = document.getElementById("subjectInputs");
    subjectInputsContainer.innerHTML = '';

    selectedSubjects.forEach(subject => {
        const inputField = document.createElement("div");
        inputField.innerHTML = `
            <label for="${subject}">${subject} Grade:</label>
            <input type="text" id="${subject}" name="${subject}" list="grades" required>
        `;
        subjectInputsContainer.appendChild(inputField);
    });
}

document.getElementById("pngForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const grades = {};
    const inputs = document.querySelectorAll('input[type="text"]');

    inputs.forEach(input => {
        grades[input.name] = input.value.toUpperCase().trim();
    });

    const weightages = {};

    for (const [subject, grade] of Object.entries(grades)) {
        if (GRADE_WEIGHTAGES[grade]) {
            weightages[subject] = GRADE_WEIGHTAGES[grade];
        } else {
            showError("Invalid grade input!");
            return;
        }
    }

    const totalCreditHours = Object.values(CREDIT_HOUR).reduce((acc, hours) => acc + hours, 0);
    let productOfCredhourWeightages = 0;

    for (const subject in weightages) {
        productOfCredhourWeightages += CREDIT_HOUR[subject] * weightages[subject];
    }

    const result = (productOfCredhourWeightages / totalCreditHours).toFixed(3);

    // Save result to localStorage
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({ result, date: new Date().toLocaleString() });
    localStorage.setItem('history', JSON.stringify(history));

    // Display result and history
    displayResult(result);
    displayHistory();
});

function displayResult(result) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<h3>Your PNG is: ${result}</h3>`;
    resultDiv.style.display = "block";
}

function displayHistory() {
    const historyContainer = document.getElementById("history");
    const history = JSON.parse(localStorage.getItem('history')) || [];

    historyContainer.innerHTML = "<h3>Previous Results:</h3>";

    history.forEach(item => {
        const entry = document.createElement("p");
        entry.textContent = `${item.date}: PNG = ${item.result}`;
        historyContainer.appendChild(entry);
    });
}

function showError(message) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<h3 style="color: red;">${message}</h3>`;
    resultDiv.style.display = "block";
}

// Display history when the page loads
window.onload = displayHistory;
