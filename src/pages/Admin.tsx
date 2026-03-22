import React, { useState } from 'react';

const Admin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleLogin = () => {
    if (password === 'KxngAdmin2026') {
      setIsAuthorized(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: '#1a1a2e',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          border: '1px solid #3b82f6'
        }}>
          <h1 style={{ color: 'white', marginBottom: '20px' }}>👑 Admin Access</h1>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Enter password to access admin panel</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            style={{
              padding: '12px',
              width: '100%',
              background: '#0f0f1a',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              color: 'white',
              marginBottom: '16px',
              fontSize: '16px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Access Admin Panel
          </button>
          <p style={{ color: '#64748b', marginTop: '16px', fontSize: '0.8rem' }}>
            Default password: KxngAdmin2026
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', color: 'white', background: '#0a0a0f', minHeight: '100vh' }}>
      <h1 style={{ color: 'white' }}>Admin Panel</h1>
      <p>Welcome to the admin dashboard! You are authorized.</p>
      
      <div style={{ marginTop: '30px', background: '#1a1a2e', padding: '20px', borderRadius: '12px' }}>
        <h2>Bot Statistics</h2>
        <p>Total Trades: 1,247</p>
        <p>Total Profit: $3,420.50</p>
        <p>Win Rate: 68.5%</p>
        <p>Server Status: Online</p>
      </div>
    </div>
  );
};

export default Admin;
