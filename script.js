// ▼タスク追加の仕組み（あづま用メモ）

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const messageBox = document.getElementById("message-box");

addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text === "") return;

    const task = document.createElement("div");
    task.textContent = text;

    task.addEventListener("click", () => {
        task.remove();
        showMessage("タスク完了、お疲れさま。");
        saveTasks();
    });

    taskList.appendChild(task);
    taskInput.value = "";

// ▼saveTasksがあると1回閉じても開くと内容が残ってる。細かい理解はまた今度。
    saveTasks();
});

function showMessage(msg) {
    messageBox.textContent = msg;
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#task-list div").forEach(task => {
        tasks.push(task.textContent);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
    saved.forEach(text => {
        const task = document.createElement("div");
        task.textContent = text;

        task.addEventListener("click", () => {
            task.remove();
            showMessage("タスク完了、お疲れさま。");
            saveTasks();
        });

        taskList.appendChild(task);
    });
}

loadTasks();

