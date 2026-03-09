const express = require("express");
const axios = require("axios");
const auth = require("../middleware/authMiddleware");
const Expense = require("../models/Expense");
const MonthlySetup = require("../models/MonthlySetup");
const router = express.Router();

// SET MONTHLY INCOME + BUDGET
router.post("/setup", auth, async (req, res) => {
  try {
    const { income, budgetLimit, month } = req.body;
    const existing = await MonthlySetup.findOne({ userId: req.user.id, month });

    if (existing) {
      existing.income = income;
      existing.budgetLimit = budgetLimit;
      await existing.save();
    } else {
      await MonthlySetup.create({ userId: req.user.id, income, budgetLimit, month });
    }

    res.json({ message: "Monthly setup saved!" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ADD DAILY EXPENSE
router.post("/add", auth, async (req, res) => {
  try {
    const { category, description, amount, month, date } = req.body;
    await Expense.create({
      userId: req.user.id,
      category,
      description,
      amount,
      month,
      date
    });
    res.json({ message: "Expense added!" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET DASHBOARD DATA
router.get("/dashboard/:month", auth, async (req, res) => {
  try {
    const { month } = req.params;
    const setup = await MonthlySetup.findOne({ userId: req.user.id, month });
    const expenses = await Expense.find({ userId: req.user.id, month }).sort({ date: 1 });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const income = setup?.income || 0;
    const budgetLimit = setup?.budgetLimit || 0;
    const savings = income - totalSpent;
    const savingsRate = income > 0 ? savings / income : 0;
    const remaining = budgetLimit - totalSpent;

    // Call Python ML
    let mlData = { score: 0, risk_band: "N/A", risk: "N/A", suggestions: [] };
    try {
      const mlRes = await axios.post("http://127.0.0.1:8000/predict", {
        income,
        expenses: totalSpent,
        savings_ratio: savingsRate
      });
      mlData = mlRes.data;
    } catch (e) {
      mlData.suggestions = ["ML service not running. Start app.py"];
    }

    // Warnings
    const warnings = [];
    if (remaining < 0) warnings.push("🚨 Budget exceeded this month!");
    else if (remaining < budgetLimit * 0.1) warnings.push("⚠️ Only 10% budget left!");
    if (savingsRate < 0.2) warnings.push("⚠️ Savings below 20% — try to cut spending");
    if (totalSpent === 0) warnings.push("📝 No expenses logged yet this month");

    res.json({
      setup,
      expenses,
      totalSpent,
      remaining,
      savings,
      savingsRate,
      warnings,
      ...mlData
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL MONTHS FOR USER
router.get("/months", auth, async (req, res) => {
  try {
    const setups = await MonthlySetup.find({ userId: req.user.id }).sort({ month: -1 });
    res.json(setups);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;