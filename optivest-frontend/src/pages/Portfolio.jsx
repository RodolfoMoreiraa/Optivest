// src/pages/Portfolio.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./Portfolio.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const Portfolio = () => {
  const [stocks, setStocks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("http://127.0.0.1:8000/api/portfolio/")
      .then((res) => {
        setStocks(res.data);
        const totalValue = res.data.reduce((acc, item) => acc + item.current_value, 0);
        setTotal(totalValue);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar portfolio:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (symbol) => {
    if (!window.confirm(`Tens a certeza que queres apagar todas as simulações de ${symbol}?`)) return;

    axiosInstance.delete(`http://127.0.0.1:8000/api/delete-simulations/${symbol}/`)
      .then(() => {
        const updated = stocks.filter((s) => s.symbol !== symbol);
        setStocks(updated);
        const novoTotal = updated.reduce((acc, item) => acc + item.current_value, 0);
        setTotal(novoTotal);
      })
      .catch((err) => {
        console.error("Erro ao apagar simulações:", err);
        alert("Erro ao apagar as simulações.");
      });
  };

  const chartData = {
    labels: stocks.map(s => s.symbol),
    datasets: [
      {
        label: "Valor Atual (€)",
        data: stocks.map(s => s.current_value),
        backgroundColor: [
          "#3b82f6", "#f43f5e", "#10b981", "#f59e0b",
          "#8b5cf6", "#14b8a6", "#eab308", "#ec4899",
          "#6366f1", "#84cc16", "#0ea5e9", "#ef4444"
        ],
        borderColor: "#1e293b",
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <section className="portfolio-container fade-slide-up">
      <div className="back-button" onClick={() => navigate("/")}> 
        <FaArrowLeft size={20} color="#3b82f6" />
      </div>

      <div className="portfolio-donut">
        <h2 className="highlight">Portfolio Overview</h2>
        <div className="donut-wrapper">
          <Doughnut data={chartData} />
        </div>
        <p className="portfolio-total">
          <strong>Total Net Worth:</strong> €{total.toFixed(2)}
        </p>
      </div>

      <div className="portfolio-cards">
        {stocks.map((stock) => (
          <div className="stock-card fade-in" key={stock.symbol}>
            <div className="stock-card-header">
              <h3>{stock.name} ({stock.symbol})</h3>
              <button
                className="delete-button"
                onClick={() => handleDelete(stock.symbol)}
                title="Apagar simulações"
              >
                ❌
              </button>
            </div>
            <p>Ações: <strong>{stock.total_shares}</strong></p>
            <p>Valor Investido: €{stock.total_invested}</p>
            <p>Valor Atual: €{stock.current_value}</p>
            <p className={stock.profit >= 0 ? "profit" : "loss"}>
              <strong>Lucro:</strong> {stock.profit >= 0 ? "+" : ""}€{stock.profit}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;



