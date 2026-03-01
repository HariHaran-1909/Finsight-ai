from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)
model = pickle.load(open("model.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    income = float(data["income"])
    expenses = sum([
        float(data["rent"]),
        float(data["food"]),
        float(data["travel"]),
        float(data["emi"]),
        float(data["subscriptions"]),
        float(data["others"])
    ])

    savings_ratio = (income - expenses) / income

    prediction = model.predict([[income, expenses, savings_ratio]])[0]
    probability = model.predict_proba([[income, expenses, savings_ratio]])[0][1]

    # Convert probability to credit score (300–900 range)
    credit_score = int(300 + (1 - probability) * 600)

# Ensure limits
    credit_score = max(300, min(credit_score, 900))

    risk = "High Risk" if prediction == 1 else "Low Risk"

    suggestions = []
    if savings_ratio < 0.2:
        suggestions.append("Increase savings above 20%")
    if expenses > income * 0.8:
        suggestions.append("Reduce expenses significantly")
    if not suggestions:
        suggestions.append("Your financial condition is stable")

    return jsonify({
    "score": credit_score,
    "risk_band": (
        "A" if credit_score >= 800 else
        "B" if credit_score >= 700 else
        "C" if credit_score >= 600 else
        "D" if credit_score >= 500 else
        "E"
    ),
    "suggestions": suggestions
})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)