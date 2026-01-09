import React, { useState, useEffect } from 'react';
import { RiSearchLine, RiDownloadLine, RiEyeLine, RiCheckLine, RiCloseLine, RiTimeLine, RiFileListLine, RiQuestionLine } from '@remixicon/react';
import { API_ENDPOINTS, buildApiUrl } from '../../config/api';
import './AdminComponents.css';

function OrderManagement() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments, searchTerm, statusFilter]);

  const fetchPayments = async () => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(buildApiUrl(API_ENDPOINTS.ADMIN_PAYMENTS_GET), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success' && data.data?.paymentHistories) {
        setPayments(data.data.paymentHistories);
      } else {
        console.error('Failed to fetch payments:', data.message);
        setPayments([]);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment._id?.includes(searchTerm) ||
        payment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.contactNumber?.includes(searchTerm) ||
        payment.paymentUTR?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => 
        payment.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredPayments(filtered);
  };

  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const endpoint = newStatus === 'verified' 
        ? API_ENDPOINTS.ADMIN_PAYMENTS_VERIFY 
        : API_ENDPOINTS.ADMIN_PAYMENTS_REJECT;
      
      const response = await fetch(buildApiUrl(endpoint.replace(':id', paymentId)), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setIsModalOpen(false);
        alert(`Payment ${newStatus} successfully!`);
        
        // Refresh payments
        await fetchPayments();
      } else {
        alert(data.message || `Failed to ${newStatus} payment`);
      }
    } catch (error) {
      console.error('Failed to update payment status:', error);
      alert('Failed to update payment status');
    }
  };

  const exportToCSV = () => {
    const csvData = filteredPayments.map(payment => ({
      'Payment ID': payment._id,
      'Name': payment.name,
      'Email': payment.email,
      'Phone': payment.contactNumber,
      'Amount': payment.amount,
      'UTR': payment.paymentUTR,
      'Status': payment.status,
      'Created At': new Date(payment.createdAt).toLocaleString(),
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="admin-section-container">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section-container">
      <div className="admin-section-title-wrapper">
        <div className="admin-section-icon">
          <RiFileListLine size={32} />
        </div>
        <h2 className="admin-section-main-title">Payment Management</h2>
        <p className="admin-section-subtitle">Review and manage payment submissions</p>
      </div>

      <div className="admin-content-card">
        {/* Export Button */}
        <div style={{marginBottom: '2rem', textAlign: 'right'}}>
          <button
            onClick={exportToCSV}
            className="admin-btn admin-btn-success"
          >
            <RiDownloadLine size={18} />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <div className="admin-search">
            <RiSearchLine className="admin-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by Name, Email, Phone, or UTR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <div className="admin-filter-group">
            <label className="admin-filter-label">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Payments Cards */}
        <div className="space-y-4">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <PaymentCard 
                key={payment._id} 
                payment={payment} 
                onView={() => {
                  setSelectedPayment(payment);
                  setIsModalOpen(true);
                }}
                onStatusUpdate={updatePaymentStatus}
              />
            ))
          ) : (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">
                <RiFileListLine />
              </div>
              <p className="admin-empty-text">No payments found</p>
              <p className="admin-empty-subtext">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      {isModalOpen && selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => setIsModalOpen(false)}
          onStatusUpdate={updatePaymentStatus}
        />
      )}
    </div>
  );
}

// Payment Card Component
function PaymentCard({ payment, onView, onStatusUpdate }) {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return <RiCheckLine size={16} className="text-green-400" />;
      case 'pending':
        return <RiTimeLine size={16} className="text-yellow-400" />;
      case 'rejected':
        return <RiCloseLine size={16} className="text-red-400" />;
      default:
        return <RiQuestionLine size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return 'bg-green-900/30 border-green-500 text-green-300';
      case 'pending':
        return 'bg-yellow-900/30 border-yellow-500 text-yellow-300';
      case 'rejected':
        return 'bg-red-900/30 border-red-500 text-red-300';
      default:
        return 'bg-gray-900/30 border-gray-500 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600/50 transition-colors admin-payment-card">
      {/* Payment Header */}
      <div className="admin-payment-header">
        <span className="admin-payment-id">#{payment._id?.slice(-8)}</span>
        <div className="flex items-center gap-2">
          {getStatusIcon(payment.status)}
          <span className={`admin-payment-status-badge ${getStatusColor(payment.status)}`}>
            {payment.status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
      </div>

      {/* Payment Info Grid */}
      <div className="admin-payment-info-grid">
        <div className="admin-payment-info-item">
          <span className="admin-payment-info-label">Name</span>
          <span className="admin-payment-info-value">{payment.name}</span>
        </div>
        <div className="admin-payment-info-item">
          <span className="admin-payment-info-label">Email</span>
          <span className="admin-payment-info-value">{payment.email}</span>
        </div>
        <div className="admin-payment-info-item">
          <span className="admin-payment-info-label">Phone</span>
          <span className="admin-payment-info-value">{payment.contactNumber || 'N/A'}</span>
        </div>
        <div className="admin-payment-info-item">
          <span className="admin-payment-info-label">Created</span>
          <span className="admin-payment-info-value">{new Date(payment.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {payment.paymentUTR && (
        <div className="admin-payment-info-item" style={{ marginTop: '1rem' }}>
          <span className="admin-payment-info-label">Payment UTR</span>
          <span className="admin-payment-info-value" style={{ fontFamily: 'monospace' }}>{payment.paymentUTR}</span>
        </div>
      )}

      {payment.paymentScreenshot && (
        <div className="admin-payment-info-item" style={{ marginTop: '1rem' }}>
          <span className="admin-payment-info-label">Payment Screenshot</span>
          <div style={{ marginTop: '0.5rem' }}>
            <img 
              src={payment.paymentScreenshot} 
              alt="Payment Screenshot" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
                borderRadius: '8px',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                cursor: 'pointer'
              }}
              onClick={() => window.open(payment.paymentScreenshot, '_blank')}
              title="Click to view full size"
            />
            <small style={{ display: 'block', marginTop: '0.5rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Click to view full size
            </small>
          </div>
        </div>
      )}

      <div className="admin-payment-info-item" style={{ marginTop: '1rem' }}>
        <span className="admin-payment-info-label">Amount</span>
        <span className="admin-payment-amount">₹{payment.amount}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 lg:min-w-[200px]" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={onView}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          <RiEyeLine size={16} />
          View Details
        </button>
        
        {payment.status?.toLowerCase() === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => onStatusUpdate(payment._id, 'verified')}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
            >
              <RiCheckLine size={14} />
              Verify
            </button>
            <button
              onClick={() => onStatusUpdate(payment._id, 'rejected')}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
            >
              <RiCloseLine size={14} />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Payment Detail Modal Component
function PaymentDetailModal({ payment, onClose, onStatusUpdate }) {
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ maxWidth: '800px' }}>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Payment #{payment._id?.slice(-8)}</h3>
          <button
            onClick={onClose}
            className="admin-modal-close"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        <div className="admin-modal-body">
          {/* Payment Info */}
          <div className="admin-payment-detail-grid">
            <div className="admin-detail-item">
              <label className="admin-detail-label">Name</label>
              <div className="admin-detail-value">{payment.name}</div>
            </div>
            <div className="admin-detail-item">
              <label className="admin-detail-label">Email</label>
              <div className="admin-detail-value">{payment.email}</div>
            </div>
            <div className="admin-detail-item">
              <label className="admin-detail-label">Phone</label>
              <div className="admin-detail-value">{payment.contactNumber}</div>
            </div>
            <div className="admin-detail-item">
              <label className="admin-detail-label">Amount</label>
              <div className="admin-detail-value" style={{ fontWeight: 'bold', color: '#FFD700' }}>₹{payment.amount}</div>
            </div>
            <div className="admin-detail-item">
              <label className="admin-detail-label">UTR</label>
              <div className="admin-detail-value" style={{ fontFamily: 'monospace' }}>{payment.paymentUTR}</div>
            </div>
            <div className="admin-detail-item">
              <label className="admin-detail-label">Status</label>
              <div className="admin-detail-value" style={{ textTransform: 'capitalize' }}>{payment.status}</div>
            </div>
            <div className="admin-detail-item">
              <label className="admin-detail-label">Created At</label>
              <div className="admin-detail-value">{new Date(payment.createdAt).toLocaleString()}</div>
            </div>
            <div className="admin-detail-item">
              <label className="admin-detail-label">Updated At</label>
              <div className="admin-detail-value">{new Date(payment.updatedAt).toLocaleString()}</div>
            </div>
            
            {payment.paymentScreenshot && (
              <div className="admin-detail-item" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-detail-label">Payment Screenshot</label>
                <div style={{ marginTop: '0.75rem' }}>
                  <img 
                    src={payment.paymentScreenshot} 
                    alt="Payment Screenshot" 
                    className="admin-payment-screenshot"
                    onClick={() => window.open(payment.paymentScreenshot, '_blank')}
                  />
                  <small style={{ display: 'block', marginTop: '0.5rem', color: '#999', fontSize: '0.875rem' }}>Click to view full size</small>
                </div>
              </div>
            )}
          </div>

          {/* User Info */}
          {payment.userId && (
            <div style={{ marginTop: '1.5rem' }}>
              <label className="admin-detail-label">User Information</label>
              <div className="admin-user-info-box">
                <div className="admin-user-info-row">
                  <span className="admin-user-info-label">User ID:</span>
                  <span className="admin-user-info-value">{payment.userId._id || payment.userId}</span>
                </div>
                {payment.userId.name && (
                  <div className="admin-user-info-row">
                    <span className="admin-user-info-label">Name:</span>
                    <span className="admin-user-info-value">{payment.userId.name}</span>
                  </div>
                )}
                {payment.userId.email && (
                  <div className="admin-user-info-row">
                    <span className="admin-user-info-label">Email:</span>
                    <span className="admin-user-info-value">{payment.userId.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Update Actions */}
        {payment.status?.toLowerCase() === 'pending' && (
          <div className="admin-modal-footer">
            <button
              onClick={() => onStatusUpdate(payment._id, 'rejected')}
              className="admin-btn admin-btn-danger"
            >
              <RiCloseLine size={16} />
              Reject Payment
            </button>
            <button
              onClick={() => onStatusUpdate(payment._id, 'verified')}
              className="admin-btn admin-btn-success"
            >
              <RiCheckLine size={16} />
              Verify Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;
