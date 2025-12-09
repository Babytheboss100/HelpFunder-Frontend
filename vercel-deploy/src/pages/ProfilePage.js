import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.put('/auth/profile', formData);
      updateUser(response.data.user);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container-narrow">
        <div className="profile-header">
          <div className="system-badge"><div className="status-dot"></div><span>USER SETTINGS</span></div>
          <h1>PROFILE <span className="cyber-text">CONFIGURATION</span></h1>
        </div>

        {(message || error) && (
          <div className={`alert ${error ? 'error-panel' : 'success-panel'}`}>
            <span>{error || message}</span>
          </div>
        )}

        <div className="profile-sections">
          <div className="profile-section">
            <h2>ACCOUNT INFO</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label className="form-label">NAME</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">EMAIL</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'UPDATING...' : 'UPDATE PROFILE'}
              </button>
            </form>
          </div>

          <div className="profile-section">
            <h2>CHANGE PASSWORD</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="form-label">CURRENT PASSWORD</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">NEW PASSWORD</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">CONFIRM NEW PASSWORD</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'UPDATING...' : 'CHANGE PASSWORD'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
