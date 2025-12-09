import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { formatCurrency, formatPercentage, formatDate, daysRemaining } from '../utils/formatters';
import DonationForm from '../components/DonationForm';
import './CampaignDetailPage.css';

const CampaignDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDonationForm, setShowDonationForm] = useState(false);

  useEffect(() => {
    fetchCampaign();
    fetchDonations();
    fetchUpdates();
  }, [slug]);

  const fetchCampaign = async () => {
    try {
      const response = await api.get(`/campaigns/${slug}`);
      setCampaign(response.data.campaign);
    } catch (error) {
      console.error('Error:', error);
      navigate('/campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await api.get(`/campaigns/${slug}/donations`);
      setDonations(response.data.donations || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const fetchUpdates = async () => {
    try {
      const response = await api.get(`/campaigns/${slug}/updates`);
      setUpdates(response.data.updates || []);
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!campaign) return null;

  const percentage = formatPercentage(campaign.amount_raised, campaign.goal_amount);
  const days = daysRemaining(campaign.end_date);
  const isOwner = user && user.id === campaign.user_id;

  return (
    <div className="campaign-detail-page">
      <div className="container">
        <div className="campaign-layout">
          <div className="campaign-main">
            {campaign.image_url && (
              <div className="campaign-hero-image">
                <img src={campaign.image_url} alt={campaign.title} />
                <div className="campaign-badges">
                  <span className="badge badge-success">VERIFIED</span>
                  <span className="tag">{campaign.category_name}</span>
                </div>
              </div>
            )}

            <div className="campaign-header">
              <h1>{campaign.title}</h1>
              <p className="campaign-organizer">
                By <Link to={`/user/${campaign.user_id}`}>{campaign.organizer_name}</Link>
              </p>
            </div>

            <div className="campaign-body">
              <h3>DESCRIPTION</h3>
              <p>{campaign.description}</p>
            </div>

            {updates.length > 0 && (
              <div className="updates-section">
                <h3>UPDATES ({updates.length})</h3>
                {updates.map(update => (
                  <div key={update.id} className="update-card">
                    <div className="update-header">
                      <span className="update-date">{formatDate(update.created_at)}</span>
                    </div>
                    <p>{update.content}</p>
                  </div>
                ))}
              </div>
            )}

            {donations.length > 0 && (
              <div className="donations-section">
                <h3>SUPPORTERS ({donations.length})</h3>
                {donations.map((donation, idx) => (
                  <div key={idx} className="donation-item">
                    <div className="donation-info">
                      <strong>{donation.anonymous ? 'Anonymous' : donation.donor_name}</strong>
                      <span className="donation-amount">{formatCurrency(donation.amount)}</span>
                    </div>
                    {donation.message && <p className="donation-message">{donation.message}</p>}
                    <span className="donation-date">{formatDate(donation.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="campaign-sidebar">
            <div className="sidebar-panel">
              <div className="progress-section">
                <div className="amount-raised-large">{formatCurrency(campaign.amount_raised)}</div>
                <div className="goal-text">of {formatCurrency(campaign.goal_amount)} target</div>
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>

              <div className="stats-row">
                <div className="stat">
                  <div className="stat-value">{campaign.total_donations || 0}</div>
                  <div className="stat-label">Supporters</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{days}</div>
                  <div className="stat-label">Days Left</div>
                </div>
              </div>

              {!isOwner && (
                <button className="btn btn-primary btn-block btn-lg" onClick={() => setShowDonationForm(true)}>
                  DONATE NOW
                </button>
              )}

              {isOwner && (
                <Link to={`/campaigns/${campaign.id}/edit`} className="btn btn-secondary btn-block">
                  EDIT CAMPAIGN
                </Link>
              )}
            </div>

            <div className="sidebar-panel">
              <h4>ORGANIZER</h4>
              <div className="organizer-info">
                <div className="avatar">{campaign.organizer_name?.charAt(0)}</div>
                <div>
                  <strong>{campaign.organizer_name}</strong>
                  <p className="text-muted text-small">Campaign Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDonationForm && (
        <DonationForm
          campaign={campaign}
          onClose={() => setShowDonationForm(false)}
          onSuccess={() => {
            setShowDonationForm(false);
            fetchCampaign();
            fetchDonations();
          }}
        />
      )}
    </div>
  );
};

export default CampaignDetailPage;
