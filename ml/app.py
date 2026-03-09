from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

model = pickle.load(open("model.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    income = float(data["income"])
    expenses = float(data["expenses"])
    savings_ratio = float(data["savings_ratio"])

    prediction = model.predict([[income, expenses, savings_ratio]])[0]
    probability = model.predict_proba([[income, expenses, savings_ratio]])[0][1]

    credit_score = int(300 + (1 - probability) * 600)
    credit_score = max(300, min(credit_score, 900))

    risk = "High Risk" if prediction == 1 else "Low Risk"

    suggestions = []
    if savings_ratio < 0.1:
        suggestions.append("🚨 Critical: Save at least 10% of income immediately")
    elif savings_ratio < 0.2:
        suggestions.append("💡 Try to save at least 20% of your income")
    if expenses > income * 0.8:
        suggestions.append("💡 Expenses are very high — cut non-essentials")
    if not suggestions:
        suggestions.append("✅ Your finances look healthy — keep it up!")

    risk_band = (
        "A" if credit_score >= 800 else
        "B" if credit_score >= 700 else
        "C" if credit_score >= 600 else
        "D" if credit_score >= 500 else "E"
    )

    return jsonify({
        "score": credit_score,
        "risk_band": risk_band,
        "risk": risk,
        "suggestions": suggestions
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)