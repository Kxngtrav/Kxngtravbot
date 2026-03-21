import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [baseStake, setBaseStake] = useState(0.35);
  const [profitTarget, setProfitTarget] = useState(10);
  const [lossLimit, setLossLimit] = useState(5);
  const [takeProfit, setTakeProfit] = useState(20);
  const [stopLoss, setStopLoss] = useState(10);
  const [autoTradeInterval, setAutoTradeInterval] = useState(2);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('kxng_settings', JSON.stringify({
      baseStake, profitTarget, lossLimit, takeProfit, stopLoss, autoTradeInterval
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '8px' }}>
          Settings
        </h1>
        <p style={{ color: '#94a3b8' }}>Configure your trading preferences</p>
      </div>

      <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '24px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <h2 style={{ color: 'white', marginBottom: '24px' }}>Stake Management</h2>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Base Stake ($)</label>
            <input
              type="number"
              value={baseStake}
              onChange={(e) => setBaseStake(parseFloat(e.target.value))}
              step="0.01"
              min="0.35"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0f0f1a',
                border: '1px solid #2d2d3a',
                borderRadius: '8px',
                color: 'white'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Profit Target ($)</label>
              <input
                type="number"
                value={profitTarget}
                onChange={(e) => setProfitTarget(parseFloat(e.target.value))}
                step="1"
                min="1"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0f0f1a',
                  border: '1px solid #2d2d3a',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>
            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Loss Limit ($)</label>
              <input
                type="number"
                value={lossLimit}
                onChange={(e) => setLossLimit(parseFloat(e.target.value))}
                step="1"
                min="1"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0f0f1a',
                  border: '1px solid #2d2d3a',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Take Profit ($)</label>
              <input
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(parseFloat(e.target.value))}
                step="1"
                min="1"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0f0f1a',
                  border: '1px solid #2d2d3a',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>
            <div>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Stop Loss ($)</label>
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(parseFloat(e.target.value))}
                step="1"
                min="1"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0f0f1a',
                  border: '1px solid #2d2d3a',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Auto Trade Interval (seconds)</label>
            <input
              type="number"
              value={autoTradeInterval}
              onChange={(e) => setAutoTradeInterval(parseFloat(e.target.value))}
              step="0.5"
              min="0.5"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0f0f1a',
                border: '1px solid #2d2d3a',
                borderRadius: '8px',
                color: 'white'
              }}
            />
          </div>

          <button
            onClick={handleSave}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            Save Settings
          </button>

          {saved && (
            <div style={{
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: '8px',
              color: '#10b981',
              textAlign: 'center'
            }}>
              ✓ Settings saved successfully!
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '24px', background: '#1a1a2e', borderRadius: '16px', padding: '24px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <h2 style={{ color: 'white', marginBottom: '16px' }}>About KXNGTRADER</h2>
        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
          KXNGTRADER Elite is a professional trading platform with 20+ advanced strategies, 
          real-time market data, and both Deriv and MT5 integration. Developed for traders 
          who demand precision and performance.
        </p>
        <p style={{ color: '#64748b', marginTop: '16px', fontSize: '0.9rem' }}>
          Version 2.0.0 | www.kxngtravbot.com
        </p>
      </div>
    </div>
  );
};

export default Settings;