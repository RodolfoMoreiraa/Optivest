import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Erro ao registar. Verifica os dados.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card centered">
        <h2>Registar</h2>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">Conta criada com sucesso! 👌</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          {form.username && document.activeElement.name !== "username" && (
            <div className="autofill-label">✔ Preenchido automaticamente</div>
          )}

          <div className="input-wrapper">
            <svg viewBox="0 0 24 24"><path d="M21 8V7l-3 2-2-2-4 4-3-3-5 5v2h18z"/></svg>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-wrapper">
            <svg viewBox="0 0 24 24"><path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-10h-1V6a5 5 0 00-10 0v1H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2zm-6 10a4 4 0 110-8 4 4 0 010 8zm3-10H9V6a3 3 0 016 0v1z"/></svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {form.password && (
            <div className={`autofill-label ${document.activeElement.name === "password" ? "hidden" : ""}`}>
              ✔ Preenchido automaticamente
            </div>
          )}

          <button type="submit" className="auth-button">CRIAR CONTA</button>
        </form>
      </div>
    </div>
  );
};

export default Register;




