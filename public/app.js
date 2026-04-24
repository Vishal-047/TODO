const TOKEN_KEY = "todo_token";

// ─── DOM refs ───────────────────────────────────────────
const authSection   = document.getElementById("authSection");
const todoSection   = document.getElementById("todoSection");
const loginTab      = document.getElementById("loginTab");
const registerTab   = document.getElementById("registerTab");
const tabIndicator  = document.getElementById("tabIndicator");
const loginForm     = document.getElementById("loginForm");
const registerForm  = document.getElementById("registerForm");
const todoForm      = document.getElementById("todoForm");
const todoList      = document.getElementById("todoList");
const logoutBtn     = document.getElementById("logoutBtn");
const logoutBtnTop  = document.getElementById("logoutBtnTop");
const authTitle     = document.getElementById("authTitle");
const authSubtitle  = document.getElementById("authSubtitle");
const completedCount = document.getElementById("completedCount");
const totalCount     = document.getElementById("totalCount");
const userAvatar     = document.getElementById("userAvatar");
const userName       = document.getElementById("userName");

// There are two #message elements (one per section) — grab both
const allMessages = document.querySelectorAll("#message");

// ─── Helpers ────────────────────────────────────────────
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setMessage(text, type = "") {
  allMessages.forEach((el) => {
    el.textContent = text;
    el.className = "msg-box";
    if (type) el.classList.add(type);
  });
}

function setLoading(btn, loading) {
  const text   = btn.querySelector(".btn-text");
  const loader = btn.querySelector(".btn-loader");
  if (!text || !loader) return;
  text.classList.toggle("hidden", loading);
  loader.classList.toggle("hidden", !loading);
  btn.disabled = loading;
}

// ─── Auth UI ────────────────────────────────────────────
function showLogin() {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  tabIndicator.classList.remove("right");
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  authTitle.textContent = "Welcome back";
  authSubtitle.textContent = "Sign in to your workspace";
  setMessage("");
}

function showRegister() {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  tabIndicator.classList.add("right");
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  authTitle.textContent = "Create account";
  authSubtitle.textContent = "Get started — it's free";
  setMessage("");
}

function showTodoUI(name) {
  authSection.classList.add("hidden");
  todoSection.classList.remove("hidden");
  if (name) {
    const initial = name.trim().charAt(0).toUpperCase();
    userAvatar.textContent = initial;
    userName.textContent = name.trim().split(" ")[0];
  }
}

function showAuthUI() {
  todoSection.classList.add("hidden");
  authSection.classList.remove("hidden");
  showLogin();
}

// ─── Tab click ──────────────────────────────────────────
loginTab.addEventListener("click", showLogin);
registerTab.addEventListener("click", showRegister);

// ─── Password toggle ────────────────────────────────────
function addPwToggle(btnId, inputId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener("click", () => {
    const isText = input.type === "text";
    input.type = isText ? "password" : "text";
    btn.innerHTML = isText
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  });
}
addPwToggle("toggleLoginPw",    "loginPassword");
addPwToggle("toggleRegisterPw", "registerPassword");

// ─── Password strength ──────────────────────────────────
const pwInput  = document.getElementById("registerPassword");
const pwFill   = document.getElementById("pwFill");
const pwLabel  = document.getElementById("pwLabel");

if (pwInput) {
  pwInput.addEventListener("input", () => {
    const val = pwInput.value;
    let score = 0;
    if (val.length >= 6)  score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
      { pct: "0%",   color: "transparent", label: "" },
      { pct: "20%",  color: "#f87171",     label: "Weak" },
      { pct: "40%",  color: "#fb923c",     label: "Fair" },
      { pct: "60%",  color: "#facc15",     label: "Good" },
      { pct: "80%",  color: "#34d399",     label: "Strong" },
      { pct: "100%", color: "#22d3ee",     label: "Great!" },
    ];
    const lvl = levels[score] || levels[0];
    pwFill.style.width      = lvl.pct;
    pwFill.style.background = lvl.color;
    pwLabel.textContent     = lvl.label;
  });
}

// ─── API helper ─────────────────────────────────────────
async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(path, { ...options, headers });
  let data = {};
  try { data = await response.json(); } catch (_) {}

  if (!response.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = response.status;
    throw err;
  }
  return data;
}

// ─── Filter state ───────────────────────────────────────
let currentFilter = "all";
let allTodos = [];

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos(allTodos);
  });
});

// ─── Render todos ───────────────────────────────────────
function renderTodos(todos) {
  allTodos = todos;
  const done  = todos.filter((t) => t.completed).length;
  completedCount.textContent = done;
  totalCount.textContent     = todos.length;

  const filtered =
    currentFilter === "pending" ? todos.filter((t) => !t.completed)
    : currentFilter === "done"  ? todos.filter((t) =>  t.completed)
    : todos;

  todoList.innerHTML = "";

  if (!filtered.length) {
    todoList.innerHTML = `
      <li class="todo-empty">
        <div class="todo-empty-icon">${currentFilter === "done" ? "🎉" : "📋"}</div>
        <div class="todo-empty-title">${currentFilter === "done" ? "Nothing completed yet" : "All clear!"}</div>
        <div class="todo-empty-sub">${currentFilter === "done" ? "Complete a task to see it here." : "Add your first task above."}</div>
      </li>`;
    return;
  }

  filtered.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = todo._id;

    // Checkbox
    const check = document.createElement("button");
    check.type = "button";
    check.className = "todo-check" + (todo.completed ? " checked" : "");
    check.setAttribute("aria-label", todo.completed ? "Mark incomplete" : "Mark complete");

    // Title
    const title = document.createElement("span");
    title.className = "todo-title-text" + (todo.completed ? " done" : "");
    title.textContent = todo.title;

    // Actions
    const actions = document.createElement("div");
    actions.className = "todo-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "action-btn toggle-btn" + (todo.completed ? " done-btn" : "");
    toggleBtn.textContent = todo.completed ? "Undo" : "Done";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "action-btn delete-btn";
    deleteBtn.textContent = "Delete";

    // Events
    async function handleToggle() {
      try {
        li.classList.add("completing");
        await apiRequest(`/todos/${todo._id}`, { method: "PUT" });
        await loadTodos();
      } catch (err) {
        setMessage(err.message, "error");
      }
    }

    check.addEventListener("click", handleToggle);
    toggleBtn.addEventListener("click", handleToggle);

    deleteBtn.addEventListener("click", async () => {
      li.style.opacity = "0";
      li.style.transform = "translateX(20px)";
      li.style.transition = "all 0.25s ease";
      await new Promise((r) => setTimeout(r, 240));
      try {
        await apiRequest(`/todos/${todo._id}`, { method: "DELETE" });
        setMessage("Task deleted", "success");
        await loadTodos();
      } catch (err) {
        setMessage(err.message, "error");
      }
    });

    actions.append(toggleBtn, deleteBtn);
    li.append(check, title, actions);
    todoList.appendChild(li);
  });
}

// ─── Load todos ─────────────────────────────────────────
async function loadTodos() {
  try {
    const todos = await apiRequest("/todos");
    renderTodos(todos);
  } catch (err) {
    if (err.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      showAuthUI();
      setMessage("Session expired. Please sign in again.", "error");
      return;
    }
    setMessage(err.message, "error");
  }
}

// ─── Register ───────────────────────────────────────────
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name     = document.getElementById("registerName").value.trim();
  const email    = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const btn      = document.getElementById("registerSubmit");

  setLoading(btn, true);
  try {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setMessage("Account created! Please sign in.", "success");
    registerForm.reset();
    if (pwFill) { pwFill.style.width = "0"; pwLabel.textContent = ""; }
    showLogin();
  } catch (err) {
    setMessage(err.message, "error");
  } finally {
    setLoading(btn, false);
  }
});

// ─── Login ──────────────────────────────────────────────
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email    = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const btn      = document.getElementById("loginSubmit");

  setLoading(btn, true);
  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    loginForm.reset();
    showTodoUI(data.name || email.split("@")[0]);
    setMessage("Welcome back!", "success");
    await loadTodos();
  } catch (err) {
    setMessage(err.message, "error");
  } finally {
    setLoading(btn, false);
  }
});

// ─── Add todo ───────────────────────────────────────────
todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("todoInput");
  const title = input.value.trim();
  if (!title) { setMessage("Please enter a task title.", "error"); return; }

  try {
    await apiRequest("/todos", { method: "POST", body: JSON.stringify({ title }) });
    input.value = "";
    setMessage("Task added!", "success");
    await loadTodos();
  } catch (err) {
    setMessage(err.message, "error");
  }
});

// ─── Logout ─────────────────────────────────────────────
function handleLogout() {
  localStorage.removeItem(TOKEN_KEY);
  allTodos = [];
  showAuthUI();
  setMessage("Signed out successfully.", "success");
}

logoutBtn.addEventListener("click", handleLogout);
if (logoutBtnTop) logoutBtnTop.addEventListener("click", handleLogout);

// ─── Init ───────────────────────────────────────────────
if (getToken()) {
  showTodoUI();
  loadTodos();
} else {
  showAuthUI();
}
