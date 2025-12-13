const apiURL = "/tasks"; // relative path works when backend serves static files

async function loadTasks() {
  try {
    const res = await fetch(apiURL);
    const tasks = await res.json();
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";

      const span = document.createElement("span");
      span.textContent = task.text;
      span.onclick = () => toggleComplete(task._id, task.completed);
      span.style.cursor = "pointer";

      const buttons = document.createElement("div");

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => editTaskPrompt(task._id, task.text);

      const delBtn = document.createElement("button");
      delBtn.textContent = "X";
      delBtn.onclick = () => deleteTask(task._id);

      buttons.appendChild(editBtn);
      buttons.appendChild(delBtn);

      li.appendChild(span);
      li.appendChild(buttons);
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

document.getElementById("addBtn").addEventListener("click", addTask);
document.getElementById("taskInput").addEventListener("keyup", (e) => {
  if (e.key === "Enter") addTask();
});

async function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;
  try {
    await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    input.value = "";
    loadTasks();
  } catch (err) { console.error(err); }
}

async function toggleComplete(id, completed) {
  try {
    await fetch(`${apiURL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    });
    loadTasks();
  } catch (err) { console.error(err); }
}

async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  try {
    await fetch(`${apiURL}/${id}`, { method: "DELETE" });
    loadTasks();
  } catch (err) { console.error(err); }
}

function editTaskPrompt(id, currentText) {
  const newText = prompt("Edit task:", currentText);
  if (newText === null) return;
  fetch(`${apiURL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText })
  }).then(() => loadTasks()).catch(err => console.error(err));
}

loadTasks();

