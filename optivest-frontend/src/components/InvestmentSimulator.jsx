import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axiosInstance from "../axiosInstance";
import './InvestmentSimulator.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InvestmentSimulator = () => {
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState({
    symbol: "",
    strategy: "DCA",
    initial_amount: "",
    monthly_contribution: "",
    duration_years: "",
  });
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/stocks/")
      .then((res) => setStocks(res.data))
      .catch((err) => console.error("Erro ao buscar ações:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      symbol: form.symbol,
      initial_amount: parseFloat(form.initial_amount),
      monthly_contribution: parseFloat(form.monthly_contribution),
      duration_years: parseInt(form.duration_years),
      strategy: form.strategy,
    };

    axiosInstance.post("simulate-real/", formData)
      .then((res) => {
        setResult(res.data);

        const barData = {
          labels: ["Investido", "Valor Final", "Lucro"],
          datasets: [
            {
              label: "€",
              data: [
                res.data.cash_invested,
                res.data.portfolio_value,
                res.data.profit,
              ],
              backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
              borderRadius: 8,
            },
          ],
        };

        setChartData(barData);
      })
      .catch((err) => {
        console.error("Erro na simulação:", err);
        alert("Erro ao simular. Verifica os dados.");
      });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#cbd5e1',
          font: { weight: 'bold' },
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#3b82f6',
        bodyColor: '#e2e8f0',
        borderColor: '#3b82f6',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: '#334155' }
      },
      y: {
        ticks: { color: '#cbd5e1' },
        grid: { color: '#334155' }
      }
    }
  };

  return (
    <section id="simulator" className="simulator-container">
      <form className="simulator-form" onSubmit={handleSubmit}>
        <h2 className="highlight">Investment Simulator</h2>

        <div className="simulator-inputs">
          <div className="input-group">
            <label>Stock:</label>
            <select
              name="symbol"
              className="gradient-input"
              value={form.symbol}
              onChange={handleChange}
              required
            >
              <option value="">-- Select --</option>
              {stocks.map((stock) => (
                <option key={stock.id} value={stock.symbol}>
                  {stock.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Initial Amount (€):</label>
            <input
              type="number"
              name="initial_amount"
              className="gradient-input"
              value={form.initial_amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Monthly Contribution (€):</label>
            <input
              type="number"
              name="monthly_contribution"
              className="gradient-input"
              value={form.monthly_contribution}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Duration (years):</label>
            <input
              type="number"
              name="duration_years"
              className="gradient-input"
              value={form.duration_years}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Strategy:</label>
            <select
              name="strategy"
              className="gradient-input"
              value={form.strategy}
              onChange={handleChange}
              required
            >
              <option value="DCA">DCA (Monthly Investment)</option>
              <option value="LUMP_SUM">Lump Sum (One-time Investment)</option>
              <option value="DIV">Reinvest Dividends (DCA + Dividends)</option>
            </select>
          </div>
        </div>

        <button type="submit" className="simulator-button">
          Run Simulation
        </button>
      </form>

      <div className="simulator-results">
        {result && (
          <div className="simulation-result fade-in">
            <h3>Resultado da Simulação</h3>
            <div className="result-values">
              <p><strong>Investido:</strong> €{result.cash_invested}</p>
              <p><strong>Valor Final:</strong> €{result.portfolio_value}</p>
              <p><strong>Lucro:</strong> €{result.profit}</p>
              <p><strong>Ações Compradas:</strong> {result.total_shares}</p>
            </div>
          </div>
        )}

        {chartData && (
          <div className="simulation-chart">
            <h4>Gráfico Comparativo</h4>
            <Bar data={chartData} options={options} />
          </div>
        )}
      </div>
    </section>
  );
};

export default InvestmentSimulator;


