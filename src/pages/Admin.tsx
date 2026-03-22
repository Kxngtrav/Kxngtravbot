import React, { useState } from 'react';
import './Admin.css';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[12:00:00] Bot started successfully',
    '[12:05:23] Trade placed: DIGITODD $0.35 - WIN +$0.32',
    '[12:08:15] Trade placed: DIGITEVEN $0.35 - LOSS -$0.35',
  ]);

  const handleLogin = () => {
    if (password === 'KxngAdmin2026') {
      setIsAuthorized(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <h1>👑 Admin Access</h1>
          <p>Enter password to access admin panel</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}>Access Admin Panel</button>
          <p className="admin-hint">Default password: KxngAdmin2026</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2>👑 KXNG ADMIN</h2>
        <nav>
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}>
            📜 Logs
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div>
            <h1>Bot Control Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Trades</h3>
                <div className="stat-value">1,247</div>
              </div>
              <div className="stat-card">
                <h3>Total Profit</h3>
                <div className="stat-value profit">$3,420.50</div>
              </div>
              <div className="stat-card">
                <h3>Win Rate</h3>
                <div className="stat-value">68.5%</div>
              </div>
              <div className="stat-card">
                <h3>Server Status</h3>
                <div className="stat-value online">ONLINE</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <h1>System Logs</h1>
            <div className="logs-container">
              {logs.map((log, index) => (
                <div key={index} className="log-entry">{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
