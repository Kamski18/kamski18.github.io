let state = {
    goal: Number(localStorage.getItem('ft_goal')) || 2000,
    baki: Number(localStorage.getItem('ft_baki')) || 2000,
    rice: 0,
    selections: {},
    allMeals: []
};

if (!Number.isFinite(state.goal)) state.goal = 2000;
if (!Number.isFinite(state.baki)) state.baki = state.goal;

async function init() {
    try {
        const response = await fetch('meals.json');
        state.allMeals = await response.json();
        renderMeals(state.allMeals);
        updateUI();
    } catch (e) {
        console.error("Run using Live Server to load JSON.");
    }
}

function renderMeals(list) {
    const container = document.getElementById('meal-list');
    container.innerHTML = '';
    list.forEach(meal => {
        const div = document.createElement('div');
        div.className = 'meal-item';
        div.innerHTML = `
            <div>${meal.name}<br><small style="color:gray">${meal.calories} kcal/tbsp</small></div>
            <input type="number" class="qty-input" placeholder="0" oninput="updateQty(${meal.id}, this.value)">
        `;
        container.appendChild(div);
    });
}

window.filterMeals = () => {
    const q = document.getElementById('search-bar').value.toLowerCase();
    renderMeals(state.allMeals.filter(m => m.name.toLowerCase().includes(q)));
}

window.updateRice = (val) => {
    state.rice = Math.max(0, state.rice + val);
    document.getElementById('rice-count').innerText = state.rice;
}

window.updateQty = (id, val) => {
    const n = parseInt(val);
    if (n > 0) state.selections[id] = n;
    else delete state.selections[id];
}

window.confirmEntry = () => {
    if (state.rice < 1) {
        document.getElementById('rice-card').classList.add('shake');
        setTimeout(() => document.getElementById('rice-card').classList.remove('shake'), 400);
        alert("Nasi wajib ada! Minimum 1 pinggan.");
        return;
    }

    let totalEat = state.rice * 200;

    for (let id in state.selections) {
        const meal = state.allMeals.find(m => m.id == id);
        const qty = Number(state.selections[id]);

        if (meal && Number.isFinite(qty)) {
            totalEat += meal.calories * qty;
        }
    }

    if (!Number.isFinite(totalEat)) {
        alert("Calculation error.");
        return;
    }

    state.baki -= totalEat;
    saveAndReset();
};

function saveAndReset() {
    localStorage.setItem('ft_goal', state.goal);
    localStorage.setItem('ft_baki', state.baki);

    state.rice = 0;
    state.selections = {};
    document.getElementById('rice-count').innerText = "0";
    document.getElementById('search-bar').value = "";
    renderMeals(state.allMeals);
    updateUI();
}

function updateUI() {
    document.getElementById('baki-display').innerText = Math.round(state.baki);
    document.getElementById('cal-card').classList.toggle('low-calories', state.baki < 0);
}

window.toggleSettings = (show) => {
    document.getElementById('settings-modal').style.display = show ? 'flex' : 'none';
    if (show) document.getElementById('goal-input').value = state.goal;
}

window.saveGoal = () => {
    const g = Number(document.getElementById('goal-input').value);
    if (!Number.isFinite(g) || g <= 0) {
        alert("Enter a valid calorie goal.");
        return;
    }

    state.baki += (g - state.goal);
    state.goal = g;

    localStorage.setItem('ft_goal', state.goal);
    localStorage.setItem('ft_baki', state.baki);

    updateUI();
    toggleSettings(false);
}

window.resetDay = () => {
    if (confirm("Reset today’s calories?")) {
        state.baki = state.goal;
        saveAndReset();
    }
}

init();
