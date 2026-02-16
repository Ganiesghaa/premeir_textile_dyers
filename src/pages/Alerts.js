import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, AlertCircle, TrendingDown, Settings as SettingsIcon, X } from 'lucide-react';
import './Alerts.css';

const Alerts = () => {
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const alerts = [
    {
      id: 1,
      type: 'critical',
      category: 'inventory',
      title: 'Critical Stock Level',
      message: 'RED RR (Divine) is at 13% stock level (103 kg remaining)',
      time: '5 minutes ago',
      read: false,
      actionable: true
    },
    {
      id: 2,
      type: 'critical',
      category: 'inventory',
      title: 'Low Stock Alert',
      message: 'YELLOW ME49L (Divine) is running low - only 10% remaining',
      time: '15 minutes ago',
      read: false,
      actionable: true
    },
    {
      id: 3,
      type: 'warning',
      category: 'machine',
      title: 'Machine Efficiency Drop',
      message: 'Softflow 4 efficiency dropped to 85% - below threshold',
      time: '1 hour ago',
      read: false,
      actionable: true
    },
    {
      id: 4,
      type: 'critical',
      category: 'maintenance',
      title: 'Scheduled Maintenance',
      message: 'Softflow 8 is due for maintenance inspection',
      time: '2 hours ago',
      read: false,
      actionable: true
    },
    {
      id: 5,
      type: 'warning',
      category: 'quality',
      title: 'Quality Check Required',
      message: '2 color inspections pending review for over 24 hours',
      time: '3 hours ago',
      read: true,
      actionable: true
    },
    {
      id: 6,
      type: 'info',
      category: 'production',
      title: 'Production Target Achieved',
      message: 'Weekly production exceeded target by 12%',
      time: '5 hours ago',
      read: true,
      actionable: false
    },
    {
      id: 7,
      type: 'warning',
      category: 'inventory',
      title: 'Multiple Items Low',
      message: '4 dyes and chemicals below minimum stock levels',
      time: '6 hours ago',
      read: true,
      actionable: true
    },
    {
      id: 8,
      type: 'critical',
      category: 'quality',
      title: 'Color Rejection',
      message: 'Poseidon (Lot 109) rejected with Delta E of 2.1',
      time: '8 hours ago',
      read: true,
      actionable: true
    },
    {
      id: 9,
      type: 'info',
      category: 'machine',
      title: 'Batch Completed',
      message: 'Softflow 5 completed Olive batch (Lot 13414/5)',
      time: '10 hours ago',
      read: true,
      actionable: false
    },
    {
      id: 10,
      type: 'warning',
      category: 'production',
      title: 'Batch Delay',
      message: 'Scheduled batch for SF-03 delayed by 2 hours',
      time: '12 hours ago',
      read: true,
      actionable: false
    }
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.read;
    return alert.type === filter;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.type === 'critical').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical':
        return <AlertTriangle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
        return <CheckCircle size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getAlertClass = (type) => {
    switch(type) {
      case 'critical':
        return 'alert-critical';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      default:
        return '';
    }
  };

  const getCategoryBadge = (category) => {
    const badges = {
      inventory: { label: 'Inventory', color: '#8b5cf6' },
      machine: { label: 'Machine', color: '#3b82f6' },
      quality: { label: 'Quality', color: '#ec4899' },
      production: { label: 'Production', color: '#10b981' },
      maintenance: { label: 'Maintenance', color: '#f59e0b' }
    };
    return badges[category] || { label: category, color: '#6b7280' };
  };

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div>
          <h1>Alerts & Notifications</h1>
          <p className="page-subtitle">Monitor system alerts and critical notifications</p>
        </div>
        <button className="settings-button" onClick={() => setShowSettings(true)}>
          <SettingsIcon size={20} />
          Settings
        </button>
      </div>

      {/* Summary Stats */}
      <div className="alerts-summary">
        <div className="summary-card">
          <div className="summary-icon blue">
            <Bell size={24} />
          </div>
          <div className="summary-info">
            <p className="summary-label">Unread Alerts</p>
            <h3 className="summary-value">{unreadCount}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon red">
            <AlertTriangle size={24} />
          </div>
          <div className="summary-info">
            <p className="summary-label">Critical</p>
            <h3 className="summary-value">{criticalCount}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <AlertCircle size={24} />
          </div>
          <div className="summary-info">
            <p className="summary-label">Warnings</p>
            <h3 className="summary-value">{warningCount}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="summary-info">
            <p className="summary-label">Resolved Today</p>
            <h3 className="summary-value">12</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="alerts-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Alerts
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'critical' ? 'active' : ''}`}
          onClick={() => setFilter('critical')}
        >
          Critical
        </button>
        <button 
          className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
          onClick={() => setFilter('warning')}
        >
          Warnings
        </button>
        <button 
          className={`filter-btn ${filter === 'info' ? 'active' : ''}`}
          onClick={() => setFilter('info')}
        >
          Info
        </button>
      </div>

      {/* Alerts List */}
      <div className="alerts-container">
        {filteredAlerts.map((alert) => {
          const categoryBadge = getCategoryBadge(alert.category);
          return (
            <div key={alert.id} className={`alert-item ${getAlertClass(alert.type)} ${alert.read ? 'read' : 'unread'}`}>
              <div className="alert-icon">
                {getAlertIcon(alert.type)}
              </div>
              <div className="alert-content">
                <div className="alert-header">
                  <h4>{alert.title}</h4>
                  <span 
                    className="category-badge"
                    style={{ background: `${categoryBadge.color}15`, color: categoryBadge.color }}
                  >
                    {categoryBadge.label}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <div className="alert-footer">
                  <span className="alert-time">{alert.time}</span>
                  {alert.actionable && (
                    <button className="action-link">Take Action →</button>
                  )}
                </div>
              </div>
              {!alert.read && <div className="unread-indicator"></div>}
            </div>
          );
        })}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Notification Settings</h2>
              <button className="close-btn" onClick={() => setShowSettings(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="settings-section">
              <h3>Alert Categories</h3>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Inventory Alerts</span>
                    <p>Low stock and reorder notifications</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Machine Alerts</span>
                    <p>Machine status and efficiency warnings</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Quality Alerts</span>
                    <p>Color inspection and quality issues</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Production Alerts</span>
                    <p>Production targets and batch updates</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Maintenance Alerts</span>
                    <p>Scheduled maintenance reminders</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Email Notifications</span>
                    <p>Receive alerts via email</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Sound Alerts</span>
                    <p>Play sound for critical alerts</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
