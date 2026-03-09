# ⚙️ FinSight AI — Backend

Node.js + Express REST API for the FinSight AI platform.
Handles authentication, expense tracking, and ML service communication.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth tokens |
| dotenv | Environment config |
| axios | Call Python ML service |

---

## Folder Structure

```
backend/
├── models/
│   ├── User.js              # username + hashed password
│   ├── MonthlySetup.js      # income + budget per month per user
│   └── Expense.js           # daily expenses
├── routes/
│   ├── auth.js              # POST /register, POST /login
│   └── expenses.js          # POST /setup, POST /add, GET /dashboard/:month
├── middleware/
│   └── authMiddleware.js    # JWT verification middleware
├── .env                     # Environment variables
└── server.js                # Entry point
```

---

## API Reference

### Auth Routes — `/api/auth`

#### `POST /api/auth/register`
```json
Request:  { "username": "hari", "password": "secret123" }
Response: { "message": "Account created! Please login." }
```

#### `POST /api/auth/login`
```json
Request:  { "username": "hari", "password": "secret123" }
Response: { "token": "<jwt>", "username": "hari" }
```

---

### Expense Routes — `/api/expenses` *(JWT required)*

#### `POST /api/expenses/setup`
```json
Request:  { "income": 50000, "budgetLimit": 35000, "month": "2025-07" }
Response: { "message": "Monthly setup saved!" }
```

#### `POST /api/expenses/add`
```json
Request:  { "category": "Food", "description": "Lunch", "amount": 250, "month": "2025-07", "date": "2025-07-15" }
Response: { "message": "Expense added!" }
```

#### `GET /api/expenses/dashboard/:month`
```json
Response: {
  "setup": { "income": 50000, "budgetLimit": 35000 },
  "expenses": [...],
  "totalSpent": 12400,
  "remaining": 22600,
  "savings": 37600,
  "savingsRate": 0.752,
  "warnings": [],
  "score": 780,
  "risk_band": "B",
  "risk": "Low Risk",
  "suggestions": ["✅ Your finances look healthy!"]
}
```

#### `GET /api/expenses/months`
Returns all months the user has set up.

---

## MongoDB Schemas

### User
```
username  String  unique
password  String  bcrypt hashed
```

### MonthlySetup
```
userId       ObjectId (ref: User)
month        String  e.g. "2025-07"
income       Number
budgetLimit  Number
```

### Expense
```
userId       ObjectId (ref: User)
month        String  e.g. "2025-07"
date         String  e.g. "2025-07-15"
category     String
description  String
amount       Number
```

---

## Setup

```bash
npm install
```

Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/finsight
JWT_SECRET=your_secret_key_here
PORT=5000
```

Run server:
```bash
node server.js
```

Runs on `http://localhost:5000`

---

## Auth Flow

- Passwords hashed with `bcryptjs` (salt rounds: 10)
- JWT tokens expire in **7 days**
- Every protected route uses `authMiddleware.js` to verify the token
- `req.user` contains `{ id, username }` after verification
