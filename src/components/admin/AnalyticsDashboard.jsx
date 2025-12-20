import React, { useState, useEffect } from 'react';
import { RiUserLine, RiFileListLine, RiMoneyDollarCircleLine, RiDashboardLine } from '@remixicon/react';
import { API_ENDPOINTS, buildApiUrl } from '../../config/api';
import './AdminComponents.css';

function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalPayments: 0,
    verifiedPayments: 0,
    rejectedPayments: 0,
    pendingPayments: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPaymentStats();
  }, []);

  const fetchPaymentStats = async () => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(buildApiUrl(API_ENDPOINTS.ADMIN_PAYMENTS_STATS), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.status === 'success' && data.data) {
        setStats({
          totalPayments: data.data.totalPayments || 0,
          verifiedPayments: data.data.verifiedPayments || 0,
          rejectedPayments: data.data.rejectedPayments || 0,
          pendingPayments: data.data.pendingPayments || 0
        });
      } else {
        console.error('Failed to fetch stats:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch payment statistics:', error);
    } finally {
      setIsLoading(false);
    }
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
          <RiDashboardLine size={32} />
        </div>
        <h2 className="admin-section-main-title">Analytics Dashboard</h2>
        <p className="admin-section-subtitle">Payment statistics and overview</p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total Payments"
          value={stats.totalPayments}
          icon={RiFileListLine}
          color="blue"
        />
        <StatCard
          title="Verified Payments"
          value={stats.verifiedPayments}
          icon={RiMoneyDollarCircleLine}
          color="green"
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={RiUserLine}
          color="yellow"
        />
        <StatCard
          title="Rejected Payments"
          value={stats.rejectedPayments}
          icon={RiUserLine}
          color="red"
        />
      </div>

      {/* Additional Info */}
      <div className="admin-content-card">
        <h3 className="text-lg font-bold text-white mb-4">Payment Overview</h3>
        <div className="text-gray-300 space-y-2">
          <p>Total payments received: <span className="text-white font-bold">{stats.totalPayments}</span></p>
          <p>Verified payments: <span className="text-green-400 font-bold">{stats.verifiedPayments}</span></p>
          <p>Payments pending verification: <span className="text-yellow-400 font-bold">{stats.pendingPayments}</span></p>
          <p>Rejected payments: <span className="text-red-400 font-bold">{stats.rejectedPayments}</span></p>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color }) {
  const colorMap = {
    blue: { border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa' },
    green: { border: 'rgba(16, 185, 129, 0.3)', text: '#34d399' },
    yellow: { border: 'rgba(255, 193, 7, 0.3)', text: '#fbbf24' },
    red: { border: 'rgba(239, 68, 68, 0.3)', text: '#f87171' },
  };

  return (
    <div className="admin-stat-card" style={{borderTopColor: colorMap[color].border}}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="admin-stat-label">{title}</h3>
        <Icon size={28} style={{color: colorMap[color].text}} />
      </div>
      <div className="admin-stat-value">{value}</div>
    </div>
  );
}

export default AnalyticsDashboard;
