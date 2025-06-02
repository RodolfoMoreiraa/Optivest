// src/pages/Watchlist.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Watchlist.css";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/watchlist/data/")
      .then((res) => {
        console.log("Dados favoritos recebidos:", res.data);
        setWatchlist(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar favoritos:", err);
        setLoading(false);
      });
  }, []);

  const handleRemove = (symbol) => {
    axiosInstance.get("/stocks/")
      .then((res) => {
        const stock = res.data.find((s) => s.symbol === symbol);
        if (stock) {
          axiosInstance.delete("/watchlist/", {
            data: { stock_id: stock.id },
          })
            .then(() => {
              setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
            })
            .catch(err => console.error("Erro ao remover da watchlist:", err));
        } else {
          console.error("Stock não encontrado para o símbolo:", symbol);
        }
      });
  };

  if (loading) {
    return (
      <div className="market-loader">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <section className="watchlist-page fade-slide-up">
      <div className="watchlist-back" onClick={() => navigate("/")}> 
        <FaArrowLeft size={22} color="#3b82f6" />
      </div>
      <h2 className="highlight">Ações Favoritas</h2>

      {watchlist.length === 0 ? (
        <p className="no-items">Ainda não adicionou ações favoritas.</p>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((stock, index) => (
            <div key={stock.symbol} className="watchlist-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card-header">
                <h3>{stock.symbol}</h3>
                <button className="remove-button" onClick={() => handleRemove(stock.symbol)}>Remover</button>
              </div>
              <p><strong>Último Valor:</strong> €{stock.last_value.toFixed(2)}</p>
              <p><strong>Máx.:</strong> €{stock.high.toFixed(2)} | <strong>Mín.:</strong> €{stock.low.toFixed(2)}</p>
              <p><strong>Volume:</strong> {stock.volume}</p>
              <p><strong>Dividend Yield:</strong> {stock.dividends.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Watchlist;
