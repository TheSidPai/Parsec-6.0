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
    <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600/50 transition-colors">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        {/* Left side - Payment info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-4">
            <span className="font-mono text-yellow-400 text-lg font-bold">#{payment._id?.slice(-8)}</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(payment.status)}
              <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(payment.status)}`}>
                {payment.status?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="text-gray-400 text-sm">Name:</span>
              <p className="text-white">{payment.name}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Email:</span>
              <p className="text-white">{payment.email}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Phone:</span>
              <p className="text-white">{payment.contactNumber || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Created:</span>
              <p className="text-white">{new Date(payment.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {payment.paymentUTR && (
            <div>
              <span className="text-gray-400 text-sm">Payment UTR:</span>
              <p className="text-white font-mono">{payment.paymentUTR}</p>
            </div>
          )}

          <div>
            <span className="text-gray-400 text-sm">Amount:</span>
            <p className="text-white font-bold">₹{payment.amount}</p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex flex-col gap-2 lg:min-w-[200px]">
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
    </div>
  );
}

// Payment Detail Modal Component
function PaymentDetailModal({ payment, onClose, onStatusUpdate }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2e2e2e] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h3 className="text-xl font-bold text-white">Payment #{payment._id?.slice(-8)}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Name</label>
              <div className="text-white">{payment.name}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <div className="text-white">{payment.email}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Phone</label>
              <div className="text-white">{payment.contactNumber}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Amount</label>
              <div className="text-white font-bold">₹{payment.amount}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">UTR</label>
              <div className="text-white font-mono">{payment.paymentUTR}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Status</label>
              <div className="text-white capitalize">{payment.status}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Created At</label>
              <div className="text-white">{new Date(payment.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Updated At</label>
              <div className="text-white">{new Date(payment.updatedAt).toLocaleString()}</div>
            </div>
          </div>

          {/* User Info */}
          {payment.userId && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">User Information</label>
              <div className="bg-gray-700 p-4 rounded space-y-2">
                <div>
                  <span className="text-gray-400 text-sm">User ID:</span>
                  <span className="text-white ml-2 font-mono">{payment.userId._id || payment.userId}</span>
                </div>
                {payment.userId.name && (
                  <div>
                    <span className="text-gray-400 text-sm">Name:</span>
                    <span className="text-white ml-2">{payment.userId.name}</span>
                  </div>
                )}
                {payment.userId.email && (
                  <div>
                    <span className="text-gray-400 text-sm">Email:</span>
                    <span className="text-white ml-2">{payment.userId.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Update Actions */}
          {payment.status?.toLowerCase() === 'pending' && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">Update Status</label>
              <div className="flex gap-2">
                <button
                  onClick={() => onStatusUpdate(payment._id, 'verified')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  Verify Payment
                </button>
                <button
                  onClick={() => onStatusUpdate(payment._id, 'rejected')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  Reject Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;
