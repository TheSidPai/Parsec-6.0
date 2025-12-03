import React, { useState, useEffect } from 'react';
import { RiDashboardLine, RiUserLine, RiFileListLine, RiLogoutBoxLine, RiRefreshLine, RiTicketLine, RiShoppingCartLine } from '@remixicon/react';
import { RiQrScanLine } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import PassManagement from './PassManagement';
import AdminPurchase from './AdminPurchase';
import AttendancePanel from './AttendancePanel';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders'); // Default to orders tab
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const token = sessionStorage.getItem('admin_token');
    
    if (!token) {
      console.log('🚫 AdminDashboard: No token found, redirecting to login');
      navigate('/admin/login');
      return;
    }

    console.log('✅ AdminDashboard: Token found, user is authenticated');
    // Set admin data (you can fetch this from API if needed)
    setAdminData({
      name: 'Admin',
      lastLogin: new Date().toLocaleString()
    });
  }, [navigate]);

  const handleLogout = () => {
    console.log('🚪 Logging out admin...');
    sessionStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const tabItems = [
    { id: 'dashboard', label: 'Dashboard', icon: RiDashboardLine },
    { id: 'orders', label: 'Orders', icon: RiFileListLine },
    { id: 'users', label: 'Users', icon: RiUserLine },
    { id: 'passes', label: 'Pass Management', icon: RiTicketLine },
    { id: 'purchase', label: 'Purchase Passes', icon: RiShoppingCartLine },
  { id: 'attendance', label: 'Attendance Panel', icon: RiQrScanLine },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AnalyticsDashboard />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      case 'passes':
        return <PassManagement />;
      case 'purchase':
        return <AdminPurchase />;
      case 'attendance':
        return <AttendancePanel />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  if (!adminData) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-dashboard-header">
        <div>
          <h1 className="admin-dashboard-title">
            🎯 Parsec'25 Admin
          </h1>
          <div className="text-sm text-gray-400" style={{marginTop: '0.25rem'}}>
            Welcome back, {adminData.name}
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="admin-logout-btn"
        >
          <RiLogoutBoxLine size={16} />
          Logout
        </button>
      </header>

      {/* Tabs */}
      <nav className="admin-tabs">
        {tabItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`admin-tab ${activeTab === item.id ? 'active' : ''}`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <div className="admin-tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
