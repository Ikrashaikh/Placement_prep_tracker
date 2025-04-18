document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("username")) {
        showMainApp();
    } else {
        document.getElementById("loginPage").style.display = "block";
    }

    const notesField = document.getElementById("notes");
    if (notesField) {
        notesField.value = localStorage.getItem("notes") || "";
        notesField.addEventListener("input", () => {
            localStorage.setItem("notes", notesField.value);
        });
    }

    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
        document.body.classList.add("dark");
    }
});

function login() {
    const username = document.getElementById("username").value.trim();
    if (username) {
        localStorage.setItem("username", username);
        showMainApp();
    }
}

function logout() {
    localStorage.removeItem("username");
    location.reload();
}

function showMainApp() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    document.getElementById("welcome").textContent = `Welcome, ${localStorage.getItem("username")}!`;

    displayTasks();
}

let currentView = "All";

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const category = document.getElementById("category");

    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const task = {
        id: Date.now(),
        text: taskText,
        category: category.value,
        completed: false
    };

    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);

    taskInput.value = "";
    displayTasks();
}

function toggleTask(id) {
    let tasks = getTasks();
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(tasks);
    displayTasks();
}

function deleteTask(id) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
    displayTasks();
}

function switchView(view) {
    currentView = view;
    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    if (!taskList) return;

    taskList.innerHTML = "";
    const tasks = getTasks();
    const filtered = currentView === "All" ? tasks : tasks.filter(t => t.category === currentView);

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";

        li.innerHTML = `
            [${task.category}] ${task.text}
            <span>
                <button onclick="toggleTask(${task.id})">${task.completed ? "Undo" : "Done"}</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </span>
        `;
        taskList.appendChild(li);
    });

    updateProgress(tasks);
}

function updateProgress(tasks) {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressText").innerText = `${percent}% complete`;
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    const mode = document.body.classList.contains("dark") ? "enabled" : "disabled";
    localStorage.setItem("darkMode", mode);
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
