let state = {
    goal: parseInt(localStorage.getItem('ft_goal')) || 2000,
    baki: parseInt(localStorage.getItem('ft_baki')) || 2000,
    rice: 0,
    selections: {},
    allMeals: []
};

async function init() {
    try {
        const response = await fetch('meals.json');
        state.allMeals = await response.json();
        renderMeals(state.allMeals);
        updateUI();
    } catch (e) {
        console.error("Please run this using a local server (Live Server) to load JSON.");
    }
}

function renderMeals(list) {
    const container = document.getElementById('meal-list');
    container.innerHTML = '';
    list.forEach(meal => {
        const div = document.createElement('div');
        div.className = 'meal-item';
        div.innerHTML = `
            <div>${meal.name}<br><small style="color:gray">${meal.cal} kcal/tbsp</small></div>
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
    if (n > 0) state.selections[id] = n; else delete state.selections[id];
}

window.confirmEntry = () => {
    if (state.rice < 1) {
        document.getElementById('rice-card').classList.add('shake');
        setTimeout(() => document.getElementById('rice-card').classList.remove('shake'), 400);
        return alert("Minimum 1 pinggan nasi!");
    }
    let total = state.rice * 200;
    for (let id in state.selections) {
        total += (state.allMeals.find(m => m.id == id).cal * state.selections[id]);
    }
    state.baki -= total;
    saveAndReset();
}

function saveAndReset() {
    localStorage.setItem('ft_goal', state.goal);
    localStorage.setItem('ft_baki', state.baki);
    state.rice = 0; state.selections = {};
    document.getElementById('rice-count').innerText = "0";
    document.getElementById('search-bar').value = "";
    renderMeals(state.allMeals);
    updateUI();
}

function updateUI() {
    document.getElementById('baki-display').innerText = state.baki;
    document.getElementById('cal-card').classList.toggle('low-calories', state.baki < 0);
}

window.toggleSettings = (show) => document.getElementById('settings-modal').style.display = show ? 'flex' : 'none';

window.saveGoal = () => {
    const g = parseInt(document.getElementById('goal-input').value);
    if (g > 0) {
        state.baki += (g - state.goal);
        state.goal = g;
        saveAndReset();
        toggleSettings(false);
    }
}

window.resetDay = () => { if(confirm("Reset?")) { state.baki = state.goal; saveAndReset(); } }

init();