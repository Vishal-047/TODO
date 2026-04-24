# 🤖 The Frontend of This Project Was Entirely Built by AI

---

# ⚡ Pulse Tasks

A full-stack **Todo application** built with Node.js, Express, and MongoDB — featuring a premium dark-mode UI with glassmorphism, animated backgrounds, JWT authentication, and one-tap task management.

---

## ✨ Features

- 🔐 User registration & login with JWT authentication
- 🎯 Create, complete, and delete todos
- 🔄 Toggle tasks between pending and completed
- 📊 Live stats chip (completed / total)
- 🔍 Filter tasks — All / Pending / Completed
- 💪 Password strength meter on signup
- 👁️ Show / hide password toggle
- ⚡ Loading states on form submission
- 📱 Fully responsive — mobile & desktop
- ☁️ Deployable to Vercel

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server & REST API |
| MongoDB + Mongoose | Database & ODM |
| jsonwebtoken | JWT auth tokens |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| Vanilla HTML / CSS / JS | Core UI (no framework) |
| CSS Custom Properties | Design system tokens |
| Google Fonts (Inter, Space Grotesk) | Typography |
| CSS animations & backdrop-filter | Glassmorphism & micro-animations |

---

## 📁 Project Structure

```text
todo/
├── middleware/
│   └── auth.js           # JWT verification middleware
├── model/
│   ├── user.js           # User schema
│   └── todo.js           # Todo schema
├── public/
│   ├── index.html        # Full SPA (auth + todo views)
│   ├── styles.css        # Premium design system
│   └── app.js            # Client-side logic
├── routes/
│   ├── auth.js           # /auth/register, /auth/login
│   └── todo.js           # CRUD todo endpoints
├── .env.example          # Environment variable template
├── vercel.json           # Vercel deployment config
├── index.js              # Express app entry point
└── package.json
```

---

## 🚀 Local Setup

**1. Clone & install dependencies:**
```bash
git clone <your-repo-url>
cd todo
npm install
```

**2. Create a `.env` file in the project root:**
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/<dbname>
JWT_SECRET=your_super_secret_key
PORT=3000
```

**3. Start the development server:**
```bash
npm start
```

**4. Open in your browser:**
```
http://localhost:3000
```

---

## ☁️ Deploy to Vercel

**1. Install the Vercel CLI:**
```bash
npm install -g vercel
```

**2. Login and deploy:**
```bash
vercel
```

**3. Add environment variables in Vercel dashboard:**

Go to **Project Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random secret string |

> ⚠️ Do **not** add `PORT` — Vercel manages the port automatically.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive a JWT token |

### Todos *(JWT protected)*
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/todos` | Get all todos for the logged-in user |
| `POST` | `/todos` | Create a new todo |
| `PUT` | `/todos/:id` | Toggle todo completion |
| `DELETE` | `/todos/:id` | Delete a todo |

---

## 🔒 Auth Flow

1. User registers → password hashed with `bcryptjs` → stored in MongoDB
2. User logs in → JWT issued with user ID as payload
3. All `/todos` requests require `Authorization: Bearer <token>` header
4. Token is stored in `localStorage` on the client
5. On token expiry (401 response), user is redirected back to login

---

## 📝 Notes

- MongoDB connection is reused across serverless invocations (Vercel-safe)
- The `public/` folder is served as static files directly by Express
- All API routes return JSON; the frontend is a single-page app with no page reloads
