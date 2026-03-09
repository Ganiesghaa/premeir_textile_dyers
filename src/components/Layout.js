import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, FlaskConical, Palette, ChevronLeft, Bell, User, Search, Calendar, History, LogOut, BookOpen, TrendingUp, Target } from 'lucide-react';
import './Layout.css';

const Layout = ({ children, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Settings, label: 'Machine Data', path: '/machine-data' },
    { icon: FlaskConical, label: 'Dyes & Chemicals', path: '/dyes-chemicals' },
    { icon: Palette, label: 'Color Inspection', path: '/color-inspection' },
    { icon: BookOpen, label: 'Color Recipes', path: '/color-recipes' },
    { icon: TrendingUp, label: 'Quality Reports', path: '/quality-reports' },
    { icon: Target, label: 'Standards Tracking', path: '/standards-tracking' },
    { icon: Calendar, label: 'Production Schedule', path: '/production-schedule' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
    { icon: History, label: 'Batch History', path: '/batch-history' }
  ];

  return (
    <div className="layout">
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/images/ptd logo.png" alt="PTD Logo" className="logo-image" />
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                title={item.label}
              >
                <Icon size={20} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <button 
          className="sidebar-toggle"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <ChevronLeft size={20} className={isSidebarCollapsed ? 'rotated' : ''} />
        </button>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="Search..." />
          </div>
          
          <div className="header-actions">
            <button className="icon-button" onClick={() => navigate('/alerts')}>
              <Bell size={20} />
              <span className="notification-badge">4</span>
            </button>
            <div className="user-menu-container" ref={userMenuRef}>
              <button 
                className="icon-button user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User size={20} />
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-avatar">
                      <User size={20} />
                    </div>
                    <div className="user-details">
                      <div className="user-name">Administrator</div>
                      <div className="user-role">System Admin</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
