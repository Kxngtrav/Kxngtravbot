import React, { useState } from 'react';

const MT5: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('MetaQuotes-Demo');
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnected(true);
      setConnecting(false);
    }, 2000);
  };

  const mt5Strategies = [
    { name: '👑 KXNG MT5: Gold Specialist', winRate: 76, trades: 2890, status: 'Ready' },
    { name: '👑 KXNG MT5: Bitcoin Pro', winRate: 73, trades: 1567, status: 'Ready' },
    { name: '👑 KXNG MT5: Forex Master', winRate: 71, trades: 4123, status: 'Ready' },
    { name: '👑 KXNG MT5: SMC Elite', winRate: 74, trades: 1876, status: 'Ready' },
    { name: '👑 KXNG MT5: AI Neural', winRate: 78, trades: 2345, status: 'Ready' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '8px' }}>
          MT5 Integration
        </h1>
        <p style={{ color: '#94a3b8' }}>Connect your MetaTrader 5 account for automated trading</p>
      </div>

      {/* Connection Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #0f0f1a)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>MT5 Account Connection</h2>
        
        {!connected ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            <input
              type="text"
              placeholder="MT5 Login ID"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              style={{
                padding: '12px',
                background: '#0f0f1a',
                border: '1px solid #2d2d3a',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <input
              type="password"
              placeholder="MT5 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '12px',
                background: '#0f0f1a',
                border: '1px solid #2d2d3a',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <select
              value={server}
              onChange={(e) => setServer(e.target.value)}
              style={{
                padding: '12px',
                background: '#0f0f1a',
                border: '1px solid #2d2d3a',
                borderRadius: '8px',
                color: 'white'
              }}
            >
              <option value="MetaQuotes-Demo">MetaQuotes-Demo</option>
              <option value="MetaQuotes">MetaQuotes (Live)</option>
              <option value="ICMarkets-Demo">IC Markets Demo</option>
              <option value="Pepperstone-Demo">Pepperstone Demo</option>
              <option value="FXCM-Demo">FXCM Demo</option>
            </select>
            <button
              onClick={handleConnect}
              disabled={connecting}
              style={{
                padding: '14px',
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {connecting ? 'CONNECTING...' : 'CONNECT MT5 ACCOUNT'}
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ color: '#10b981', fontSize: '3rem', marginBottom: '10px' }}>✓</div>
            <h3 style={{ color: 'white', marginBottom: '8px' }}>Connected to MT5</h3>
            <p style={{ color: '#94a3b8' }}>Account: {login} | Server: {server}</p>
            <button
              onClick={() => setConnected(false)}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* MT5 Strategies */}
      <div style={{
        background: '#1a1a2e',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>MT5 Elite Strategies</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {mt5Strategies.map(strategy => (
            <div key={strategy.name} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              background: '#0f0f1a',
              borderRadius: '12px',
              border: '1px solid #2d2d3a'
            }}>
              <div>
                <h4 style={{ color: 'white', marginBottom: '4px' }}>{strategy.name}</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{strategy.trades} trades executed</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  background: strategy.winRate >= 75 ? '#10b981' : '#3b82f6',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {strategy.winRate}% WR
                </span>
                <p style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '4px' }}>{strategy.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MT5;