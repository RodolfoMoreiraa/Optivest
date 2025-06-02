import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { FaArrowLeft } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const intervals = ["1d", "5d", "1mo", "6mo", "1y", "5y", "max"];

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [interval, setInterval] = useState("1mo");
  const [chartData, setChartData] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/stock/${symbol}/history/?interval=${interval}`)
      .then((res) => {
        setInfo(res.data);
        const data = {
          labels: res.data.history.map((point) => point.date),
          datasets: [
            {
              label: "Preço (€)",
              data: res.data.history.map((point) => point.value),
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              tension: 0.4,
            },
          ],
        };
        setChartData(data);
      })
      .catch((err) => console.error("Erro ao buscar dados do stock:", err));
  }, [symbol, interval]);

  return (
    <section style={{ padding: "20px", color: "white" }}>
      <div
        onClick={() => navigate("/market")}
        style={{ cursor: "pointer", fontSize: "22px", color: "#3b82f6" }}
      >
        <FaArrowLeft style={{ marginRight: "10px" }} /> Voltar ao mercado
      </div>

      {info && (
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontSize: "30px" }}>{info.name} ({symbol})</h2>
          <p style={{ marginBottom: "10px", color: "#94a3b8" }}>Dividendo: {info.dividend_yield}% | Volume: {info.volume}</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {intervals.map((int) => (
              <button
                key={int}
                onClick={() => setInterval(int)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: int === interval ? "#3b82f6" : "#1e293b",
                  color: "white",
                  border: "1px solid #3b82f6",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {int.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {chartData && (
        <div style={{ marginTop: "30px", backgroundColor: "#1e293b", padding: "20px", borderRadius: "10px" }}>
          <Line data={chartData} options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
            },
            scales: {
              x: {
                type: "time",
                time: {
                  unit: interval === "1d" ? "hour" : "day",
                },
                ticks: {
                  color: "#cbd5e1",
                }
              },
              y: {
                ticks: {
                  color: "#cbd5e1",
                }
              }
            }
          }} />
        </div>
      )}
    </section>
  );
};

export default StockDetails;