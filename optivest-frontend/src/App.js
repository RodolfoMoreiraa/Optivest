import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Simulations from './pages/Simulations.jsx';
import Market from './pages/Market';
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Portfolio from './pages/Portfolio';
import Profile from "./pages/Profile";
import Watchlist from './pages/Watchlist.jsx';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav style={{ marginBottom: '20px' }}>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />  
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          {/* Rotas protegidas */}
          <Route path="/simulations" element={
            <PrivateRoute>
              <Simulations />
            </PrivateRoute>
          } />
        </Routes>
      </div>
      <div className="bg-gray-900 text-white p-10 text-center">
      </div>
    </Router>
  );
}

export default App;

