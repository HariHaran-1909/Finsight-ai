# 🤖 FinSight AI — ML Service

Python Flask microservice that serves credit score predictions using a pre-trained machine learning model.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Python 3.8+ | Language |
| Flask | Lightweight API server |
| flask-cors | Cross-origin requests |
| scikit-learn | ML model (RandomForest) |
| pickle | Model serialization |

---

## Folder Structure

```
ml/
├── app.py            # Flask prediction API
├── train_model.py    # Script to train and save model.pkl
└── model.pkl         # Trained RandomForest classifier
```

---

## API

### `POST /predict`

**Request:**
```json
{
  "income": 50000,
  "expenses": 30000,
  "savings_ratio": 0.4
}
```

**Response:**
```json
{
  "score": 780,
  "risk_band": "B",
  "risk": "Low Risk",
  "suggestions": ["✅ Your finances look healthy — keep it up!"]
}
```

---

## Credit Score Logic

| Metric | Formula |
|---|---|
| savings_ratio | `(income - expenses) / income` |
| ML prediction | Binary: 0 = Low Risk, 1 = High Risk |
| Credit Score | `300 + (1 - default_probability) × 600` |
| Score Range | 300 (worst) → 900 (best) |

### Risk Bands

| Band | Score Range |
|---|---|
| A | 800 – 900 |
| B | 700 – 799 |
| C | 600 – 699 |
| D | 500 – 599 |
| E | 300 – 499 |

### Suggestion Logic

| Condition | Suggestion |
|---|---|
| savings_ratio < 0.1 | 🚨 Critical: Save at least 10% immediately |
| savings_ratio < 0.2 | 💡 Try to save at least 20% of income |
| expenses > income × 0.8 | 💡 Expenses very high — cut non-essentials |
| All clear | ✅ Your finances look healthy! |

---

## Model

- **Algorithm:** RandomForest Classifier
- **Features:** `[income, expenses, savings_ratio]`
- **Target:** Binary credit default risk (0 or 1)
- **Trained with:** `train_model.py`
- **Saved as:** `model.pkl` using Python `pickle`

---

## Setup

```bash
pip install flask flask-cors scikit-learn
python app.py
```

Runs on `http://localhost:8000`

---

## Retrain Model

If you want to retrain with new data:

```bash
python train_model.py
```

This will overwrite `model.pkl` with the new trained model.

---

## Notes

- The ML service is called internally by the Node.js backend
- It is **not** exposed directly to the frontend
- If the ML service is down, the backend returns a fallback message instead of crashing
