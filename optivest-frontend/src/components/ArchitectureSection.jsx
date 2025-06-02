import React from "react";
import "./ArchitectureSection.css";
import StackOptivest from "../assets/StackOptivest.png";
import SecureOptivest from "../assets/SecureOptivest.png";

const ArchitectureSection = () => {
  return (
    <section className="architecture-section">
      <h2 className="architecture-title">
        <span className="highlight">Arquitetura da Optivest</span>
      </h2>
      <p className="architecture-subtitle">
        Entende a base tecnológica que suporta a tua<br />
        plataforma de simulação de investimentos.
      </p>

      <div className="architecture-grid">
        <div className="architecture-card">
          <h3>Infraestrutura Moderna</h3>
          <p>
            A Optivest foi construída com uma stack moderna e robusta, utilizando React no frontend para uma experiência fluida e interativa,
            e Django com Python no backend para garantir segurança, escalabilidade e performance. A estrutura API-first facilita a comunicação
            entre o frontend e o backend, e o sistema está preparado para crescer com o utilizador.
          </p>
          <img src={StackOptivest} alt="Infraestrutura" />
        </div>

        <div className="architecture-card">
          <h3>Segurança e Autenticação</h3>
          <p>
            A plataforma implementa autenticação JWT e proteção de rotas, assegurando que os dados do utilizador são sempre protegidos.
            O design modular permite a separação de responsabilidades entre o frontend e backend, seguindo boas práticas de segurança e
            mantendo os tokens de acesso de forma isolada e controlada.
          </p>
          <img src={SecureOptivest} alt="Segurança" />
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
