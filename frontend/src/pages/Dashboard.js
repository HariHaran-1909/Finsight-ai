import React, { useState, useEffect } from "react";
import { getDashboard, addExpense } from "../api/api";
import Navbar from "../components/Navbar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const CATEGORIES = ["Food", "Travel", "Rent", "Shopping", "Health", "Entertainment", "Others"];

export default function Dashboard() {
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const todayStr = today.toISOString().split("T")[0];

  const [data, setData] = useState(null);
  const [form, setForm] = useState({ category: "Food", description: "", amount: "", month: currentMonth, date: todayStr });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await getDashboard(currentMonth);
      setData(res.data);
    } catch {
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!form.amount) return setMsg("Enter an amount");
    try {
      await addExpense(form);
      setMsg("✅ Expense added!");
      setForm({ ...form, description: "", amount: "" });
      fetchData();
      setTimeout(() => setMsg(""), 2000);
    } catch {
      setMsg("❌ Error adding expense");
    }
  };

  // Build chart data — group expenses by date
  const chartData = () => {
    if (!data?.expenses) return [];
    const grouped = {};
    data.expenses.forEach(e => {
      grouped[e.date] = (grouped[e.date] || 0) + e.amount;
    });
    return Object.entries(grouped).map(([date, amount]) => ({ date: date.slice(5), amount }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (!data?.setup) {
    return (
      <div>
        <Navbar />
        <div className="page-center">
          <div className="card">
            <h2>No setup found for {currentMonth}</h2>
            <p>Please set your monthly income and budget first.</p>
            <button onClick={() => window.location.href = "/setup"}>Go to Setup →</button>
          </div>
        </div>
      </div>
    );
  }

  const budgetPercent = Math.min((data.totalSpent / data.setup.budgetLimit) * 100, 100);

  return (
    <div>
      <Navbar />
      <div className="dashboard">

        {/* WARNINGS */}
        {data.warnings?.length > 0 && (
          <div className="warnings">
            {data.warnings.map((w, i) => <p key={i}>{w}</p>)}
          </div>
        )}

        {/* TOP CARDS */}
        <div className="cards-row">
          <div className="stat-card">
            <p className="label">Monthly Income</p>
            <h3>₹{data.setup.income.toLocaleString()}</h3>
          </div>
          <div className="stat-card">
            <p className="label">Total Spent</p>
            <h3 style={{ color: "#ff6b6b" }}>₹{data.totalSpent.toLocaleString()}</h3>
          </div>
          <div className="stat-card">
            <p className="label">Remaining Budget</p>
            <h3 style={{ color: data.remaining < 0 ? "#ff4444" : "#00c896" }}>
              ₹{data.remaining.toLocaleString()}
            </h3>
          </div>
          <div className="stat-card">
            <p className="label">Savings</p>
            <h3 style={{ color: "#a78bfa" }}>₹{data.savings.toLocaleString()}</h3>
          </div>
        </div>

        <div className="main-grid">

          {/* LEFT — ADD EXPENSE */}
          <div className="card">
            <h3>Add Today's Expense</h3>
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <label>Description (optional)</label>
            <input
              placeholder="e.g. Lunch at cafe"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <label>Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 250"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            {msg && <p className="msg">{msg}</p>}
            <button onClick={handleAdd}>+ Add Expense</button>
          </div>

          {/* RIGHT — SCORE */}
          <div className="card center">
            <h3>Credit Score</h3>
            <div style={{ width: 160, margin: "20px auto" }}>
              <CircularProgressbar
                value={data.score}
                maxValue={900}
                text={`${data.score}`}
                styles={buildStyles({
                  textColor: "#fff",
                  pathColor: data.score > 750 ? "#00c896" : data.score > 600 ? "#f59e0b" : "#ff4444",
                  trailColor: "#2a2a3a"
                })}
              />
            </div>
            <p className="risk-tag">Band: {data.risk_band} &nbsp;|&nbsp; {data.risk}</p>

            <h3 style={{ marginTop: "20px" }}>Budget Used</h3>
            <div className="budget-bar">
              <div className="budget-fill" style={{
                width: `${budgetPercent}%`,
                background: budgetPercent > 90 ? "#ff4444" : budgetPercent > 70 ? "#f59e0b" : "#00c896"
              }} />
            </div>
            <p className="sub">{budgetPercent.toFixed(1)}% of budget used</p>
          </div>
        </div>

        {/* AI SUGGESTIONS */}
        <div className="card suggestions">
          <h3>💡 AI Suggestions</h3>
          <ul>
            {data.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        {/* LINE CHART */}
        <div className="card">
          <h3>📈 Daily Spending — {currentMonth}</h3>
          {chartData().length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ background: "#1a1a2e", border: "none", borderRadius: "8px" }}
                />
                <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="sub">No expenses logged yet — start adding!</p>
          )}
        </div>

        {/* EXPENSE LIST */}
        <div className="card">
          <h3>📋 This Month's Expenses</h3>
          {data.expenses?.length > 0 ? (
            <table className="expense-table">
              <thead>
                <tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {[...data.expenses].reverse().map((e, i) => (
                  <tr key={i}>
                    <td>{e.date}</td>
                    <td><span className="cat-badge">{e.category}</span></td>
                    <td>{e.description || "—"}</td>
                    <td style={{ color: "#ff6b6b" }}>₹{e.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="sub">No expenses yet.</p>
          )}
        </div>

      </div>
    </div>
  );
}