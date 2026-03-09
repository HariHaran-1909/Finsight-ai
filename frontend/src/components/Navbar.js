import React from "react";

export default function Navbar() {
  const username = localStorage.getItem("username");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <h2 className="logo">FinSight AI</h2>
      <div className="nav-right">
        <span>👤 {username}</span>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}