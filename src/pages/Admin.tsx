import React, { useState, useEffect } from 'react';
import './Admin.css';

interface AdminStats {
  totalTrades: number;
  totalProfit: number;
  winRate: number;
  activeUsers: number;
  botUptime: string;
  serverStatus: 'online' | 'offline';
  lastError: string | null;
}

interface StrategyConfig {
  id: string;
  name: string;
  enabled: boolean;
  maxStake: number;
  minStake: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface User {
  id: string;
  username: string;
  email: string;
  accountType: 'demo' | 'real';
  totalTrades: number;
  totalProfit: number;
  lastActive: Date;
  isActive: boolean;
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'strategies' | 'settings' | 'logs'>('dashboard');
  const [stats, setStats] = useState<AdminStats>({
    totalTrades: 1247,
    totalProfit: 3420.50,
    winRate: 68.5,
    activeUsers: 1,
    botUptime: '3d 12h 45m',
    serverStatus: 'online',
    lastError: null
  });
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'Kxngtrav',
      email: 'baileytravice@gmail.com',
      accountType: 'demo',
      totalTrades: 1247,
      totalProfit: 3420.50,
      lastActive: new Date(),
      isActive: true
    }
  ]);
  const [strategies, setStrategies] = useState<StrategyConfig[]>([
    { id: 'kxng-1', name: 'KXNG 1: The Prophet', enabled: true, maxStake: 100, minStake: 0.35, riskLevel: 'medium' },
    { id: 'kxng-2', name: 'KXNG 2: The Ghost', enabled: true, maxStake: 100, minStake: 0.35, riskLevel: 'medium' },
    { id: 'kxng-3', name: 'KXNG 3: The Viper', enabled: true, maxStake: 50, minStake: 0.35, riskLevel: 'high' },
    { id: 'kxng-4', name: 'KXNG 4: The Oracle', enabled: true, maxStake: 100, minStake: 0.35, riskLevel: 'medium' },
    { id: 'kxng-5', name: 'KXNG 5: The Phantom', enabled: true, maxStake: 50, minStake: 0.35, riskLevel: 'low' },
    { id: 'kxng-6', name: 'KXNG 6: The Shadow', enabled: true, maxStake: 100, minStake: 0.35, riskLevel: 'medium' },
    { id: 'kxng-7', name: 'KXNG 7: The Emperor', enabled: true, maxStake: 200, minStake: 0.35, riskLevel: 'medium' },
    { id: 'kxng-8', name: 'KXNG 8: The Mercenary', enabled: true, maxStake: 50, minStake: 0.35, riskLevel: 'high' },
    { id: 'kxng-9', name: 'KXNG 9: The Warlord', enabled: true, maxStake: 100, minStake: 0.35, riskLevel: 'high' },
    { id: 'kxng-10', name: 'KXNG 10: The Legend', enabled: true, maxStake: 200, minStake: 0.35, riskLevel: 'medium' }
  ]);
  const [logs, setLogs] = useState<string[]>([
    '[12:00:00] Bot started successfully',
    '[12:05:23] Trade placed: DIGITODD $0.35 - WIN +$0.32',
    '[12:08:15] Trade placed: DIGITEVEN $0.35 - LOSS -$0.35',
    '[12:11:42] Trade placed: DIGITODD $0.55 - WIN +$0.50',
    '[12:15:30] User Kxngtrav connected',
    '[12:20:45] Strategy changed: KXNG 10: The Legend'
  ]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleAdminLogin = () => {
    if (password === 'KxngAdmin2026') {
      setIsAuthorized(true);
      setShowPasswordModal(false);
    } else {
      alert('Incorrect password');
    }
  };

  const toggleStrategy = (id: string) => {
    setStrategies(prev => prev.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
    addLog(`Strategy ${id} ${strategies.find(s => s.id === id)?.enabled ? 'disabled' : 'enabled'}`);
  };

  const updateStrategyConfig = (id: string, field: keyof StrategyConfig, value: any) => {
    setStrategies(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
    addLog(`Updated ${field} for ${id} to ${value}`);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 99)]);
  };

  const resetBot = () => {
    if (confirm('⚠️ WARNING: This will reset ALL bot data. Continue?')) {
      addLog('🚨 BOT RESET by admin');
      alert('Bot reset initiated');
    }
  };

  const clearAllTrades = () => {
    if (confirm('⚠️ WARNING: This will clear ALL trade history. Continue?')) {
      addLog('🗑️ All trades cleared by admin');
      alert('Trade history cleared');
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
            onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
          />
          <button onClick={handleAdminLogin}>Access Admin Panel</button>
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
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            👥 Users
          </button>
          <button className={activeTab === 'strategies' ? 'active' : ''} onClick={() => setActiveTab('strategies')}>
            🎯 Strategies
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            ⚙️ Settings
          </button>
          <button className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}>
            📜 Logs
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="admin-dashboard">
            <h1>Bot Control Dashboard</h1>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Trades</h3>
                <div className="stat-value">{stats.totalTrades}</div>
              </div>
              <div className="stat-card">
                <h3>Total Profit</h3>
                <div className="stat-value profit">${stats.totalProfit.toFixed(2)}</div>
              </div>
              <div className="stat-card">
                <h3>Win Rate</h3>
                <div className="stat-value">{stats.winRate}%</div>
              </div>
              <div className="stat-card">
                <h3>Active Users</h3>
                <div className="stat-value">{stats.activeUsers}</div>
              </div>
              <div className="stat-card">
                <h3>Bot Uptime</h3>
                <div className="stat-value">{stats.botUptime}</div>
              </div>
              <div className="stat-card">
                <h3>Server Status</h3>
                <div className={`stat-value ${stats.serverStatus}`}>{stats.serverStatus.toUpperCase()}</div>
              </div>
            </div>

            <div className="admin-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button className="danger" onClick={resetBot}>🔄 Reset Bot</button>
                <button className="warning" onClick={clearAllTrades}>🗑️ Clear All Trades</button>
                <button className="success">📊 Export Data</button>
                <button className="info">🔒 Lock Bot</button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-users">
            <h1>User Management</h1>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Account Type</th>
                    <th>Total Trades</th>
                    <th>Total Profit</th>
                    <th>Last Active</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.accountType.toUpperCase()}</td>
                      <td>{user.totalTrades}</td>
                      <td className={user.totalProfit >= 0 ? 'profit' : 'loss'}>${user.totalProfit.toFixed(2)}</td>
                      <td>{user.lastActive.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button className="small">Edit</button>
                        <button className="small danger">Ban</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="admin-strategies">
            <h1>Strategy Management</h1>
            <div className="strategies-list">
              {strategies.map(strategy => (
                <div key={strategy.id} className={`strategy-item ${!strategy.enabled ? 'disabled' : ''}`}>
                  <div className="strategy-header">
                    <h3>{strategy.name}</h3>
                    <div className="strategy-status">
                      <label className="switch">
                        <input type="checkbox" checked={strategy.enabled} onChange={() => toggleStrategy(strategy.id)} />
                        <span className="slider"></span>
                      </label>
                      <span className={`risk-badge ${strategy.riskLevel}`}>{strategy.riskLevel}</span>
                    </div>
                  </div>
                  <div className="strategy-controls">
                    <div className="control-group">
                      <label>Min Stake ($)</label>
                      <input
                        type="number"
                        value={strategy.minStake}
                        onChange={(e) => updateStrategyConfig(strategy.id, 'minStake', parseFloat(e.target.value))}
                        step="0.01"
                        min="0.35"
                      />
                    </div>
                    <div className="control-group">
                      <label>Max Stake ($)</label>
                      <input
                        type="number"
                        value={strategy.maxStake}
                        onChange={(e) => updateStrategyConfig(strategy.id, 'maxStake', parseFloat(e.target.value))}
                        step="1"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="admin-settings">
            <h1>Bot Settings</h1>
            
            <div className="settings-section">
              <h2>General Settings</h2>
              <div className="setting-item">
                <label>Default Stake ($)</label>
                <input type="number" defaultValue={0.35} step="0.01" />
              </div>
              <div className="setting-item">
                <label>Auto Trade Interval (seconds)</label>
                <input type="number" defaultValue={3} step="0.5" />
              </div>
              <div className="setting-item">
                <label>Max Consecutive Losses</label>
                <input type="number" defaultValue={3} />
              </div>
            </div>

            <div className="settings-section">
              <h2>Security Settings</h2>
              <div className="setting-item">
                <label>Admin Password</label>
                <input type="password" placeholder="Change admin password" />
              </div>
              <div className="setting-item">
                <label>IP Whitelist</label>
                <input type="text" placeholder="Enter IP addresses (comma separated)" />
              </div>
            </div>

            <div className="settings-section">
              <h2>Risk Management</h2>
              <div className="setting-item">
                <label>Daily Loss Limit ($)</label>
                <input type="number" defaultValue={50} />
              </div>
              <div className="setting-item">
                <label>Daily Profit Target ($)</label>
                <input type="number" defaultValue={100} />
              </div>
            </div>

            <button className="save-settings">Save All Settings</button>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="admin-logs">
            <h1>System Logs</h1>
            <div className="log-controls">
              <button className="small" onClick={() => setLogs([])}>Clear Logs</button>
              <button className="small">Export Logs</button>
            </div>
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