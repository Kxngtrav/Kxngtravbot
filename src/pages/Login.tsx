import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (token: string, accountType: 'demo' | 'real', platform: 'deriv' | 'mt5') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [platform, setPlatform] = useState<'deriv' | 'mt5'>('deriv');
  const [accountType, setAccountType] = useState<'demo' | 'real'>('demo');
  const [token, setToken] = useState('');
  const [mt5Login, setMt5Login] = useState('');
  const [mt5Password, setMt5Password] = useState('');
  const [mt5Server, setMt5Server] = useState('MetaQuotes-Demo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (platform === 'deriv') {
        // For demo, we can use empty token - will create demo account
        onLogin(token || 'demo', accountType, platform);
      } else {
        onLogin(mt5Login, accountType, platform);
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>KXNG<span>TRADER</span></h1>
          <p>Elite Trading Platform</p>
        </div>

        <div className="platform-selector">
          <button 
            type="button"
            className={platform === 'deriv' ? 'active' : ''}
            onClick={() => setPlatform('deriv')}
          >
            Deriv
          </button>
          <button 
            type="button"
            className={platform === 'mt5' ? 'active' : ''}
            onClick={() => setPlatform('mt5')}
          >
            MT5 Elite
          </button>
        </div>

        <div className="account-type">
          <button 
            type="button"
            className={accountType === 'demo' ? 'active' : ''}
            onClick={() => setAccountType('demo')}
          >
            Demo Account
          </button>
          <button 
            type="button"
            className={accountType === 'real' ? 'active' : ''}
            onClick={() => setAccountType('real')}
          >
            Real Account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {platform === 'deriv' ? (
            <div className="form-group">
              <label>Deriv API Token</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder={accountType === 'demo' ? "Leave empty for demo account" : "Enter your REAL API token"}
                required={accountType === 'real'}
              />
              <small>
                {accountType === 'demo' 
                  ? "Leave empty to create a free Deriv demo account"
                  : "Get token from Deriv → Settings → API Token (Read & Trade permissions)"}
              </small>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>MT5 Login</label>
                <input
                  type="text"
                  value={mt5Login}
                  onChange={(e) => setMt5Login(e.target.value)}
                  placeholder="e.g., 12345678"
                  required
                />
              </div>
              <div className="form-group">
                <label>MT5 Password</label>
                <input
                  type="password"
                  value={mt5Password}
                  onChange={(e) => setMt5Password(e.target.value)}
                  placeholder="Your MT5 password"
                  required
                />
              </div>
              <div className="form-group">
                <label>MT5 Server</label>
                <select value={mt5Server} onChange={(e) => setMt5Server(e.target.value)}>
                  <option value="MetaQuotes-Demo">MetaQuotes-Demo</option>
                  <option value="MetaQuotes">MetaQuotes (Live)</option>
                  <option value="ICMarkets-Demo">IC Markets Demo</option>
                  <option value="Pepperstone-Demo">Pepperstone Demo</option>
                </select>
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'CONNECTING...' : accountType === 'demo' ? '🎮 CONNECT DEMO ACCOUNT' : '💰 CONNECT REAL ACCOUNT'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 KXNGTRADER. All rights reserved.</p>
          <p>www.kxngtravbot.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;