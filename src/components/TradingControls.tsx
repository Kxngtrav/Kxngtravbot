import React, { useState, useEffect } from 'react';
import './TradingControls.css';

interface TradingControlsProps {
  isTrading: boolean;
  setIsTrading: (value: boolean) => void;
  selectedStrategy: any;
  lastDigit: number;
  currentPrice: number;
  derivService: any;
  connected: boolean;
  onResetStats?: () => void;
  accountType?: 'demo' | 'real';
  balance?: number;
  onTradePlaced?: (trade: any) => void;
}

const TradingControls: React.FC<TradingControlsProps> = ({
  isTrading,
  setIsTrading,
  selectedStrategy,
  lastDigit,
  currentPrice,
  derivService,
  connected,
  onResetStats,
  accountType = 'demo',
  balance = 0,
  onTradePlaced
}) => {
  const [tradeMode, setTradeMode] = useState<'auto' | 'manual'>('auto');
  const [hedgeMode, setHedgeMode] = useState(false);
  const [duration, setDuration] = useState(1);
  const [durationUnit, setDurationUnit] = useState<'t' | 'm'>('t');
  const [stake, setStake] = useState(0.35);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [contractType, setContractType] = useState<string>('');
  const [contractBarrier, setContractBarrier] = useState<string>('');
  const [quickStakeOptions] = useState([0.35, 0.50, 1.00, 2.00, 5.00, 10.00]);
  const [durationOptions] = useState([1, 2, 3, 4, 5, 10, 15, 30, 45, 60]);

  // Auto-trading effect
  useEffect(() => {
    if (isTrading && tradeMode === 'auto' && selectedStrategy && derivService) {
      derivService.startAutoTrading(selectedStrategy, stake);
    } else if (!isTrading && derivService) {
      derivService.stopAutoTrading();
    }
  }, [isTrading, tradeMode, selectedStrategy, derivService, stake]);

  const placeManualTrade = (type: string, barrier?: string) => {
    if (!connected || !derivService) return;
    
    const contract = {
      amount: stake,
      basis: 'stake',
      currency: 'USD',
      duration: duration,
      duration_unit: durationUnit,
      symbol: 'R_100',
      contract_type: type
    };
    
    if (barrier) {
      (contract as any).barrier = barrier;
    }
    
    console.log('📤 Manual trade:', contract);
    derivService.placeTrade(contract);
    
    // Notify parent about trade placement
    if (onTradePlaced) {
      onTradePlaced({
        type: type,
        stake: stake,
        duration: duration,
        durationUnit: durationUnit,
        timestamp: new Date(),
        barrier: barrier
      });
    }
  };

  const handleReset = () => {
    if (onResetStats) {
      onResetStats();
    }
    setShowResetConfirm(false);
  };

  const setQuickStake = (amount: number) => {
    setStake(amount);
  };

  const setQuickDuration = (dur: number) => {
    setDuration(dur);
  };

  return (
    <div className="trading-controls">
      <div className="controls-header">
        <h3>⚡ Trading Controls</h3>
        <div className="price-info">
          <span className="price">💰 ${currentPrice.toFixed(4)}</span>
          <span className="digit">🎲 Digit: {lastDigit}</span>
        </div>
      </div>

      {/* Account Balance Display */}
      <div className="balance-display" style={{
        background: accountType === 'real' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        padding: '12px 16px',
        borderRadius: '12px',
        marginBottom: '16px',
        textAlign: 'center',
        border: `2px solid ${accountType === 'real' ? '#ef4444' : '#10b981'}`
      }}>
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
          {accountType === 'real' ? '💰 REAL ACCOUNT' : '🎮 DEMO ACCOUNT'}
        </span>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: accountType === 'real' ? '#ef4444' : '#10b981' }}>
          ${balance.toFixed(2)}
        </div>
      </div>

      {/* Quick Stake Options */}
      <div className="quick-stakes">
        <label>💰 Quick Stake:</label>
        <div className="stake-buttons">
          {quickStakeOptions.map(amount => (
            <button
              key={amount}
              className={`stake-btn ${stake === amount ? 'active' : ''}`}
              onClick={() => setQuickStake(amount)}
            >
              ${amount.toFixed(2)}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selector */}
      <div className="control-row">
        <div className="mode-selector">
          <button 
            className={tradeMode === 'auto' ? 'active' : ''}
            onClick={() => setTradeMode('auto')}
          >
            🤖 AUTO
          </button>
          <button 
            className={tradeMode === 'manual' ? 'active' : ''}
            onClick={() => setTradeMode('manual')}
          >
            ✋ MANUAL
          </button>
        </div>

        <button 
          className={`hedge-toggle ${hedgeMode ? 'active' : ''}`}
          onClick={() => setHedgeMode(!hedgeMode)}
        >
          {hedgeMode ? '🛡️ HEDGE ON' : '⚔️ HEDGE OFF'}
        </button>
      </div>

      {/* Duration Controls */}
      <div className="duration-controls">
        <label>⏱️ Duration:</label>
        <div className="duration-buttons">
          {durationOptions.slice(0, 5).map(dur => (
            <button
              key={dur}
              className={`duration-btn ${duration === dur ? 'active' : ''}`}
              onClick={() => setQuickDuration(dur)}
            >
              {dur}
            </button>
          ))}
        </div>
        <div className="duration-select">
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={1}
            max={durationUnit === 't' ? 10 : 60}
            className="duration-input"
          />
          <select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value as 't' | 'm')}>
            <option value="t">Ticks</option>
            <option value="m">Minutes</option>
          </select>
        </div>
      </div>

      {/* Stake Control */}
      <div className="stake-control">
        <label>💵 Stake Amount:</label>
        <div className="stake-input-group">
          <span>$</span>
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            step="0.01"
            min="0.35"
            className="stake-input"
          />
        </div>
      </div>

      {/* Reset Button Section */}
      <div className="reset-section">
        {!showResetConfirm ? (
          <button className="reset-btn" onClick={() => setShowResetConfirm(true)}>
            🔄 Reset Wins & Losses
          </button>
        ) : (
          <div className="reset-confirm">
            <span>⚠️ Reset all stats?</span>
            <button className="confirm-yes" onClick={handleReset}>Yes</button>
            <button className="confirm-no" onClick={() => setShowResetConfirm(false)}>No</button>
          </div>
        )}
      </div>

      {/* Manual Trading Buttons */}
      {tradeMode === 'manual' && (
        <div className="manual-buttons">
          <div className="button-group">
            <h4>🎲 Digit Trading</h4>
            <div className="button-row">
              <button onClick={() => placeManualTrade('DIGITEVEN')} className="btn-even">EVEN</button>
              <button onClick={() => placeManualTrade('DIGITODD')} className="btn-odd">ODD</button>
            </div>
          </div>

          <div className="button-group">
            <h4>📊 Range Trading</h4>
            <div className="button-row">
              <button onClick={() => placeManualTrade('DIGITOVER', '5')} className="btn-over">OVER 5</button>
              <button onClick={() => placeManualTrade('DIGITUNDER', '5')} className="btn-under">UNDER 5</button>
            </div>
          </div>

          <div className="button-group">
            <h4>🎯 Pattern Trading</h4>
            <div className="button-row">
              <button onClick={() => placeManualTrade('DIGITMATCH', lastDigit.toString())} className="btn-match">
                MATCH {lastDigit}
              </button>
              <button onClick={() => placeManualTrade('DIGITDIFF', lastDigit.toString())} className="btn-diff">
                DIFF {lastDigit}
              </button>
            </div>
          </div>

          <div className="button-group">
            <h4>⚡ Quick Trade</h4>
            <div className="button-row">
              <button onClick={() => placeManualTrade('DIGITEVEN')} className="btn-quick">QUICK EVEN</button>
              <button onClick={() => placeManualTrade('DIGITODD')} className="btn-quick">QUICK ODD</button>
            </div>
          </div>
        </div>
      )}

      {hedgeMode && tradeMode === 'auto' && (
        <div className="hedge-info">
          <p>🛡️ Hedge Mode Active - Trading both HIGHER and LOWER simultaneously</p>
          <p className="hedge-desc">You profit if either direction wins!</p>
        </div>
      )}

      <button 
        className={`start-stop-btn ${isTrading ? 'stop' : 'start'}`}
        onClick={() => setIsTrading(!isTrading)}
        disabled={tradeMode === 'auto' && !selectedStrategy}
      >
        {isTrading ? '⏹️ STOP TRADING' : '▶️ START TRADING'}
      </button>

      {tradeMode === 'auto' && !selectedStrategy && (
        <p className="warning">⚠️ Please select a strategy first</p>
      )}

      {connected && (
        <div className="connection-status">
          <span className="status-dot"></span>
          Connected to Deriv {accountType.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default TradingControls;