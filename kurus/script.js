// Configuration
const CALORIES_PER_RICE_PLATE = 200;
const WATER_GOAL = 8;

// State
let state = {
    rice: 0,
    water: 0,
    mealQuantities: {}, // Stores ID: Quantity (e.g., { "1": 2 })
    allMeals: [] // Will store data from JSON
};

// Elements
const totalEl = document.getElementById('total-calories');
const riceCountEl = document.getElementById('rice-count');
const mealListEl = document.getElementById('meal-list');
const searchInput = document.getElementById('search-input');
const waterGridEl = document.getElementById('water-grid');

// --- Initialization ---
async function init() {
    // 1. Fetch Data
    try {
        const response = await fetch('meals.json');
        state.allMeals = await response.json();
        renderMeals(state.allMeals);
    } catch (error) {
        console.error("Error loading JSON:", error);
        mealListEl.innerHTML = "<p style='color:red'>Error: Use a local server to load JSON.</p>";
    }

    // 2. Setup Water & Date
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    renderWater();
}

// --- Meal List & Search ---
function renderMeals(mealsToRender) {
    mealListEl.innerHTML = '';
    
    mealsToRender.forEach(meal => {
        // Get current quantity if user already typed something
        const currentQty = state.mealQuantities[meal.id] || '';

        const div = document.createElement('div');
        div.className = 'meal-item';
        div.innerHTML = `
            <div class="meal-info">
                <span class="meal-name">${meal.name}</span>
                <span class="meal-cal">${meal.calories} kcal / tbsp</span>
            </div>
            <input type="number" 
                   class="qty-input" 
                   placeholder="0" 
                   value="${currentQty}"
                   min="0"
                   oninput="updateMealQty(${meal.id}, this.value)">
        `;
        mealListEl.appendChild(div);
    });
}

window.filterMeals = () => {
    const query = searchInput.value.toLowerCase();
    const filtered = state.allMeals.filter(meal => 
        meal.name.toLowerCase().includes(query)
    );
    renderMeals(filtered);
}

window.updateMealQty = (id, value) => {
    const qty = parseInt(value);
    if (isNaN(qty) || qty < 0) {
        delete state.mealQuantities[id];
    } else {
        state.mealQuantities[id] = qty;
    }
    calculateTotal();
}

// --- Rice Logic ---
window.updateRice = (change) => {
    state.rice += change;
    if (state.rice < 0) state.rice = 0;
    riceCountEl.innerText = state.rice;
    calculateTotal();
}

// --- Water Logic ---
function renderWater() {
    waterGridEl.innerHTML = '';
    for (let i = 0; i < WATER_GOAL; i++) {
        const div = document.createElement('div');
        div.className = `glass ${i < state.water ? 'active' : ''}`;
        div.onclick = () => {
            state.water = (state.water === i + 1) ? i : i + 1;
            renderWater();
            document.getElementById('water-text').innerText = `${state.water} / ${WATER_GOAL} Glasses`;
        };
        waterGridEl.appendChild(div);
    }
}

// --- Calculation ---
function calculateTotal() {
    let total = 0;

    // 1. Add Rice
    total += (state.rice * CALORIES_PER_RICE_PLATE);

    // 2. Add Meals (Iterate over the stored quantities)
    for (const [id, qty] of Object.entries(state.mealQuantities)) {
        const meal = state.allMeals.find(m => m.id == id);
        if (meal) {
            total += (meal.calories * qty);
        }
    }

    // Animate Number
    totalEl.innerText = total;
}

init();