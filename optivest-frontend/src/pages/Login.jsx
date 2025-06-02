import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/");
    } catch (err) {
      setError("Credenciais inválidas. Tenta novamente.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card centered">
        <h2>Login</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <svg viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <input
              type="username"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <svg viewBox="0 0 24 24">
              <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-10h-1V6a5 5 0 00-10 0v1H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2zm-6 10a4 4 0 110-8 4 4 0 010 8zm3-10H9V6a3 3 0 016 0v1z" />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            ENTRAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;





