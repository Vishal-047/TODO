# Workflow

This file describes the recommended workflow for developing and maintaining this Todo project.

## 1. Start Development

1. Open terminal in project root (`todo/`).
2. Ensure `.env` has valid `MONGO_URI` and `JWT_SECRET`.
3. Install dependencies (if needed):
```bash
npm install
```
4. Run server:
```bash
npm start
```
5. Open app at `http://localhost:3000`.

## 2. Typical Change Flow

1. Understand current behavior (frontend + backend route).
2. Update backend route/model logic if needed.
3. Update frontend (`public/index.html` and `public/app.js`) if UI/API behavior changes.
4. Run quick checks:
   - Server starts without crash
   - Register/login works
   - Add, toggle, delete todo works
5. Re-test edge cases:
   - Empty fields
   - Invalid token/session expiry
   - Invalid todo id

## 3. File Ownership Guide

- `index.js`:
  App bootstrap, DB connection, route mounting, static frontend serving.
- `routes/auth.js`:
  Register/login logic and JWT generation.
- `routes/todo.js`:
  Protected todo CRUD operations.
- `middleware/auth.js`:
  JWT verification and auth gate.
- `model/*.js`:
  MongoDB schemas.
- `public/*`:
  Frontend UI, interactions, and API calls.

## 4. Debugging Checklist

1. If login fails:
   - verify `JWT_SECRET`
   - verify user exists in DB
2. If DB operations fail:
   - verify `MONGO_URI`
   - check MongoDB connectivity
3. If frontend cannot call API:
   - ensure server is running on expected `PORT`
   - inspect browser console/network tab
4. If protected routes return 401:
   - verify token exists in `localStorage`
   - confirm `Authorization` header format is `Bearer <token>`

## 5. Quality Checklist Before Finalizing

- No syntax errors in changed `.js` files
- No broken endpoint paths between frontend and backend
- No leftover debug code/logs that leak sensitive data
- Basic responsive UI remains usable on mobile and desktop

## 6. Future Improvements (Optional)

- Add input validation library (e.g., Zod/Joi)
- Add edit todo title endpoint and UI
- Add tests (unit/integration)
- Add rate limiting and security middleware
