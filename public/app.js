const TOKEN_KEY = "todo_token";

const authSection = document.getElementById("authSection");
const todoSection = document.getElementById("todoSection");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const todoForm = document.getElementById("todoForm");
const todoList = document.getElementById("todoList");
const logoutBtn = document.getElementById("logoutBtn");
const messageBox = document.getElementById("message");

const ACTIVE_TAB_CLASS = "bg-cyan-300 text-slate-900";
const INACTIVE_TAB_CLASS = "text-slate-300 hover:bg-slate-700/70";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setMessage(message, type = "") {
  messageBox.textContent = message;
  messageBox.className = "mt-5 min-h-6 text-sm";

  if (type === "success") {
    messageBox.classList.add("text-emerald-300");
  } else if (type === "error") {
    messageBox.classList.add("text-rose-300");
  } else {
    messageBox.classList.add("text-slate-300");
  }
}

function setActiveTab(activeTab) {
  [loginTab, registerTab].forEach((tab) => {
    tab.classList.remove(...ACTIVE_TAB_CLASS.split(" "));
    tab.classList.add(...INACTIVE_TAB_CLASS.split(" "));
  });

  activeTab.classList.remove(...INACTIVE_TAB_CLASS.split(" "));
  activeTab.classList.add(...ACTIVE_TAB_CLASS.split(" "));
}

function showLogin() {
  setActiveTab(loginTab);
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
}

function showRegister() {
  setActiveTab(registerTab);
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
}

function showTodoUI() {
  authSection.classList.add("hidden");
  todoSection.classList.remove("hidden");
}

function showAuthUI() {
  todoSection.classList.add("hidden");
  authSection.classList.remove("hidden");
  showLogin();
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = response.status;
    throw err;
  }

  return data;
}

function renderTodos(todos) {
  todoList.innerHTML = "";

  if (!todos.length) {
    const empty = document.createElement("li");
    empty.className = "rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-center text-slate-300";
    empty.textContent = "No todos yet. Add your first task.";
    todoList.appendChild(empty);
    return;
  }

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "group flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-cyan-300/40 sm:flex-row sm:items-center sm:justify-between";

    const title = document.createElement("span");
    title.className = todo.completed
      ? "text-sm font-medium text-slate-400 line-through"
      : "text-sm font-semibold text-slate-100";
    title.textContent = todo.title;

    const actions = document.createElement("div");
    actions.className = "flex flex-wrap items-center gap-2 sm:justify-end";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = todo.completed
      ? "rounded-lg bg-amber-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-950 transition hover:bg-amber-200"
      : "rounded-lg bg-cyan-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-950 transition hover:bg-cyan-200";
    toggleBtn.textContent = todo.completed ? "Mark Incomplete" : "Mark Complete";

    toggleBtn.addEventListener("click", async () => {
      try {
        await apiRequest(`/todos/${todo._id}`, { method: "PUT" });
        await loadTodos();
      } catch (error) {
        setMessage(error.message, "error");
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "rounded-lg bg-rose-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-rose-950 transition hover:bg-rose-200";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", async () => {
      try {
        await apiRequest(`/todos/${todo._id}`, { method: "DELETE" });
        setMessage("Todo deleted", "success");
        await loadTodos();
      } catch (error) {
        setMessage(error.message, "error");
      }
    });

    actions.append(toggleBtn, deleteBtn);
    li.append(title, actions);
    todoList.appendChild(li);
  });
}

async function loadTodos() {
  try {
    const todos = await apiRequest("/todos");
    renderTodos(todos);
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      showAuthUI();
      setMessage("Session expired. Please login again.", "error");
      return;
    }

    setMessage(error.message, "error");
  }
}

loginTab.addEventListener("click", showLogin);
registerTab.addEventListener("click", showRegister);

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  try {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setMessage("Registration successful. Please login.", "success");
    registerForm.reset();
    showLogin();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    loginForm.reset();
    showTodoUI();
    setMessage("Logged in successfully", "success");
    await loadTodos();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

todoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.getElementById("todoInput");
  const title = input.value.trim();

  if (!title) {
    setMessage("Please enter a todo title", "error");
    return;
  }

  try {
    await apiRequest("/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    input.value = "";
    setMessage("Todo added", "success");
    await loadTodos();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(TOKEN_KEY);
  showAuthUI();
  setMessage("Logged out", "success");
});

if (getToken()) {
  showTodoUI();
  loadTodos();
} else {
  showAuthUI();
}
