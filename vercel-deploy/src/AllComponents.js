// ==============================================
// CONTEXTS
// ==============================================

// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ==============================================
// API CLIENT
// ==============================================

// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ==============================================
// COMPONENTS
// ==============================================

// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, User, LogOut, Plus } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <Heart size={28} />
            <span>HelpFunder</span>
          </Link>

          <div className="navbar-menu">
            <Link to="/campaigns" className="navbar-link">Kampanjer</Link>
            
            {user ? (
              <>
                <Link to="/create-campaign" className="btn btn-primary btn-sm">
                  <Plus size={18} />
                  Start kampanje
                </Link>
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="navbar-link">
                  <LogOut size={18} />
                  Logg ut
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">Logg inn</Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Kom i gang
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Heart size={24} />
              <span>HelpFunder</span>
            </div>
            <p>Norges ledende plattform for donasjoner og innsamlinger</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Plattform</h4>
              <Link to="/campaigns">Alle kampanjer</Link>
              <Link to="/create-campaign">Start kampanje</Link>
            </div>

            <div className="footer-column">
              <h4>Om oss</h4>
              <Link to="/about">Om HelpFunder</Link>
              <Link to="/privacy">Personvern</Link>
              <Link to="/terms">Vilkår</Link>
            </div>

            <div className="footer-column">
              <h4>Hjelp</h4>
              <Link to="/faq">FAQ</Link>
              <Link to="/contact">Kontakt oss</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HelpFunder AS. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

// src/components/CampaignCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import './CampaignCard.css';

const CampaignCard = ({ campaign }) => {
  const percentage = Math.min(100, campaign.percentageRaised || 0);

  return (
    <Link to={`/campaigns/${campaign.slug}`} className="campaign-card">
      <div className="campaign-image">
        <img 
          src={campaign.imageUrl || '/placeholder-campaign.jpg'} 
          alt={campaign.title}
        />
        <span className="campaign-category">{campaign.category}</span>
      </div>

      <div className="campaign-content">
        <h3>{campaign.title}</h3>
        <p className="campaign-description">{campaign.description}</p>

        <div className="campaign-progress">
          <div className="progress-stats">
            <span className="amount-raised">
              {campaign.raisedAmount?.toLocaleString('nb-NO')} NOK
            </span>
            <span className="amount-goal">
              av {campaign.goalAmount?.toLocaleString('nb-NO')} NOK
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        <div className="campaign-meta">
          <div className="meta-item">
            <Users size={16} />
            <span>{campaign.donationsCount || 0} donorer</span>
          </div>
          {campaign.createdAt && (
            <div className="meta-item">
              <Calendar size={16} />
              <span>{formatDistanceToNow(new Date(campaign.createdAt), { 
                addSuffix: true, 
                locale: nb 
              })}</span>
            </div>
          )}
        </div>

        <div className="campaign-organizer">
          <div className="avatar avatar-sm">
            {campaign.organizerName?.charAt(0) || 'A'}
          </div>
          <span>{campaign.organizerName}</span>
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;

export { AuthContext, AuthProvider, Navbar, Footer, ProtectedRoute, CampaignCard };
