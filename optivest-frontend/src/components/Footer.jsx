import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { MdHome, MdHistory, MdPerson } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-divider" />
      <div className="footer-bottom-content">
        <div className="footer-left">
          <img src={require("../assets/LogoOptivestfooter.png")} alt="Optivest Logo" className="footer-logo" />
          <p className="footer-text">2025 Optivest. Todos os direitos reservados.</p>
        </div>
        <div className="footer-right">
          <Link to="/" title="Home" onClick={() => window.scrollTo(0, 0)}><MdHome size={24} /></Link>
          <Link to="/simulations" title="Simulações"><MdHistory size={24} /></Link>
          <Link to="/profile" title="Perfil"><MdPerson size={24} /></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



