import React, { useState } from 'react';
import './FeaturesSection.css';
import portfolioImg from '../assets/Portfolio.png';
import marketImg from '../assets/market.png';
import simulationsImg from '../assets/simulacoes.png';

const features = [
  {
    title: 'Gestão de Portefólio',
    subtitle: 'Acompanha os teus ativos com precisão.',
    image: portfolioImg,
  },
  {
    title: 'Dados de Mercado em Tempo Real',
    subtitle: 'Acede a cotações e estatísticas atualizadas.',
    image: marketImg,
  },
  {
    title: 'Histórico de Simulações',
    subtitle: 'Analisa os resultados das tuas estratégias passadas.',
    image: simulationsImg,
  },
];

const FeaturesSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="features-section">
      <div className="features-header">
        <h2 className="features-title">
          Funcionalidades Avançadas para<br />
          <span className="highlight">Otimizar o Teu Investimento</span>
        </h2>
        <p className="features-subtitle">
          Tudo o que precisas para gerir, acompanhar e evoluir a tua estratégia de investimento.
        </p>
      </div>

      <div className="features-tabs-inline">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`tab-title ${active === index ? 'active' : ''}`}
            onClick={() => setActive(index)}
          >
            <div className="tab-line" />
            <h3>{feature.title}</h3>
            <p>{feature.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="features-carousel">
        <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {features.map((feature, index) => (
            <div className="carousel-slide" key={index}>
              <img src={feature.image} alt={feature.title} className="feature-image" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

