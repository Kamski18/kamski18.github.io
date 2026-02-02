import json
import os

FILE_NAME = "meals.json"


def load_meals():
    """Load existing meals from JSON file, or return empty list if file doesn't exist."""
    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r", encoding="utf-8") as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return []
    return []


def save_meals(meals):
    """Save meals list to JSON file."""
    with open(FILE_NAME, "w", encoding="utf-8") as file:
        json.dump(meals, file, indent=4)


def get_next_id(meals):
    """Generate next meal ID."""
    if not meals:
        return 1
    return max(meal["id"] for meal in meals) + 1


def add_meal():
    meals = load_meals()

    while True:
        print("\n=== Add a Meal ===")

        name = input("Meal name (or type 'q' to quit): ").strip()
        if name.lower() == "q":
            break

        try:
            calories = float(input("Calories per tablespoon: ").strip())
        except ValueError:
            print("[!] Invalid number. Try again.")
            continue

        meal = {
            "id": get_next_id(meals),
            "name": name,
            "calories": calories
        }

        meals.append(meal)
        save_meals(meals)

        print(f"[+] Saved: {meal['name']} ({meal['calories']} kcal/tbsp)")

    print("\n[+]Meals saved to", FILE_NAME)


if __name__ == "__main__":
    add_meal()
