import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({ totalRaised: 0, totalDonations: 0, activeCampaigns: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('campaigns');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [campaignsRes, donationsRes] = await Promise.all([
        api.get('/campaigns?user=me'),
        api.get('/user/donations')
      ]);
      
      setCampaigns(campaignsRes.data.campaigns || []);
      setDonations(donationsRes.data.donations || []);
      
      const totalRaised = campaignsRes.data.campaigns.reduce((sum, c) => sum + parseFloat(c.amount_raised || 0), 0);
      const activeCampaigns = campaignsRes.data.campaigns.filter(c => c.status === 'active').length;
      
      setStats({
        totalRaised,
        totalDonations: donationsRes.data.donations.length,
        activeCampaigns
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-overlay"><div className="spinner"></div></div>;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="system-badge"><div className="status-dot"></div><span>USER TERMINAL</span></div>
            <h1>DASHBOARD <span className="cyber-text">{user?.name?.toUpperCase()}</span></h1>
            <p className="dashboard-subtitle">Command center for your protocols</p>
          </div>
          <Link to="/campaigns/create" className="btn btn-primary">
            INITIALIZE CAMPAIGN
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-panel">
            <div className="stat-icon">💰</div>
            <div className="stat-value">{formatCurrency(stats.totalRaised)}</div>
            <div className="stat-label">TOTAL RAISED</div>
          </div>
          <div className="stat-panel">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{stats.activeCampaigns}</div>
            <div className="stat-label">ACTIVE</div>
          </div>
          <div className="stat-panel">
            <div className="stat-icon">❤️</div>
            <div className="stat-value">{stats.totalDonations}</div>
            <div className="stat-label">DONATIONS</div>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button className={`tab ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => setActiveTab('campaigns')}>
            MY CAMPAIGNS
          </button>
          <button className={`tab ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>
            MY DONATIONS
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'campaigns' && (
            campaigns.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>NO CAMPAIGNS YET</h3>
                <p>Start your first protocol</p>
                <Link to="/campaigns/create" className="btn btn-primary">CREATE CAMPAIGN</Link>
              </div>
            ) : (
              <div className="campaigns-list">
                {campaigns.map(campaign => {
                  const percentage = formatPercentage(campaign.amount_raised, campaign.goal_amount);
                  return (
                    <div key={campaign.id} className="campaign-item">
                      <div className="campaign-item-header">
                        <div>
                          <h3>{campaign.title}</h3>
                          <span className={`badge badge-${campaign.status === 'active' ? 'success' : 'info'}`}>
                            {campaign.status?.toUpperCase()}
                          </span>
                        </div>
                        <div className="campaign-actions">
                          <Link to={`/campaigns/${campaign.slug}`} className="btn btn-secondary btn-sm">VIEW</Link>
                          <Link to={`/campaigns/${campaign.id}/edit`} className="btn btn-secondary btn-sm">EDIT</Link>
                        </div>
                      </div>
                      <div className="campaign-item-body">
                        <div className="campaign-stats-row">
                          <div className="campaign-stat">
                            <span className="stat-value">{formatCurrency(campaign.amount_raised)}</span>
                            <span className="stat-label">of {formatCurrency(campaign.goal_amount)}</span>
                          </div>
                          <div className="campaign-stat">
                            <span className="stat-value">{campaign.total_donations || 0}</span>
                            <span className="stat-label">Supporters</span>
                          </div>
                          <div className="campaign-stat">
                            <span className="stat-value">{percentage}%</span>
                            <span className="stat-label">Complete</span>
                          </div>
                        </div>
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="campaign-meta-info">
                          <span>Created: {formatDate(campaign.created_at)}</span>
                          <span>Views: {campaign.view_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {activeTab === 'donations' && (
            donations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">❤️</div>
                <h3>NO DONATIONS YET</h3>
                <Link to="/campaigns" className="btn btn-primary">BROWSE CAMPAIGNS</Link>
              </div>
            ) : (
              <div className="donations-list">
                {donations.map((d, i) => (
                  <div key={i} className="donation-item">
                    <div className="donation-info">
                      <div>
                        <h4>{d.campaign_title}</h4>
                        <span className="donation-date">{formatDate(d.created_at)}</span>
                      </div>
                      <div className="donation-amount">{formatCurrency(d.amount)}</div>
                    </div>
                    {d.message && <p className="donation-message">"{d.message}"</p>}
                    <Link to={`/campaigns/${d.campaign_slug}`} className="donation-link">VIEW CAMPAIGN →</Link>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
