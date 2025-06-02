import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { MdPieChart, MdShowChart, MdHistory, MdStar } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";


const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("access");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };


  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">
          <img src={require('../assets/LogoOptivest.png')} alt="Optivest Logo" className="nav-logo" />
        </Link>
      </div> 
      <ul className="nav-center">
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/portfolio" title="Portfolio">
                <MdPieChart size={24} />
              </Link>
            </li>
            <li>
              <Link to="/market" title="Mercado">
                <MdShowChart size={24} />
              </Link>
            </li>
            <li>
              <Link to="/simulations" title="Simulações">
                <MdHistory size={24} />
              </Link>
            </li>
            <li>
              <Link to="/watchlist" title="Favoritos">
                <MdStar size={24} />
              </Link>
            </li> 
          </>
        ) : (
          <li>
            <Link to="/market" title="Mercado">
              <MdShowChart size={24} />
            </Link>
          </li>
        )}
      </ul>

      <div className="nav-right-wrapper">
        {isAuthenticated && (
          <div className="profile-wrapper">
            <button className="profile-icon" onClick={() => setShowDropdown(!showDropdown)}>
              <FaUserCircle size={28} />
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => navigate('/profile')} className="dropdown-item">
                  Ver Perfil
                </button>
              </div>
            )}
          </div>
        )}

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/register" className="nav-button">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="nav-button logout">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
