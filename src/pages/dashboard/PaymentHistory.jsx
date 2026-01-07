import React, { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
import './PaymentHistory.css';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('jwt_token');

  const fetchPayments = useCallback(async () => {
    if (!token) {
      setError('Please log in to view payment history');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { response, data } = await authenticatedFetch(
        API_ENDPOINTS.PAYMENTS_MY,
        { method: 'GET' },
        token
      );

      if (response.ok && data?.data?.paymentHistory) {
        setPayments(data.data.paymentHistory);
      } else {
        setError('Failed to load payment history');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Unable to load payment history');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: '#ffc107', text: '#000', label: '⏳ Pending' },
      verified: { bg: '#28a745', text: '#fff', label: '✅ Verified' },
      rejected: { bg: '#dc3545', text: '#fff', label: '❌ Rejected' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  if (loading) {
    return (
      <div className="payment-history-container">
        <div className="payment-loader">
          <div className="magical-spinner"></div>
          <p>Loading Payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-history-container">
        <div className="payment-error">
          <h2>⚠️ {error}</h2>
          <button onClick={fetchPayments} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-history-container">
      <h1 className="payment-history-title">💳 Payment History</h1>
      <p className="payment-history-subtitle">
        Track your order payments and verification status
      </p>

      {payments.length === 0 ? (
        <div className="payment-empty">
          <div className="empty-icon">💳</div>
          <h2>No Payments Yet</h2>
          <p>Your payment history will appear here</p>
        </div>
      ) : (
        <div className="payment-list">
          {payments.map((payment) => {
            const statusInfo = getStatusBadge(payment.status);
            return (
              <div key={payment._id} className="payment-card">
                <div className="payment-card-header">
                  <div>
                    <h3>
                      {payment.referenceType === 'AccommodationBooking' 
                        ? 'Accommodation Booking' 
                        : `Order #${(payment.referenceId || payment._id).substring((payment.referenceId || payment._id).length - 8)}`
                      }
                    </h3>
                    <p className="payment-date">
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div 
                    className="payment-status-badge"
                    style={{ background: statusInfo.bg, color: statusInfo.text }}
                  >
                    {statusInfo.label}
                  </div>
                </div>

                <div className="payment-card-body">
                  <div className="payment-info-row">
                    <span>Amount:</span>
                    <strong>₹{payment.amount}</strong>
                  </div>
                  <div className="payment-info-row">
                    <span>Payment UTR:</span>
                    <code>{payment.paymentUTR}</code>
                  </div>
                  {payment.verifiedAt && (
                    <div className="payment-info-row">
                      <span>Verified On:</span>
                      <span>
                        {new Date(payment.verifiedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;
