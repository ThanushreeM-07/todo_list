let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isSortedNewestFirst = true;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (taskText === "") return;

  tasks.push({
    text: taskText,
    completed: false,
    pinned: false,
    createdAt: new Date().toISOString()
  });

  input.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function togglePin(index) {
  tasks[index].pinned = !tasks[index].pinned;
  saveTasks();
  renderTasks();
}

function renderTasks(filter = "all") {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filteredTasks = tasks;

  if (filter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  } else if (filter === "incomplete") {
    filteredTasks = tasks.filter(t => !t.completed);
  }

  // Pinned on top
  filteredTasks.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    const date = new Date(task.createdAt).toLocaleDateString();

    li.innerHTML = `
      <div>
        <span style="text-decoration:${task.completed ? 'line-through' : 'none'}">${task.text}</span>
        <div class="meta">${date}${task.pinned ? ' 📌' : ''}</div>
      </div>
      <div class="btns">
        <button class="done-btn" onclick="toggleTask(${index})">${task.completed ? 'Undo' : 'Done'}</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        <button class="pin-btn" onclick="togglePin(${index})">${task.pinned ? 'Unpin' : 'Pin'}</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function showAll() {
  renderTasks("all");
}

function showCompleted() {
  renderTasks("completed");
}

function showIncomplete() {
  renderTasks("incomplete");
}

function sortByDate() {
  if (isSortedNewestFirst) {
    tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first
    document.querySelector(".sort-btn").textContent = "Sort: Oldest → Newest";
  } else {
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
    document.querySelector(".sort-btn").textContent = "Sort: Newest → Oldest";
  }
  isSortedNewestFirst = !isSortedNewestFirst;
  saveTasks();
  renderTasks();
}

renderTasks();