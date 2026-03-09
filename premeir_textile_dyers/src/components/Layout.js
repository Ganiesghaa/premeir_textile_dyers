import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, FlaskConical, Palette, ChevronLeft, Bell, User, Search, Calendar, History, BookOpen, LineChart, ShieldCheck, LogOut } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Settings, label: 'Machine Data', path: '/machine-data' },
    { icon: FlaskConical, label: 'Dyes & Chemicals', path: '/dyes-chemicals' },
    { icon: Palette, label: 'Color Inspection', path: '/color-inspection' },
    { icon: BookOpen, label: 'Color Recipes', path: '/color-recipes' },
    { icon: LineChart, label: 'Quality Reports', path: '/quality-reports' },
    { icon: ShieldCheck, label: 'Standards Tracking', path: '/standards-tracking' },
    { icon: Calendar, label: 'Production Schedule', path: '/production-schedule' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
    { icon: History, label: 'Batch History', path: '/batch-history' }
  ];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const results = menuItems.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  }, [searchQuery]);

  const handleLogout = () => {
    setShowProfileMenu(false);
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            {!logoLoadFailed ? (
              <img
                src="/ptd logo.png"
                alt="Premier Textile Dyers"
                className="brand-logo"
                onError={() => setLogoLoadFailed(true)}
              />
            ) : (
              <div className="logo-icon">PT</div>
            )}
            {!isSidebarCollapsed && (
              <div className="logo-text">
                <div className="company-name">PREMIER</div>
                <div className="company-subtitle">TEXTILE DYERS</div>
              </div>
            )}
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
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && searchResults.length > 0) {
                  navigate(searchResults[0].path);
                  setSearchQuery("");
                  setSearchResults([]);
                }
              }}
            />
            {searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.map(result => (
                  <div
                    key={result.path}
                    className="search-result-item"
                    onClick={() => {
                      navigate(result.path);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    {result.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="header-actions">
            <button className="icon-button" onClick={() => navigate('/alerts')}>
              <Bell size={20} />
              <span className="notification-badge">4</span>
            </button>
            <div className="profile-menu-container" ref={profileMenuRef}>
              <button
                className="icon-button user-button"
                onClick={() => setShowProfileMenu((prevValue) => !prevValue)}
                aria-label="Open profile menu"
              >
                <User size={20} />
              </button>
              {showProfileMenu && (
                <div className="profile-menu">
                  <button className="profile-menu-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
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
