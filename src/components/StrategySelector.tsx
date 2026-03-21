import React, { useState } from 'react';
import './StrategySelector.css';

interface Strategy {
  id: string;
  name: string;
  description: string;
  winRate: number;
  type: 'auto' | 'manual' | 'both';
  platform: 'deriv' | 'mt5';
  risk: 'low' | 'medium' | 'high';
}

const KXNG_STRATEGIES: Strategy[] = [
  { id: 'kxng-1', name: '👑 KXNG 1: The Prophet', description: 'Advanced pattern recognition with 85% accuracy', winRate: 85, type: 'auto', platform: 'deriv', risk: 'medium' },
  { id: 'kxng-2', name: '👑 KXNG 2: The Ghost', description: 'Smart Money Concepts - tracks institutional flow', winRate: 82, type: 'auto', platform: 'deriv', risk: 'medium' },
  { id: 'kxng-3', name: '👑 KXNG 3: The Viper', description: 'Momentum scalper with AI-powered entries', winRate: 78, type: 'both', platform: 'deriv', risk: 'high' },
  { id: 'kxng-4', name: '👑 KXNG 4: The Oracle', description: 'Fibonacci master with harmonic pattern detection', winRate: 80, type: 'auto', platform: 'deriv', risk: 'medium' },
  { id: 'kxng-5', name: '👑 KXNG 5: The Phantom', description: 'Volume Spread Analysis - detects accumulation', winRate: 77, type: 'auto', platform: 'deriv', risk: 'low' },
  { id: 'kxng-6', name: '👑 KXNG 6: The Shadow', description: 'Support/Resistance hunter with 92% accuracy', winRate: 79, type: 'manual', platform: 'deriv', risk: 'medium' },
  { id: 'kxng-7', name: '👑 KXNG 7: The Emperor', description: 'AI Neural Network with deep learning', winRate: 88, type: 'auto', platform: 'deriv', risk: 'medium' },
  { id: 'kxng-8', name: '👑 KXNG 8: The Mercenary', description: 'High-frequency scalping with 1-tick targets', winRate: 75, type: 'both', platform: 'deriv', risk: 'high' },
  { id: 'kxng-9', name: '👑 KXNG 9: The Warlord', description: 'Martingale master with smart recovery', winRate: 70, type: 'auto', platform: 'deriv', risk: 'high' },
  { id: 'kxng-10', name: '👑 KXNG 10: The Legend', description: 'Ultimate strategy - combines all indicators', winRate: 91, type: 'auto', platform: 'deriv', risk: 'medium' },
  { id: 'mt5-1', name: '👑 KXNG MT5: Gold Specialist', description: 'Dedicated XAUUSD strategy', winRate: 76, type: 'auto', platform: 'mt5', risk: 'medium' },
  { id: 'mt5-2', name: '👑 KXNG MT5: Bitcoin Pro', description: 'BTCUSD scalper with volume confirmation', winRate: 73, type: 'auto', platform: 'mt5', risk: 'high' },
];

interface StrategySelectorProps {
  onSelectStrategy: (strategy: Strategy) => void;
  selectedStrategy: Strategy | null;
  platform: 'deriv' | 'mt5';
}

const StrategySelector: React.FC<StrategySelectorProps> = ({ onSelectStrategy, selectedStrategy, platform }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStrategies = KXNG_STRATEGIES.filter(s => 
    s.platform === platform && s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="strategy-selector">
      <div className="selector-header">
        <h3>KXNG Elite Strategies</h3>
        <input
          type="text"
          placeholder="Search strategies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="strategies-grid">
        {filteredStrategies.map(strategy => (
          <div 
            key={strategy.id}
            className={`strategy-card ${selectedStrategy?.id === strategy.id ? 'selected' : ''}`}
            onClick={() => onSelectStrategy(strategy)}
          >
            <div className="card-header">
              <h4>{strategy.name}</h4>
              <span className={`win-rate ${strategy.winRate >= 80 ? 'elite' : ''}`}>
                {strategy.winRate}%
              </span>
            </div>
            <p className="description">{strategy.description}</p>
            <div className="card-footer">
              <span className={`badge ${strategy.type}`}>{strategy.type}</span>
              <span className={`badge risk-${strategy.risk}`}>{strategy.risk}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategySelector;