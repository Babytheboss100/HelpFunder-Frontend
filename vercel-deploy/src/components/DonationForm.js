import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { formatCurrency } from '../utils/formatters';
import './DonationForm.css';

const DonationForm = ({ campaign, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [formData, setFormData] = useState({
    amount: '',
    tipAmount: 0,
    donorName: '',
    donorEmail: '',
    message: '',
    anonymous: false
  });
  
  const [processing, setProcessing] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(0);

  const handleTipChange = (percentage) => {
    setTipPercentage(percentage);
    if (formData.amount) {
      const tip = (parseFloat(formData.amount) * percentage) / 100;
      setFormData({ ...formData, tipAmount: Math.round(tip) });
    }
  };

  const handleAmountChange = (e) => {
    const amount = e.target.value;
    setFormData({ 
      ...formData, 
      amount,
      tipAmount: tipPercentage > 0 ? Math.round((parseFloat(amount) * tipPercentage) / 100) : 0
    });
  };

  const calculateTotal = () => {
    return (parseFloat(formData.amount) || 0) + (parseFloat(formData.tipAmount) || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('STRIPE NOT LOADED');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) < 50) {
      toast.error('MINIMUM 50 NOK');
      return;
    }

    setProcessing(true);

    try {
      // Create donation and get client secret
      const response = await api.post('/donations', {
        campaignId: campaign.id,
        amount: parseFloat(formData.amount),
        tipAmount: parseFloat(formData.tipAmount) || 0,
        donorName: formData.donorName,
        donorEmail: formData.donorEmail,
        message: formData.message,
        anonymous: formData.anonymous
      });

      const { clientSecret, donationId } = response.data;

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.donorName,
            email: formData.donorEmail
          }
        }
      });

      if (error) {
        toast.error(`PAYMENT FAILED: ${error.message}`);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        toast.success('DONATION SUCCESSFUL!');
        if (onSuccess) {
          onSuccess(donationId);
        }
        
        // Reset form
        setFormData({
          amount: '',
          tipAmount: 0,
          donorName: '',
          donorEmail: '',
          message: '',
          anonymous: false
        });
        elements.getElement(CardElement).clear();
      }

    } catch (error) {
      console.error('Donation error:', error);
      toast.error(error.response?.data?.error || 'TRANSACTION FAILED');
    } finally {
      setProcessing(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#F0F0F0',
        fontFamily: '"Orbitron", sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#888888',
        },
        iconColor: '#00FFE0',
      },
      invalid: {
        color: '#FF003C',
        iconColor: '#FF003C',
      },
    },
  };

  return (
    <div className="donation-form-container">
      <div className="form-header">
        <h3 className="form-title">INIT DONATION</h3>
        <p className="form-subtitle">Support {campaign.title}</p>
      </div>

      <form onSubmit={handleSubmit} className="donation-form">
        {/* Amount */}
        <div className="form-group">
          <label className="form-label">AMOUNT (NOK)</label>
          <input
            type="number"
            min="50"
            step="10"
            value={formData.amount}
            onChange={handleAmountChange}
            className="form-input"
            placeholder="Enter amount..."
            required
          />
          <div className="quick-amounts">
            {[100, 250, 500, 1000].map(amount => (
              <button
                key={amount}
                type="button"
                className="quick-amount-btn"
                onClick={() => setFormData({ 
                  ...formData, 
                  amount: amount,
                  tipAmount: tipPercentage > 0 ? Math.round((amount * tipPercentage) / 100) : 0
                })}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="form-group">
          <label className="form-label">
            TIP HELPFUNDER (OPTIONAL)
          </label>
          <div className="tip-options">
            {[0, 10, 15, 20].map(percentage => (
              <button
                key={percentage}
                type="button"
                className={`tip-btn ${tipPercentage === percentage ? 'active' : ''}`}
                onClick={() => handleTipChange(percentage)}
              >
                {percentage}%
              </button>
            ))}
          </div>
          {formData.tipAmount > 0 && (
            <p className="tip-amount">
              Tip: {formatCurrency(formData.tipAmount)}
            </p>
          )}
        </div>

        {/* Personal Info */}
        <div className="form-group">
          <label className="form-label">NAME</label>
          <input
            type="text"
            value={formData.donorName}
            onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
            className="form-input"
            placeholder="Your name..."
            required={!formData.anonymous}
          />
        </div>

        <div className="form-group">
          <label className="form-label">EMAIL</label>
          <input
            type="email"
            value={formData.donorEmail}
            onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
            className="form-input"
            placeholder="your@email.com"
            required
          />
        </div>

        {/* Message */}
        <div className="form-group">
          <label className="form-label">MESSAGE (OPTIONAL)</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="form-textarea"
            placeholder="Leave a message of support..."
            rows="3"
          />
        </div>

        {/* Anonymous */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.anonymous}
              onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
              className="checkbox-input"
            />
            <span className="checkbox-text">DONATE ANONYMOUSLY</span>
          </label>
        </div>

        {/* Card Element */}
        <div className="form-group">
          <label className="form-label">PAYMENT DETAILS</label>
          <div className="card-element-wrapper">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        {/* Total */}
        {formData.amount && (
          <div className="total-section">
            <div className="total-row">
              <span>DONATION:</span>
              <span>{formatCurrency(parseFloat(formData.amount))}</span>
            </div>
            {formData.tipAmount > 0 && (
              <div className="total-row">
                <span>TIP:</span>
                <span>{formatCurrency(formData.tipAmount)}</span>
              </div>
            )}
            <div className="total-row total-final">
              <span>TOTAL:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={processing || !stripe}
        >
          {processing ? (
            <>
              <span className="spinner"></span>
              PROCESSING...
            </>
          ) : (
            <>
              EXECUTE DONATION
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </>
          )}
        </button>

        <p className="security-note">
          🛡️ SECURED BY STRIPE · ENCRYPTED TRANSACTION
        </p>
      </form>
    </div>
  );
};

export default DonationForm;
