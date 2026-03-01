const express = require("express");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "../data/finance-data.json");

// Ensure file exists
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

app.post("/analyze", async (req, res) => {
  try {
    const data = req.body;

    // Convert all values to numbers
    Object.keys(data).forEach((key) => {
      data[key] = Number(data[key]);
    });

    data.timestamp = new Date().toISOString();

    const existing = JSON.parse(fs.readFileSync(filePath));

    existing.push(data);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    // Financial Metrics
    const totalExpenses =
      data.rent +
      data.food +
      data.travel +
      data.emi +
      data.subscriptions +
      data.others;

    const savings = data.income - totalExpenses;
    const savingsRate = savings / data.income;
    const debtRatio = data.emi / data.income;

    // Trend Analysis
    let trendMessage = "Stable financial pattern.";

    if (existing.length > 2) {
      const prev = existing[existing.length - 2];

      if (data.emi > prev.emi) {
        trendMessage = "⚠ EMI burden increasing compared to last entry.";
      } else if (data.income > prev.income) {
        trendMessage = "📈 Income improving. Strong positive trend!";
      }
    }

    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict",
      data
    );

    res.json({
      ...mlResponse.data,
      history: existing,
      savings,
      savingsRate,
      debtRatio,
      trendMessage
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const frontendPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(5000, () => console.log("🚀 Node server running on 5000"));