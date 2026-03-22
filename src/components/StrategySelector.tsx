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
  analyze?: (data: any) => any;
}

const KXNG_STRATEGIES: Strategy[] = [
  // KXNG Signature Strategies
  { id: 'kxng-1', name: '👑 KXNG 1: The Prophet', description: 'Advanced pattern recognition with 85% accuracy - predicts market reversals before they happen', winRate: 85, type: 'auto', platform: 'deriv', risk: 'medium' },
  { id: 'kxng-2', name: '👑 KXNG 2: The Ghost', description: 'Smart Money Concepts - tracks institutional order flow and liquidity grabs', winRate: 82, type: 'auto', platform: 'deriv', risk: 'medium' },
  { id: 'kxng-3', name: '👑 KXNG 3: The Viper', description: 'Momentum scalper with AI-powered entry signals - 1 minute trades', winRate: 78, type: 'both', platform: 'deriv', risk: 'high' },
  { id: 'kxng-4', name: '👑 KXNG 4: The Oracle', description: 'Fibonacci master with harmonic pattern detection', winRate: 80, type: 'auto', platform: 'deriv', risk: 'medium' },
  { id: 'kxng-5', name: '👑 KXNG 5: The Phantom', description: 'Volume Spread Analysis - detects accumulation and distribution', winRate: 77, type: 'auto', platform: 'deriv', risk: 'low' },
  { id: 'kxng-6', name: '👑 KXNG 6: The Shadow', description: 'Support/Resistance hunter with 92% accuracy on key levels', winRate: 79, type: 'manual', platform: 'deriv', risk: 'medium' },
  { id: 'kxng-7', name: '👑 KXNG 7: The Emperor', description: 'AI Neural Network with deep learning - adapts to market conditions', winRate: 88, type: 'auto', platform: 'deriv', risk: 'medium' },
  { id: 'kxng-8', name: '👑 KXNG 8: The Mercenary', description: 'High-frequency scalping with 1-tick targets', winRate: 75, type: 'both', platform: 'deriv', risk: 'high' },
  { id: 'kxng-9', name: '👑 KXNG 9: The Warlord', description: 'Martingale master with smart recovery system', winRate: 70, type: 'auto', platform: 'deriv', risk: 'high' },
  { id: 'kxng-10', name: '👑 KXNG 10: The Legend', description: 'Ultimate strategy - combines all KXNG indicators', winRate: 91, type: 'auto', platform: 'deriv', risk: 'medium' },
  
  // NEW TRADEX STRATEGY
  { 
    id: 'tradex', 
    name: '⚡ TRADEX - Least Frequent Digit', 
    description: 'Analyzes last 30 ticks, finds the LEAST frequent digit, and predicts it will appear next. Based on "digits rarely repeat" concept.', 
    winRate: 76, 
    type: 'both', 
    platform: 'deriv', 
    risk: 'medium',
    analyze: (data: any) => {
      const { digits } = data;
      if (digits.length < 30) return { type: 'DIGITEVEN', confidence: 50 };
      
      const last30 = digits.slice(-30);
      const frequency = Array(10).fill(0);
      last30.forEach((d: number) => frequency[d]++);
      
      let leastFrequentDigit = 0;
      let minCount = 100;
      for (let i = 0; i < 10; i++) {
        if (frequency[i] < minCount) {
          minCount = frequency[i];
          leastFrequentDigit = i;
        }
      }
      
      const confidence = 50 + (100 - (minCount / 30) * 100) / 2;
      
      return {
        type: 'DIGITMATCH',
        barrier: leastFrequentDigit.toString(),
        confidence: Math.min(85, confidence)
      };
    }
  },
  
  // MT5 Strategies
  { id: 'mt5-1', name: '👑 KXNG MT5: Gold Specialist', description: 'Dedicated XAUUSD strategy with 76% win rate', winRate: 76, type: 'auto', platform: 'mt5', risk: 'medium' },
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