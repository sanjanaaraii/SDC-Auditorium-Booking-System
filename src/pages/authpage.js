import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const API_URL = "http://localhost:5000/api/auth";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/login" : "/register";

    const res = await axios.post(`${API_URL}${endpoint}`, formData);
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setAuth({ token, user });

    if (user.role === "admin") navigate("/admin");
    else if (user.role === "organizer") navigate("/book");
    else navigate("/audience-bookings");

  };

  const inputStyle = {
  width: "100%",
  padding: "0.7rem",
  marginBottom: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const buttonStyle = {
  width: "100%",
  padding: "0.7rem",
  background: "#702963",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "1rem",
  cursor: "pointer",
};


  return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f6fa",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        background: "#fff",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        {isLogin ? "Login" : "Create Account"}
      </h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            style={inputStyle}
          />
        )}

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: "1rem",
          fontSize: "0.9rem",
        }}
      >
        {isLogin ? "New here?" : "Already have an account?"}{" "}
        <span
          onClick={() => setIsLogin(!isLogin)}
          style={{ color: "#702963", cursor: "pointer", fontWeight: "bold" }}
        >
          {isLogin ? "Create one" : "Login"}
        </span>
      </p>
    </div>
  </div>
);
};

export default AuthPage;
