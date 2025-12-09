import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './CreateCampaignPage.css';

const CreateCampaignPage = () => {
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
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.title || formData.title.length < 10) {
        setError('Title must be at least 10 characters');
        return false;
      }
      if (!formData.category_id) {
        setError('Please select a category');
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.description || formData.description.length < 50) {
        setError('Description must be at least 50 characters');
        return false;
      }
      if (!formData.goal_amount || parseFloat(formData.goal_amount) < 1000) {
        setError('Goal amount must be at least 1000 NOK');
        return false;
      }
      if (!formData.end_date) {
        setError('Please select an end date');
        return false;
      }
      
      const endDate = new Date(formData.end_date);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7);
      
      if (endDate < minDate) {
        setError('Campaign must run for at least 7 days');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/campaigns', formData);
      navigate(`/campaigns/${response.data.campaign.slug}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create campaign');
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="create-campaign-page">
      <div className="container-narrow">
        <div className="create-header">
          <div className="system-badge"><div className="status-dot"></div><span>CAMPAIGN INITIALIZATION</span></div>
          <h1>CREATE <span className="cyber-text">PROTOCOL</span></h1>
          <p className="create-subtitle">Deploy your humanitarian mission in 3 steps</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">01</div>
            <span>BASICS</span>
          </div>
          <div className="step-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">02</div>
            <span>DETAILS</span>
          </div>
          <div className="step-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">03</div>
            <span>REVIEW</span>
          </div>
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

          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="form-step">
              <h2>STEP 01: BASICS</h2>
              
              <div className="form-group">
                <label className="form-label">CAMPAIGN TITLE</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="E.g. Help Build School in Uganda"
                  maxLength="200"
                  required
                />
                <span className="form-hint">{formData.title.length}/200 characters</span>
              </div>

              <div className="form-group">
                <label className="form-label">CATEGORY</label>
                <select
                  name="category_id"
                  className="form-select"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">SELECT CATEGORY</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-primary btn-lg" onClick={handleNext}>
                  NEXT STEP
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="form-step">
              <h2>STEP 02: DETAILS</h2>
              
              <div className="form-group">
                <label className="form-label">DESCRIPTION</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell your story. Why does this matter? What will the funds be used for?"
                  rows="10"
                  required
                ></textarea>
                <span className="form-hint">{formData.description.length} characters (min. 50)</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">GOAL AMOUNT (NOK)</label>
                  <input
                    type="number"
                    name="goal_amount"
                    className="form-input"
                    value={formData.goal_amount}
                    onChange={handleChange}
                    placeholder="100000"
                    min="1000"
                    step="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">END DATE</label>
                  <input
                    type="date"
                    name="end_date"
                    className="form-input"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={getMinDate()}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">IMAGE URL (OPTIONAL)</label>
                <input
                  type="url"
                  name="image_url"
                  className="form-input"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                <span className="form-hint">Add a compelling image for your campaign</span>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                  ‹ BACK
                </button>
                <button type="button" className="btn btn-primary btn-lg" onClick={handleNext}>
                  NEXT STEP
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="form-step">
              <h2>STEP 03: REVIEW</h2>
              
              <div className="review-panel">
                <h3>CAMPAIGN PREVIEW</h3>
                
                <div className="review-item">
                  <span className="review-label">TITLE:</span>
                  <span>{formData.title}</span>
                </div>
                
                <div className="review-item">
                  <span className="review-label">CATEGORY:</span>
                  <span>{categories.find(c => c.id === parseInt(formData.category_id))?.name}</span>
                </div>
                
                <div className="review-item">
                  <span className="review-label">GOAL:</span>
                  <span>{parseFloat(formData.goal_amount).toLocaleString('no-NO')} NOK</span>
                </div>
                
                <div className="review-item">
                  <span className="review-label">END DATE:</span>
                  <span>{new Date(formData.end_date).toLocaleDateString('no-NO')}</span>
                </div>
                
                <div className="review-item">
                  <span className="review-label">DESCRIPTION:</span>
                  <p>{formData.description}</p>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                  ‹ BACK
                </button>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? (
                    <><div className="spinner spinner-sm"></div> DEPLOYING...</>
                  ) : (
                    <>DEPLOY CAMPAIGN</>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
