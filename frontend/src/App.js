import React, { useState } from "react";
import "./styles.css";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

function App() {
  const [formData, setFormData] = useState({
    income: "",
    rent: "",
    food: "",
    travel: "",
    emi: "",
    subscriptions: "",
    others: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    setResult(data);
  };

  const downloadPDF = async () => {
  const input = document.getElementById("report-section");

  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 10, width, height);
  pdf.save("FinSight_AI_Credit_Report.pdf");
};

  const pieData = {
    labels: ["Rent", "Food", "Travel", "EMI", "Subscriptions", "Others"],
    datasets: [
      {
        data: [
          formData.rent,
          formData.food,
          formData.travel,
          formData.emi,
          formData.subscriptions,
          formData.others
        ],
        backgroundColor: [
          "#8A2BE2",
          "#5F2CFF",
          "#2F80ED",
          "#00C6FF",
          "#FF5858",
          "#F7971E"
        ]
      }
    ]
  };

  const lineData =
    result &&
    {
      labels: result.history.map((h) =>
        new Date(h.timestamp).toLocaleDateString()
      ),
      datasets: [
        {
          label: "Savings Trend",
          data: result.history.map(
            (h) =>
              h.income -
              (h.rent +
                h.food +
                h.travel +
                h.emi +
                h.subscriptions +
                h.others)
          ),
          borderColor: "#8A2BE2",
          tension: 0.4
        }
      ]
    };

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          FinSight AI
        </motion.h1>
        <p>AI Powered Credit Intelligence Platform</p>
      </section>

      {/* FORM */}
      <section className="form-section">
        <motion.form
          onSubmit={handleSubmit}
          className="glass-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              name={key}
              placeholder={key.toUpperCase()}
              onChange={handleChange}
              required
            />
          ))}
          <button type="submit">Analyze Financial Health</button>
        </motion.form>
      </section>

      {result && (
  <div id="report-section">

    {/* SCORE + HEALTH */}
    <section className="score-section">
            <div className="glass-box">
              <h2>Credit Score</h2>
              <div style={{ width: 180 }}>
                <CircularProgressbar
                  value={result.score}
                  maxValue={900}
                  text={`${result.score}`}
                  styles={buildStyles({
                    textColor: "#fff",
                    pathColor:
                      result.score > 750
                        ? "#00ff88"
                        : result.score > 650
                        ? "#ffaa00"
                        : "#ff4444",
                    trailColor: "#2a2a2a"
                  })}
                />
              </div>
              <p className="risk-badge">Risk Level:{result.risk_band}</p>
            </div>

      <div className="glass-box">
        <h2>Financial Health</h2>
        <p>
          {result.savingsRate > 0.3
            ? "🟢 Excellent savings habit"
            : result.savingsRate > 0.15
            ? "🟡 Moderate savings"
            : "🔴 Poor savings rate"}
        </p>
        <p>{result.trendMessage}</p>
      </div>
    </section>

    {/* AI INSIGHTS */}
    <section className="insight-section">
      <div className="insight-card">
        <h3>AI Insights & Suggestions</h3>
        <ul>
          {result.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </section>

    {/* CHARTS */}
    <section className="charts">
      <div className="chart-box">
        <Pie data={pieData} />
      </div>
      <div className="chart-box">
        <Line data={lineData} />
      </div>
    </section>
    <div style={{ textAlign: "center", paddingBottom: "60px" }}>
  <button onClick={downloadPDF} className="download-btn">
    Download Credit Report (PDF)
  </button>
</div>

  </div>
)}
    </div>
  );
}

export default App;
