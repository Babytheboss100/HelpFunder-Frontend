import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatCurrency, formatPercentage, daysRemaining } from '../utils/formatters';
import './HomePage.css';

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ totalRaised: 0, totalDonations: 0, activeCampaigns: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campaignsRes, statsRes] = await Promise.all([
        api.get('/campaigns?limit=3&featured=true'),
        api.get('/stats')
      ]);
      
      setCampaigns(campaignsRes.data.campaigns || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="system-badge">
              <div className="status-dot"></div>
              <span>SYSTEM ONLINE // {stats.activeCampaigns} ACTIVE PROTOCOLS</span>
            </div>
            
            <h1 className="hero-title">
              <span className="glitch" data-text="AI-POWERED">AI-POWERED</span><br/>
              <span className="cyber-text">CHARITY PROTOCOL</span>
            </h1>
            
            <p className="hero-subtitle">
              <span className="terminal-prompt">$</span> Blockchain-verified transparency · Quantum-encrypted donations<br/>
              Neural network optimized campaigns · Real-time impact tracking
            </p>
            
            <div className="hero-actions">
              <Link to="/create" className="btn btn-primary">
                INITIALIZE CAMPAIGN
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/campaigns" className="btn btn-secondary">EXPLORE DATABASE</Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-panel">
              <div className="stat-icon">⚡</div>
              <div className="stat-value">{(stats.totalRaised / 1000000).toFixed(1)}M</div>
              <div className="stat-label">TOTAL PROCESSED</div>
            </div>
            <div className="stat-panel">
              <div className="stat-icon">🔷</div>
              <div className="stat-value">{(stats.totalDonations / 1000).toFixed(1)}K</div>
              <div className="stat-label">TRANSACTIONS</div>
            </div>
            <div className="stat-panel">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{stats.activeCampaigns}</div>
              <div className="stat-label">ACTIVE NODES</div>
            </div>
            <div className="stat-panel">
              <div className="stat-icon">🛡️</div>
              <div className="stat-value">99.9%</div>
              <div className="stat-label">UPTIME</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">PROTOCOL</div>
            <h2>EXECUTION <span className="cyber-text">SEQUENCE</span></h2>
            <p className="section-subtitle">Automated, optimized, and verified at every stage</p>
          </div>

          <div className="process-grid">
            <div className="process-step">
              <div className="process-number">01</div>
              <h3>INITIALIZE</h3>
              <p>Deploy campaign protocol in under 300 seconds. AI analyzes and optimizes your narrative for maximum engagement.</p>
            </div>
            <div className="process-step">
              <div className="process-number">02</div>
              <h3>PROPAGATE</h3>
              <p>Automated multi-channel distribution. Neural network tracks engagement metrics in real-time across all platforms.</p>
            </div>
            <div className="process-step">
              <div className="process-number">03</div>
              <h3>EXECUTE</h3>
              <p>Instant transfer to designated account. Blockchain verification ensures 100% transparency and security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="campaigns-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">PRIORITY QUEUE</div>
            <h2>HIGH-IMPACT <span className="cyber-text">PROTOCOLS</span></h2>
            <p className="section-subtitle">AI-verified campaigns with maximum humanitarian impact</p>
          </div>

          <div className="campaigns-grid">
            {campaigns.map((campaign) => {
              const percentage = formatPercentage(campaign.amount_raised, campaign.goal_amount);
              const days = daysRemaining(campaign.end_date);
              
              return (
                <Link to={`/campaigns/${campaign.slug}`} key={campaign.id} className="campaign-panel">
                  <div className="campaign-image" style={{
                    background: `linear-gradient(135deg, #00D9FF 0%, #8B00FF 100%)`
                  }}>
                    {campaign.image_url && <img src={campaign.image_url} alt={campaign.title} />}
                    <div className="verified-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                      </svg>
                      VERIFIED
                    </div>
                    <div className="campaign-category-tag">{campaign.category_name}</div>
                  </div>
                  
                  <div className="campaign-content">
                    <h3 className="campaign-title">{campaign.title}</h3>
                    <p className="campaign-description">{campaign.description}</p>
                    
                    <div className="progress-section">
                      <div className="progress-stats">
                        <span className="amount-raised">{formatCurrency(campaign.amount_raised)}</span>
                        <span className="amount-goal">// {formatCurrency(campaign.goal_amount)} TARGET</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="campaign-meta">
                      <div className="meta-item">
                        <svg className="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        <span>{campaign.total_donations} SUPPORTERS</span>
                      </div>
                      <div className="meta-item">
                        <svg className="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{days}D REMAINING</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-4">
            <Link to="/campaigns" className="btn btn-secondary btn-lg">
              EXPLORE ALL PROTOCOLS
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-panel">
            <div className="cta-content">
              <h2 className="cta-title">
                READY TO <span className="cyber-text">DEPLOY</span>?
              </h2>
              <p className="cta-subtitle">
                Initialize your campaign protocol in under 5 minutes<br/>
                <span className="terminal-prompt">$</span> blockchain_verified | ai_optimized | quantum_encrypted
              </p>
              <Link to="/create" className="btn btn-primary btn-lg">
                EXECUTE CAMPAIGN PROTOCOL
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
