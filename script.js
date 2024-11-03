// Load tasks from local storage and dark mode preference when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadTasks();

  // Check if dark mode was previously enabled
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const isDarkMode = localStorage.getItem("darkMode") === "true";

  // Set the initial state of dark mode
  darkModeToggle.checked = isDarkMode;
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    document.querySelector(".container").classList.add("dark-mode");
  }

  // Toggle dark mode on checkbox change
  darkModeToggle.addEventListener("change", function () {
    const isChecked = this.checked;
    document.body.classList.toggle("dark-mode", isChecked);
    document
      .querySelector(".container")
      .classList.toggle("dark-mode", isChecked);

    // Save dark mode preference in local storage
    localStorage.setItem("darkMode", isChecked);
  });
});

document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const taskInput = document.getElementById("task-input");
  const taskText = taskInput.value;

  // Create a new task object
  const task = {
    id: Date.now(), // Unique identifier for the task
    text: taskText,
    completed: false, // Add a completed status
  };

  // Save the task to local storage
  saveTaskToLocalStorage(task);

  // Add task to the DOM
  addTaskToDOM(task);
  taskInput.value = ""; // Clear input field
});

// Function to load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => addTaskToDOM(task));
}

// Function to save a task to local storage
function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task); // Add the new task
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Save back to local storage
}

// Function to update a task in local storage
function updateTaskInLocalStorage(taskId, newTaskText) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].text = newTaskText; // Update the task text
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save back to local storage
  }
}

// Function to delete a task from local storage
function deleteTaskFromLocalStorage(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.id !== taskId); // Remove the task by id
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Update local storage
}

// Function to add a task to the DOM
function addTaskToDOM(task) {
  const li = document.createElement("li");

  // Create a div for the task text and checkbox
  const taskContainer = document.createElement("div");
  taskContainer.style.display = "flex"; // Use flex to align items
  taskContainer.style.alignItems = "center"; // Vertically center items

  // Create a checkbox for the completion status
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed; // Set the checkbox based on the task's completion status
  checkbox.onchange = function () {
    task.completed = checkbox.checked; // Update the task's completion status
    updateTaskCompletionStatus(task.id, task.completed); // Update local storage
  };

  // Create a span for the task text
  const taskSpan = document.createElement("span");
  taskSpan.textContent = task.text; // Set the task text
  taskSpan.className = "task-text"; // Add a class for styling

  // Append the checkbox and task text to the task container
  taskContainer.appendChild(checkbox); // Append checkbox to the container
  taskContainer.appendChild(taskSpan); // Append task text to the container

  // Append the task container to the list item
  li.appendChild(taskContainer);

  // Create a div for the button container
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container"; // Add a class for styling

  // Create edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "edit"; // Add class for styling
  editButton.onclick = function () {
    const newTaskText = prompt("Edit your task:", task.text);
    if (newTaskText) {
      taskSpan.textContent = newTaskText; // Update the text of the list item
      // Update the task in local storage as well
      updateTaskInLocalStorage(task.id, newTaskText);
    }
  };

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete"; // Add class for styling
  deleteButton.onclick = function () {
    li.remove(); // Remove the list item
    deleteTaskFromLocalStorage(task.id); // Remove from local storage
  };

  // Append buttons to the button container
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  // Append button container to the list item
  li.appendChild(buttonContainer);

  // Append the list item to the task list
  document.getElementById("task-list").appendChild(li);
}
