import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './CreateCampaignPage.css';

const EditCampaignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_amount: '',
    end_date: '',
    category_id: '',
    image_url: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchCampaign();
    fetchCategories();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      const campaign = response.data.campaign;
      setFormData({
        title: campaign.title,
        description: campaign.description,
        goal_amount: campaign.goal_amount,
        end_date: campaign.end_date?.split('T')[0],
        category_id: campaign.category_id,
        image_url: campaign.image_url || ''
      });
    } catch (error) {
      console.error('Error:', error);
      navigate('/dashboard');
    } finally {
      setFetching(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.put(`/campaigns/${id}`, formData);
      navigate(`/campaigns/${response.data.campaign.slug}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update campaign');
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading-overlay"><div className="spinner"></div></div>;

  return (
    <div className="create-campaign-page">
      <div className="container-narrow">
        <div className="create-header">
          <div className="system-badge"><div className="status-dot"></div><span>CAMPAIGN UPDATE</span></div>
          <h1>EDIT <span className="cyber-text">PROTOCOL</span></h1>
        </div>

        <form onSubmit={handleSubmit} className="create-form">
          {error && (
            <div className="error-panel">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">TITLE</label>
            <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">CATEGORY</label>
            <select name="category_id" className="form-select" value={formData.category_id} onChange={handleChange} required>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">DESCRIPTION</label>
            <textarea name="description" className="form-textarea" value={formData.description} onChange={handleChange} rows="10" required></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GOAL (NOK)</label>
              <input type="number" name="goal_amount" className="form-input" value={formData.goal_amount} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">END DATE</label>
              <input type="date" name="end_date" className="form-input" value={formData.end_date} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">IMAGE URL</label>
            <input type="url" name="image_url" className="form-input" value={formData.image_url} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>CANCEL</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm"></div> UPDATING...</> : <>UPDATE CAMPAIGN</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCampaignPage;
