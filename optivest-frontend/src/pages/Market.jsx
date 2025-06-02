// src/pages/Market.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import axiosInstance from "../axiosInstance";
import "./Market.css";

const Market = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("watchlist");
    return stored ? JSON.parse(stored) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/market-data/")
      .then((res) => {
        const withSparklines = res.data.map(stock => ({
          ...stock,
          sparkline: Array.from({ length: 8 }, () => stock.last_value + (Math.random() - 0.5) * 0.5)
        }));
        setStocks(withSparklines);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do mercado:", err);
      });
  }, []);

  const toggleFavorite = (stock) => {
    const isFavorite = favorites.includes(stock.symbol);
    const updatedFavorites = isFavorite
      ? favorites.filter((item) => item !== stock.symbol)
      : [...favorites, stock.symbol];

    setFavorites(updatedFavorites);
    localStorage.setItem("watchlist", JSON.stringify(updatedFavorites));

    if (isFavorite) {
      axiosInstance.delete("/watchlist/", {
        data: { stock_id: stock.id }
      }).catch((err) => console.error("Erro ao remover dos favoritos:", err));
    } else {
      axiosInstance.post("/watchlist/", {
        stock_id: stock.id
      }).catch((err) => console.error("Erro ao adicionar aos favoritos:", err));
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="market-loader">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <section className="market-page">
      <div className="market-back" onClick={handleBackClick}>
        <FaArrowLeft size={22} />
      </div>

      <h2 className="highlight">Market Data</h2>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Last Value (€)</th>
              <th>High (€)</th>
              <th>Low (€)</th>
              <th>Volume</th>
              <th>Dividend Yield (%)</th>
              <th>Gráfico</th>
              <th>Favorito</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.last_value.toFixed(2)}</td>
                <td>{stock.high.toFixed(2)}</td>
                <td>{stock.low.toFixed(2)}</td>
                <td>{stock.volume}</td>
                <td className={stock.dividends >= 0 ? 'positive' : 'negative'}>
                  {stock.dividends >= 0 ? '📈' : '📉'} {stock.dividends.toFixed(2)}%
                </td>
                <td>
                  <Sparklines data={stock.sparkline} width={80} height={30}>
                    <SparklinesLine style={{ stroke: "#3b82f6", fill: "none" }} />
                  </Sparklines>
                </td>
                <td>
                  <button
                    onClick={() => toggleFavorite(stock)}
                    className={`favorite-button ${favorites.includes(stock.symbol) ? "active" : ""}`}
                    title={favorites.includes(stock.symbol) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    {favorites.includes(stock.symbol) ? "★" : "☆"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Market;


