import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
import Particles from '../../components/Particles';
import './PassCheckout.css';

function PassCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pass } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [paymentUTR, setPaymentUTR] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!pass) {
      navigate('/dashboard/passes');
    }
  }, [pass, navigate]);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    
    if (!paymentUTR.trim()) {
      setError('Please enter a valid UTR number');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Step 1: Create order
      const orderPayload = {
        items: [{
          merchId: pass._id,
          quantity: 1
        }]
      };

      const { response: orderResponse, data: orderData } = await authenticatedFetch(
        API_ENDPOINTS.ORDERS_CREATE,
        {
          method: 'POST',
          body: JSON.stringify(orderPayload)
        }
      );

      if (!orderResponse.ok || orderData.status !== 'success') {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const orderId = orderData.data.order._id;

      // Step 2: Record payment
      const paymentPayload = {
        orderId,
        amount: pass.price,
        paymentUTR: paymentUTR.trim()
      };

      const { response: paymentResponse, data: paymentData } = await authenticatedFetch(
        API_ENDPOINTS.PAYMENTS_SUBMIT,
        {
          method: 'POST',
          body: JSON.stringify(paymentPayload)
        }
      );

      if (!paymentResponse.ok || paymentData.status !== 'success') {
        throw new Error(paymentData.message || 'Failed to record payment');
      }

      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/dashboard/payment-history');
      }, 3000);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!pass) return null;

  if (success) {
    return (
      <div className="checkout-page">
        <Particles />
        <div className="checkout-success">
          <div className="success-icon">✓</div>
          <h2>Payment Submitted Successfully!</h2>
          <p>Your payment is under review. You will receive a confirmation email with your QR code once verified by our team.</p>
          <p>Check your payment status in Payment History.</p>
          <div className="success-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Particles />
      
      <div className="checkout-container">
        <button onClick={() => navigate('/dashboard/passes')} className="checkout-back">
          ← Back to Passes
        </button>

        <h1 className="checkout-title">Complete Your Purchase</h1>

        <div className="checkout-grid">
          {/* Order Summary */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="summary-pass">
              <div className="summary-pass-name">{pass.name}</div>
              <div className="summary-pass-desc">{pass.description}</div>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Pass Price</span>
                <span>₹{pass.price}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total Amount</span>
                <span>₹{pass.price}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="checkout-payment">
            <h3>Payment Details</h3>
            
            <div className="payment-instructions">
              <h4>📱 UPI Payment Steps:</h4>
              <ol>
                <li>Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                <li>Send <strong>₹{pass.price}</strong> to UPI ID: <code className="upi-id">parsec@iitdh</code></li>
                <li>Copy the UTR/Transaction ID from your payment app</li>
                <li>Enter the UTR number below and submit</li>
              </ol>
            </div>

            <form onSubmit={handleSubmitPayment} className="payment-form">
              {error && (
                <div className="payment-error">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label>Payment UTR Number *</label>
                <input
                  type="text"
                  value={paymentUTR}
                  onChange={(e) => setPaymentUTR(e.target.value)}
                  placeholder="Enter UTR/Transaction ID"
                  className="form-input"
                  required
                  disabled={loading}
                />
                <small>Example: 202601041234567890</small>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={loading || !paymentUTR.trim()}
              >
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Payment
                  </>
                )}
              </button>
            </form>

            <div className="payment-note">
              <strong>Note:</strong> After submission, your payment will be verified by our team. You will receive a confirmation email with your event pass QR code within 24-48 hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PassCheckout;
