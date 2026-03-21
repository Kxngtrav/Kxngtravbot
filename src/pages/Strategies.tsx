import React, { useState } from 'react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  winRate: number;
  type: 'auto' | 'manual' | 'both';
  risk: 'low' | 'medium' | 'high';
  platform: 'deriv' | 'mt5';
  trades: number;
}

const KXNG_STRATEGIES: Strategy[] = [
  { id: 'kxng-1', name: '👑 KXNG 1: The Prophet', description: 'Advanced pattern recognition with 85% accuracy - predicts market reversals before they happen', winRate: 85, type: 'auto', risk: 'medium', platform: 'deriv', trades: 1245 },
  { id: 'kxng-2', name: '👑 KXNG 2: The Ghost', description: 'Smart Money Concepts - tracks institutional order flow and liquidity grabs', winRate: 82, type: 'auto', risk: 'medium', platform: 'deriv', trades: 892 },
  { id: 'kxng-3', name: '👑 KXNG 3: The Viper', description: 'Momentum scalper with AI-powered entry signals - 1 minute trades', winRate: 78, type: 'both', risk: 'high', platform: 'deriv', trades: 2156 },
  { id: 'kxng-4', name: '👑 KXNG 4: The Oracle', description: 'Fibonacci master with harmonic pattern detection', winRate: 80, type: 'auto', risk: 'medium', platform: 'deriv', trades: 1567 },
  { id: 'kxng-5', name: '👑 KXNG 5: The Phantom', description: 'Volume Spread Analysis - detects accumulation and distribution', winRate: 77, type: 'auto', risk: 'low', platform: 'deriv', trades: 934 },
  { id: 'kxng-6', name: '👑 KXNG 6: The Shadow', description: 'Support/Resistance hunter with 92% accuracy on key levels', winRate: 79, type: 'manual', risk: 'medium', platform: 'deriv', trades: 678 },
  { id: 'kxng-7', name: '👑 KXNG 7: The Emperor', description: 'AI Neural Network with deep learning - adapts to market conditions', winRate: 88, type: 'auto', risk: 'medium', platform: 'deriv', trades: 445 },
  { id: 'kxng-8', name: '👑 KXNG 8: The Mercenary', description: 'High-frequency scalping with 1-tick targets', winRate: 75, type: 'both', risk: 'high', platform: 'deriv', trades: 3245 },
  { id: 'kxng-9', name: '👑 KXNG 9: The Warlord', description: 'Martingale master with smart recovery system', winRate: 70, type: 'auto', risk: 'high', platform: 'deriv', trades: 567 },
  { id: 'kxng-10', name: '👑 KXNG 10: The Legend', description: 'Ultimate strategy - combines all KXNG indicators', winRate: 91, type: 'auto', risk: 'medium', platform: 'deriv', trades: 234 },
  { id: 'mt5-1', name: '👑 KXNG MT5: Gold Specialist', description: 'Dedicated XAUUSD strategy with 76% win rate', winRate: 76, type: 'auto', risk: 'medium', platform: 'mt5', trades: 2890 },
  { id: 'mt5-2', name: '👑 KXNG MT5: Bitcoin Pro', description: 'BTCUSD scalper with volume confirmation', winRate: 73, type: 'auto', risk: 'high', platform: 'mt5', trades: 1567 },
  { id: 'mt5-3', name: '👑 KXNG MT5: Forex Master', description: 'Multi-currency EA with trend following', winRate: 71, type: 'auto', risk: 'medium', platform: 'mt5', trades: 4123 },
  { id: 'mt5-4', name: '👑 KXNG MT5: SMC Elite', description: 'Smart Money Concepts for MT5', winRate: 74, type: 'auto', risk: 'medium', platform: 'mt5', trades: 1876 },
  { id: 'mt5-5', name: '👑 KXNG MT5: AI Neural', description: 'Machine learning predictions', winRate: 78, type: 'auto', risk: 'medium', platform: 'mt5', trades: 2345 },
  { id: 'mt5-6', name: '👑 KXNG MT5: Mean Reversion', description: 'Bollinger Bands + RSI combo', winRate: 72, type: 'auto', risk: 'low', platform: 'mt5', trades: 3245 },
  { id: 'mt5-7', name: '👑 KXNG MT5: Trend Master', description: 'ADX + MACD trend following', winRate: 70, type: 'auto', risk: 'medium', platform: 'mt5', trades: 2765 },
  { id: 'mt5-8', name: '👑 KXNG MT5: Session Hunter', description: 'Trades specific market sessions', winRate: 69, type: 'auto', risk: 'low', platform: 'mt5', trades: 1987 },
  { id: 'mt5-9', name: '👑 KXNG MT5: Breakout Pro', description: 'Key level breakout detector', winRate: 73, type: 'auto', risk: 'medium', platform: 'mt5', trades: 1456 },
  { id: 'mt5-10', name: '👑 KXNG MT5: Scalper Elite', description: '1-minute scalping system', winRate: 68, type: 'auto', risk: 'high', platform: 'mt5', trades: 5678 }
];

const Strategies: React.FC = () => {
  const [platform, setPlatform] = useState<'all' | 'deriv' | 'mt5'>('all');

  const filteredStrategies = KXNG_STRATEGIES.filter(s => 
    platform === 'all' ? true : s.platform === platform
  );

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'auto': return '#3b82f6';
      case 'manual': return '#8b5cf6';
      case 'both': return '#10b981';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '8px' }}>
          KXNG Elite Strategies
        </h1>
        <p style={{ color: '#94a3b8' }}>20+ professional trading strategies with proven win rates</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setPlatform('all')}
          style={{
            padding: '8px 20px',
            background: platform === 'all' ? '#3b82f6' : '#1a1a2e',
            color: 'white',
            border: platform === 'all' ? 'none' : '1px solid #2d2d3a',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          All Strategies
        </button>
        <button
          onClick={() => setPlatform('deriv')}
          style={{
            padding: '8px 20px',
            background: platform === 'deriv' ? '#3b82f6' : '#1a1a2e',
            color: 'white',
            border: platform === 'deriv' ? 'none' : '1px solid #2d2d3a',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Deriv Strategies
        </button>
        <button
          onClick={() => setPlatform('mt5')}
          style={{
            padding: '8px 20px',
            background: platform === 'mt5' ? '#3b82f6' : '#1a1a2e',
            color: 'white',
            border: platform === 'mt5' ? 'none' : '1px solid #2d2d3a',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          MT5 Strategies
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredStrategies.map(strategy => (
          <div key={strategy.id} style={{
            background: '#1a1a2e',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            transition: 'transform 0.2s'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>{strategy.name}</h3>
              <span style={{
                background: strategy.winRate >= 80 ? '#10b981' : strategy.winRate >= 70 ? '#3b82f6' : '#f59e0b',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {strategy.winRate}% WR
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>
              {strategy.description}
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span style={{
                background: getTypeColor(strategy.type),
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {strategy.type.toUpperCase()}
              </span>
              <span style={{
                background: getRiskColor(strategy.risk),
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {strategy.risk.toUpperCase()} RISK
              </span>
              <span style={{
                background: '#2d2d3a',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                color: '#94a3b8'
              }}>
                {strategy.trades} trades
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Strategies;