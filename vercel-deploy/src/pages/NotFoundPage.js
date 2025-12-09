import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="glitch-wrapper">
            <div className="glitch" data-text="404">404</div>
          </div>
          <h2>PROTOCOL <span className="cyber-text">NOT FOUND</span></h2>
          <p>The requested resource does not exist in the system</p>
          <div className="error-actions">
            <Link to="/" className="btn btn-primary">
              RETURN TO BASE
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
            </Link>
            <Link to="/campaigns" className="btn btn-secondary">
              BROWSE CAMPAIGNS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
