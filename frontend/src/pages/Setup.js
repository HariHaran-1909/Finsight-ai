import React, { useState } from "react";
import { setupMonth } from "../api/api";
import Navbar from "../components/Navbar";

export default function Setup() {
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const [form, setForm] = useState({ income: "", budgetLimit: "", month: currentMonth });
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!form.income || !form.budgetLimit) return setMessage("Fill all fields");
    try {
      await setupMonth(form);
      setMessage("✅ Setup saved!");
      setTimeout(() => window.location.href = "/dashboard", 1000);
    } catch {
      setMessage("❌ Error saving setup");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-center">
        <div className="card">
          <h2>Monthly Setup</h2>
          <p className="sub">Set your income and spending limit for <b>{form.month}</b></p>

          <label>Monthly Income (₹)</label>
          <input
            type="number"
            placeholder="e.g. 50000"
            value={form.income}
            onChange={(e) => setForm({ ...form, income: e.target.value })}
          />

          <label>Monthly Budget Limit (₹)</label>
          <input
            type="number"
            placeholder="e.g. 35000"
            value={form.budgetLimit}
            onChange={(e) => setForm({ ...form, budgetLimit: e.target.value })}
          />

          {message && <p className="msg">{message}</p>}
          <button onClick={handleSubmit}>Save & Continue →</button>
        </div>
      </div>
    </div>
  );
}