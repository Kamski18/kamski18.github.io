import streamlit as st
import pandas as pd
import json
import os
import matplotlib.pyplot as plt
import seaborn as sns

st.set_page_config(page_title="Calorie Tracker", layout="centered")
st.title("Your journey by week 🥗")

FILE_NAME = "data.json"


# --- Data Functions ---
def load_data():
    if not os.path.exists(FILE_NAME) or os.stat(FILE_NAME).st_size == 0:
        return []
    with open(FILE_NAME, "r", encoding="utf-8") as file:
        return json.load(file)


def save_data(data):
    with open(FILE_NAME, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)


# --- App Logic ---
data = load_data()

# Sidebar for inputs
with st.sidebar:
    st.header("Log Your Progress")
    new_entry = st.number_input(
        "Enter today's calories:", min_value=0, max_value=10000, step=100
    )

    if st.button("Add Entry"):
        if len(data) < 14:
            data.append(new_entry)
            save_data(data)
            st.success(f"Day {len(data)} logged!")
        else:
            st.warning("You've reached 14 days! Time to reset or analyze.")

    if st.button("Clear All Data", type="primary"):
        save_data([])
        st.rerun()

# --- Visualization ---
if data:
    df = pd.DataFrame({"Day": range(1, len(data) + 1), "Calories": data})

    # Display the metrics
    col1, col2 = st.columns(2)
    col1.metric("Average Intake", f"{int(sum(data) / len(data))} kcal")
    col2.metric("Days Logged", f"{len(data)} / 14")

    # Display the chart
    st.subheader("Calorie Intake Trend")
    fig, ax = plt.subplots()
    sns.lineplot(data=df, x="Day", y="Calories", marker="o", ax=ax)
    ax.set_ylim(0, max(data) + 500)
    st.pyplot(fig)

    # Show the raw data table
    with st.expander("View Raw Data"):
        st.dataframe(df.set_index("Day"), use_container_width=True)
else:
    st.info("No data yet. Use the sidebar to log your first day!")
