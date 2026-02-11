let state = {
    goal: Number(localStorage.getItem('ft_goal')) || 2000,
    baki: Number(localStorage.getItem('ft_baki')) || 2000,
    rice: 0,
    selections: {},
    allMeals: []
};

// Guard against invalid stored values
if (!Number.isFinite(state.goal) || state.goal <= 0) state.goal = 2000;
if (!Number.isFinite(state.baki)) state.baki = state.goal;

async function init() {
    try {
        const response = await fetch('meals.json');
        if (!response.ok) throw new Error("Failed to load meals.json");
        state.allMeals = await response.json();
        renderMeals(state.allMeals);
        updatePreview();
        updateUI();
    } catch (e) {
        console.error("Failed to load meals:", e);
        alert("Cannot load food list.\n\nRun using Live Server or check meals.json");
    }
}

function renderMeals(list) {
    const container = document.getElementById('meal-list');
    if (!container) return;

    container.innerHTML = '';
    list.forEach(meal => {
        const div = document.createElement('div');
        div.className = 'meal-item';
        div.innerHTML = `
            <div>${meal.name}<br><small style="color:gray">${meal.calories} kcal/tbsp</small></div>
            <input type="number" class="qty-input" 
                   min="0" step="1" 
                   value="${state.selections[meal.id] || ''}" 
                   placeholder="0" 
                   oninput="updateQty(${meal.id}, this.value)">
        `;
        container.appendChild(div);
    });
    updatePreview();
}

window.filterMeals = () => {
    const q = document.getElementById('search-bar')?.value.toLowerCase() || '';
    const filtered = state.allMeals.filter(m => m.name.toLowerCase().includes(q));
    renderMeals(filtered);
};

window.updateRice = (val) => {
    state.rice = Math.max(0, state.rice + val);
    document.getElementById('rice-count').innerText = state.rice;
    updatePreview();
};

window.updateQty = (id, val) => {
    const n = parseInt(val, 10);
    if (isNaN(n) || n <= 0) {
        delete state.selections[id];
    } else {
        state.selections[id] = n;
    }
    updatePreview();
};

function calculateTotalEat() {
    let total = state.rice * 200;
    for (let id in state.selections) {
        const meal = state.allMeals.find(m => m.id == id);
        const qty = Number(state.selections[id]);
        if (meal && Number.isFinite(qty)) {
            total += meal.calories * qty;
        }
    }
    return total;
}

function updatePreview() {
    const el = document.getElementById('total-preview');
    if (el) {
        el.innerText = calculateTotalEat();
    }
}

window.confirmEntry = () => {
    const totalEat = calculateTotalEat();

    if (totalEat <= 0) {
        alert("Nothing selected to log.");
        return;
    }

    state.baki -= totalEat;

    let message = `Successfully logged ${totalEat} kcal.\nRemaining: ${Math.round(state.baki)} kcal`;
    if (state.baki < 0) {
        message += "\n\nYou have exceeded your daily goal!";
        const card = document.getElementById('cal-card');
        if (card) {
            card.classList.add('shake');
            setTimeout(() => card.classList.remove('shake'), 400);
        }
    }
    alert(message);

    saveAndReset();
};

function saveAndReset() {
    localStorage.setItem('ft_goal', state.goal);
    localStorage.setItem('ft_baki', state.baki);

    state.rice = 0;
    state.selections = {};

    const riceEl = document.getElementById('rice-count');
    if (riceEl) riceEl.innerText = "0";

    const searchEl = document.getElementById('search-bar');
    if (searchEl) searchEl.value = "";

    document.querySelectorAll('.qty-input').forEach(input => input.value = "");

    renderMeals(state.allMeals);
    updatePreview();
    updateUI();
}

function updateUI() {
    const bakiEl = document.getElementById('baki-display');
    if (bakiEl) bakiEl.innerText = Math.round(state.baki);

    const card = document.getElementById('cal-card');
    if (card) card.classList.toggle('low-calories', state.baki < 0);
}

window.toggleSettings = (show) => {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.style.display = show ? 'flex' : 'none';
    
    if (show) {
        const input = document.getElementById('goal-input');
        if (input) input.value = state.goal;
    }
};

window.saveGoal = () => {
    const input = document.getElementById('goal-input');
    if (!input) return;

    const g = Number(input.value);
    if (!Number.isFinite(g) || g <= 0) {
        alert("Please enter a valid calorie goal (positive number).");
        return;
    }

    state.baki += (g - state.goal);
    state.goal = g;

    localStorage.setItem('ft_goal', state.goal);
    localStorage.setItem('ft_baki', state.baki);

    updateUI();
    toggleSettings(false);
};

window.resetDay = () => {
    if (confirm("Are you sure you want to reset remaining calories to your daily goal?")) {
        state.baki = state.goal;
        saveAndReset();
    }
};

window.addEventListener("load", () => {
    setTimeout(() => {
        const intro = document.getElementById("intro-screen");
        if (intro) intro.remove();
    }, 1700);

    init();
});
