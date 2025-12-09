import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" style={{fill: '#00FFE0'}}></path>
              </svg>
            </div>
            <span className="logo-text">HELPFUNDER</span>
          </Link>

          {/* Desktop Menu */}
          <div className="nav-menu desktop-menu">
            <Link 
              to="/campaigns" 
              className={`nav-link ${isActive('/campaigns') ? 'active' : ''}`}
            >
              CAMPAIGNS
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              SYSTEM
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  DASHBOARD
                </Link>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  PROFILE
                </Link>
                <button onClick={handleLogout} className="nav-link">
                  LOGOUT
                </button>
                <Link to="/create-campaign" className="btn btn-primary">
                  INIT CAMPAIGN
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                >
                  ACCESS
                </Link>
                <Link to="/register" className="btn btn-primary">
                  REGISTER
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link 
              to="/campaigns" 
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              CAMPAIGNS
            </Link>
            <Link 
              to="/about" 
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              SYSTEM
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  DASHBOARD
                </Link>
                <Link 
                  to="/profile" 
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  PROFILE
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="mobile-nav-link"
                >
                  LOGOUT
                </button>
                <Link 
                  to="/create-campaign" 
                  className="btn btn-primary mobile-cta"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  INIT CAMPAIGN
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ACCESS
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary mobile-cta"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  REGISTER
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
