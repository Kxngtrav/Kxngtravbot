import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  accountType?: 'demo' | 'real';
  platform?: 'deriv' | 'mt5';
  onSwitchAccount?: () => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ accountType = 'demo', platform = 'deriv', onSwitchAccount, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/strategies', label: 'Strategies', icon: '👑' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    { path: '/mt5', label: 'MT5', icon: '🤖' },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  const handleSwitchAccount = () => {
    if (onSwitchAccount) {
      onSwitchAccount();
    } else {
      // Default: reload to login page to switch account
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>KXNG<span>TRADER</span></h2>
        <div className={`account-badge ${accountType}`}>
          {accountType.toUpperCase()} {platform.toUpperCase()}
        </div>
      </div>

      <div className="nav-links">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="nav-actions">
        <button className="switch-account-btn" onClick={handleSwitchAccount}>
          🔄 Switch Account
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;