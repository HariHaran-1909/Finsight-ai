# 🖥️ FinSight AI — Frontend

React-based frontend for the FinSight AI personal finance tracker.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Page routing |
| Axios | API calls |
| Recharts | Line chart for daily spending |
| React Circular Progressbar | Credit score ring |
| CSS (custom) | Dark theme styling |

---

## Folder Structure

```
src/
├── api/
│   └── api.js           # All axios API calls in one place
├── pages/
│   ├── Login.js         # Register + Login form
│   ├── Setup.js         # Monthly income & budget setup
│   └── Dashboard.js     # Main dashboard (charts, score, expenses)
├── components/
│   └── Navbar.js        # Top nav with username + logout
├── App.js               # Route definitions
└── styles.css           # Global dark theme styles
```

---

## Pages

### `/` — Login
- Toggle between Login and Register
- Stores JWT token and username in `localStorage`
- Redirects to `/dashboard` on success

### `/setup` — Monthly Setup
- Enter monthly income and budget limit
- Saved per user per month (format: `YYYY-MM`)
- Redirects to `/dashboard` after save

### `/dashboard` — Main Tracker
- Add daily expenses (category, description, amount, date)
- View stat cards: income, spent, remaining, savings
- Budget usage progress bar
- ML credit score with circular progress ring
- Day-by-day line chart
- AI suggestions + budget warnings
- Full expense history table

---

## Setup

```bash
npm install
npm start
```

Runs on `http://localhost:3000`

---

## Dependencies

```bash
npm install axios react-router-dom recharts react-circular-progressbar
```

---

## Auth Flow

1. User logs in → receives JWT from backend
2. Token stored in `localStorage`
3. Every API call sends `Authorization: Bearer <token>` header via Axios interceptor
4. Protected routes check token via `PrivateRoute` component — redirects to `/` if missing

---

## Environment

Frontend calls backend at `http://localhost:5000/api` (defined in `src/api/api.js`).
Change the `baseURL` in `api.js` when deploying.
