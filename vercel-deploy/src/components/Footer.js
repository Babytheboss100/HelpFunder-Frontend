import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" style={{fill: '#00FFE0'}}></path>
                </svg>
              </div>
              <span className="footer-logo-text">HELPFUNDER</span>
            </div>
            <p className="footer-description">
              Norges mest avanserte donasjonsplattform. Quantum-encrypted. AI-optimized. Blockchain-verified.
            </p>
          </div>
          
          <div>
            <h4>PLATTFORM</h4>
            <Link to="/campaigns">Alle Kampanjer</Link>
            <Link to="/campaigns/create">Start Kampanje</Link>
            <Link to="/about">Om Oss</Link>
          </div>
          
          <div>
            <h4>SUPPORT</h4>
            <Link to="/help">Hjelpesenter</Link>
            <Link to="/contact">Kontakt</Link>
            <Link to="/terms">Vilkår</Link>
            <Link to="/privacy">Personvern</Link>
          </div>
          
          <div>
            <h4>SYSTEM</h4>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 HELPFUNDER PROTOCOL v2.4.7 · ORG#123456789 · POWERED BY AI ⚡</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
