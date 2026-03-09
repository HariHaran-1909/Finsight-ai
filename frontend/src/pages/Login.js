import React, { useState } from "react";
import { login, register } from "../api/api";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.username || !form.password)
      return setMessage("Please fill all fields");
    setLoading(true);
    try {
      if (isRegister) {
        const res = await register(form);
        setMessage(res.data.message);
        setIsRegister(false);
      } else {
        const res = await login(form);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="brand">FinSight AI</h1>
        <p className="brand-sub">Your Personal Finance Tracker</p>

        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {message && <p className="msg">{message}</p>}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>

        <p className="toggle">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <span onClick={() => { setIsRegister(!isRegister); setMessage(""); }}>
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}