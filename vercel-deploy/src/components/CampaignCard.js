import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatTimeRemaining, calculatePercentage } from '../utils/formatters';
import './CampaignCard.css';

const CampaignCard = ({ campaign }) => {
  const percentage = calculatePercentage(campaign.raisedAmount || 0, campaign.goalAmount);
  const timeRemaining = campaign.endDate ? formatTimeRemaining(campaign.endDate) : null;

  return (
    <Link to={`/campaigns/${campaign.slug}`} className="campaign-panel">
      <div className="campaign-image">
        {campaign.imageUrl ? (
          <img src={campaign.imageUrl} alt={campaign.title} />
        ) : (
          <div className="campaign-placeholder" style={{
            background: `linear-gradient(135deg, #00D9FF 0%, #8B00FF 100%)`
          }}></div>
        )}
        
        {campaign.verified && (
          <div className="verified-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            VERIFIED
          </div>
        )}
        
        <div className="campaign-category-tag">
          {getCategoryIcon(campaign.category)} {campaign.category?.toUpperCase()}
        </div>
      </div>

      <div className="campaign-content">
        <h3 className="campaign-title">{campaign.title}</h3>
        <p className="campaign-description">{campaign.description}</p>

        <div className="progress-section">
          <div className="progress-stats">
            <span className="amount-raised">
              {formatCurrency(campaign.raisedAmount || 0)}
            </span>
            <span className="amount-goal">
              // {formatCurrency(campaign.goalAmount)} TARGET
            </span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-bar" 
              style={{ width: `${percentage}%` }}
              data-width={`${percentage}%`}
            ></div>
          </div>
        </div>

        <div className="campaign-meta">
          <div className="meta-item">
            <svg className="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            <span>{campaign.donationsCount || 0} SUPPORTERS</span>
          </div>
          {timeRemaining && (
            <div className="meta-item">
              <svg className="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{timeRemaining} REMAINING</span>
            </div>
          )}
        </div>

        {campaign.organizerName && (
          <div className="campaign-organizer">
            <div className="organizer-avatar">
              {campaign.organizerImage ? (
                <img src={campaign.organizerImage} alt={campaign.organizerName} />
              ) : (
                <span>{campaign.organizerName.charAt(0)}</span>
              )}
            </div>
            <span className="organizer-name">{campaign.organizerName}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

const getCategoryIcon = (category) => {
  const icons = {
    'Medisinsk': '🏥',
    'Medical': '🏥',
    'Utdanning': '📚',
    'Education': '📚',
    'Miljø': '🌍',
    'Environment': '🌍',
    'Krisesituasjoner': '🚨',
    'Emergency': '🚨',
    'Dyr og dyrevelferd': '🐾',
    'Animals': '🐾',
    'Sport og fritid': '⚽',
    'Sports': '⚽',
    'Kunst og kultur': '🎨',
    'Arts': '🎨',
    'Familie og barn': '👨‍👩‍👧',
    'Family': '👨‍👩‍👧'
  };
  return icons[category] || '🎯';
};

export default CampaignCard;
