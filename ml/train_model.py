import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
import pickle

np.random.seed(42)

data = []
for _ in range(1000):
    income = np.random.randint(20000, 150000)
    expenses = np.random.randint(10000, income)
    savings_ratio = (income - expenses) / income
    risk = 1 if savings_ratio < 0.2 else 0
    data.append([income, expenses, savings_ratio, risk])

df = pd.DataFrame(data, columns=["income", "expenses", "savings_ratio", "risk"])

X = df[["income", "expenses", "savings_ratio"]]
y = df["risk"]

model = LogisticRegression()
model.fit(X, y)

pickle.dump(model, open("model.pkl", "wb"))
print("Model trained and saved.")