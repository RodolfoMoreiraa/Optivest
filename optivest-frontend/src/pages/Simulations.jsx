// src/pages/Simulations.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axiosInstance from "../axiosInstance";
import "./Simulations.css";

const Simulations = () => {
  const [simulations, setSimulations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("simulations/")
      .then((res) => setSimulations(res.data))
      .catch((err) => console.error("Erro ao buscar simulações:", err));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Tens a certeza que queres apagar esta simulação?")) return;

    axiosInstance.delete(`simulations/${id}/`)
      .then(() => setSimulations(prev => prev.filter(sim => sim.id !== id)))
      .catch((err) => {
        console.error("Erro ao apagar simulação:", err);
        alert("Erro ao apagar simulação.");
      });
  };

  return (
    <section className="simulations-container fade-slide-up">
      <div className="back-button" onClick={() => navigate("/")}> 
        <FaArrowLeft size={20} color="#3b82f6" />
      </div>

      <h2 className="highlight">Minhas Simulações</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Estratégia</th>
            <th>Inicial (€)</th>
            <th>Mensal (€)</th>
            <th>Duração (anos)</th>
            <th>Lucro (€)</th>
            <th>Remover</th>
          </tr>
        </thead>
        <tbody>
          {simulations.map(sim => (
            <tr key={sim.id}>
              <td>{sim.stock_name}</td>
              <td>{sim.strategy}</td>
              <td>{sim.initial_amount}</td>
              <td>{sim.monthly_contribution}</td>
              <td>{sim.duration_years}</td>
              <td>
                <span className={sim.profit >= 0 ? "profit" : "loss"}>
                  {sim.profit?.toFixed(2)} €
                </span>
              </td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(sim.id)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Simulations;


