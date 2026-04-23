# Todo Project

A full-stack Todo application with:
- Node.js + Express backend
- MongoDB with Mongoose
- JWT authentication
- Tailwind-based frontend served from the same Express app

## Features

- User registration and login
- Token-based protected routes
- Create todos
- Toggle complete/incomplete
- Delete todos

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Token (`jsonwebtoken`)
- Tailwind CSS (CDN)

## Project Structure

```text
todo/
  middleware/
    auth.js
  model/
    user.js
    todo.js
  public/
    index.html
    app.js
  routes/
    auth.js
    todo.js
  index.js
  package.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create/update `.env` in project root:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```

3. Start server:
```bash
npm start
```

4. Open in browser:
```text
http://localhost:3000
```

## API Endpoints

### Auth
- `POST /auth/register` - register new user
- `POST /auth/login` - login and get JWT token

### Todos (Protected)
- `GET /todos` - get all todos for logged-in user
- `POST /todos` - create todo
- `PUT /todos/:id` - toggle completion
- `DELETE /todos/:id` - delete todo

## Notes

- Frontend automatically sends `Authorization: Bearer <token>` after login.
- If token expires or becomes invalid, user is asked to login again.
