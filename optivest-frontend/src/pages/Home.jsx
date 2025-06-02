// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import VideoHero from '../components/VideoHero';
import FAQSection from '../components/FAQSection';
import InvestmentSimulator from '../components/InvestmentSimulator';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import FeaturesSection from '../components/FeaturesSection';
import ArchitectureSection from '../components/ArchitectureSection';
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    const element = document.getElementById("simulator-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      <Navbar />
      <header className="hero-container">
        <div className="hero-content fade-in">
          <h1 className="hero-title">
            Simula estratégias de investimento com a <span className="optivest-glow">Optivest</span>
          </h1>
          <p className="hero-paragraph">
            Através da Optivest consegues simular e comparar as tuas estratégias de investimento,
            visualizar os resultados, ter acesso a dados do Stock Market Português em tempo real
            e tomar decisões baseado nos dados fornecidos.
          </p>
          <button className="auth-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </header>
      {isAuthenticated ? (
        <div id="simulator-section">
          <InvestmentSimulator />
        </div>
      ) : (
        <>
          <VideoHero />
          <FeaturesSection />
          <ArchitectureSection />
          <FAQSection />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Home;

