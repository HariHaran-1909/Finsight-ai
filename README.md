# 💸 FinSight AI

> **AI-Powered Personal Finance Tracker** — Track daily expenses, monitor your budget, and get real-time credit health insights powered by Machine Learning.

![FinSight AI](https://img.shields.io/badge/FinSight-AI-8b5cf6?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Python](https://img.shields.io/badge/Python-Flask-3776AB?style=for-the-badge&logo=python)
![MongoDB](https://img.shields.io/badge/MongoDB-Community-47A248?style=for-the-badge&logo=mongodb)

---

## 📌 Overview

FinSight AI is a full-stack personal finance management platform where users can:

- Register and log in with a unique username and password
- Set their **monthly income and budget limit**
- Log **daily expenses** by category and description
- View a **live dashboard** with spending charts, budget tracker, and savings info
- Receive **AI-generated suggestions and warnings** based on their spending pattern
- Get a **ML-powered credit score and risk band** calculated from their financial data

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    React Frontend (:3000)                        │
│         Login → Setup → Dashboard (Charts, Score, Alerts)       │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP (Axios + JWT)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Node.js + Express (:5000)                     │
│                                                                  │
│   /api/auth          →  Register / Login (bcrypt + JWT)         │
│   /api/expenses      →  Setup / Add / Dashboard                 │
│                                                                  │
│   authMiddleware     →  JWT Token Verification                  │
└──────────┬──────────────────────────┬───────────────────────────┘
           │ Mongoose ODM             │ Axios HTTP
           ▼                          ▼
┌──────────────────────┐   ┌──────────────────────────────────────┐
│  MongoDB Community   │   │        Python Flask ML (:8000)        │
│  localhost:27017     │   │                                       │
│                      │   │  POST /predict                        │
│  Collections:        │   │  Input: income, expenses,             │
│  - users             │   │         savings_ratio                 │
│  - monthlysetups     │   │  Output: credit score, risk band,     │
│  - expenses          │   │          suggestions                  │
└──────────────────────┘   │  Model: RandomForest (model.pkl)      │
                           └──────────────────────────────────────┘
```

---

## 📁 Project Structure

```
finsight-ai/
│
├── frontend/                   # React Application
│   └── src/
│       ├── api/api.js          # Axios API calls
│       ├── pages/
│       │   ├── Login.js        # Auth page
│       │   ├── Setup.js        # Monthly income/budget setup
│       │   └── Dashboard.js    # Main tracker dashboard
│       ├── components/
│       │   └── Navbar.js       # Navigation bar
│       ├── App.js              # Routes
│       └── styles.css          # Global styles
│
├── backend/                    # Node.js + Express API
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── MonthlySetup.js     # Monthly income/budget schema
│   │   └── Expense.js          # Daily expense schema
│   ├── routes/
│   │   ├── auth.js             # Register / Login
│   │   └── expenses.js         # Setup / Add / Dashboard
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── .env                    # Environment variables
│   └── server.js               # Entry point
│
├── ml/                         # Python ML Service
│   ├── app.py                  # Flask prediction API
│   ├── train_model.py          # Model training script
│   └── model.pkl               # Trained RandomForest model
│
└── data/                       # (legacy) JSON data store
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Recharts, React Circular Progressbar |
| Backend | Node.js, Express.js, Mongoose, JWT, bcryptjs |
| Database | MongoDB Community Server (localhost) |
| ML Service | Python, Flask, scikit-learn, pickle |
| Auth | JWT (7-day tokens), bcrypt password hashing |
| Styling | Custom CSS (dark theme, glassmorphism) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.8+
- MongoDB Community Server (running on port 27017)

### 1. Clone the Repository
```bash
git clone https://github.com/HariHaran-1909/finsight-ai.git
cd finsight-ai
```

### 2. Start MongoDB
MongoDB runs as a Windows service automatically after installation.
To verify: `Win+R` → `services.msc` → MongoDB → **Running**

### 3. Start ML Service
```bash
cd ml
pip install flask flask-cors scikit-learn
python app.py
# Running on http://localhost:8000
```

### 4. Start Backend
```bash
cd backend
npm install
node server.js
# Running on http://localhost:5000
```

### 5. Start Frontend
```bash
cd frontend
npm install
npm start
# Running on http://localhost:3000
```

---

## 🌐 App Routes

| URL | Page | Auth Required |
|---|---|---|
| `localhost:3000/` | Login / Register | ❌ |
| `localhost:3000/setup` | Monthly Budget Setup | ✅ |
| `localhost:3000/dashboard` | Main Dashboard | ✅ |

---

## 🔑 Environment Variables (`backend/.env`)

```env
MONGO_URI=mongodb://localhost:27017/finsight
JWT_SECRET=your_secret_key_here
PORT=5000
```

---

## 📊 Features

- ✅ Secure login with hashed passwords (bcrypt)
- ✅ Per-user data isolation via JWT
- ✅ Monthly income + budget setup
- ✅ Daily expense logging (category + description + amount)
- ✅ Real-time remaining budget indicator
- ✅ Day-by-day spending line chart
- ✅ ML credit score (300–900) with risk band (A–E)
- ✅ AI suggestions based on savings ratio
- ✅ Budget warnings and alerts
- ✅ Full expense history table

---

## 👨‍💻 Author

Built by **Hari Haran**
