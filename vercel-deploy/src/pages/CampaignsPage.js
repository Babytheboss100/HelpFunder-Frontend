import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { formatCurrency, formatPercentage, daysRemaining } from '../utils/formatters';
import './CampaignsPage.css';

const CampaignsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'recent'
  });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 9,
        search: filters.search,
        category: filters.category,
        sort: filters.sort
      };

      const response = await api.get('/campaigns', { params });
      setCampaigns(response.data.campaigns || []);
      setPagination({
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1
      });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="campaigns-page">
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <div className="header-content">
            <div className="section-tag">DATABASE</div>
            <h1>ACTIVE <span className="cyber-text">PROTOCOLS</span></h1>
            <p className="header-subtitle">
              Browse {campaigns.length} verified humanitarian missions
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-panel">
            {/* Search */}
            <div className="filter-group">
              <label className="filter-label">SEARCH</label>
              <div className="search-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search campaigns..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">CATEGORY</label>
              <select
                className="filter-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">ALL CATEGORIES</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label className="filter-label">SORT BY</label>
              <select
                className="filter-select"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="recent">MOST RECENT</option>
                <option value="popular">MOST POPULAR</option>
                <option value="funded">MOST FUNDED</option>
                <option value="ending">ENDING SOON</option>
              </select>
            </div>

            {/* Reset */}
            {(filters.search || filters.category || filters.sort !== 'recent') && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setFilters({ search: '', category: '', sort: 'recent' });
                  setSearchParams({});
                }}
              >
                RESET FILTERS
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="campaigns-section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>LOADING PROTOCOLS...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>NO PROTOCOLS FOUND</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
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
                            <span>{campaign.total_donations || 0} SUPPORTERS</span>
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    ‹ PREV
                  </button>
                  
                  <div className="page-numbers">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`page-number ${page === pagination.page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    NEXT ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CampaignsPage;
