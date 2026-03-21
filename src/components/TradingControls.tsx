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
  balance = 0
}) => {
  const [tradeMode, setTradeMode] = useState<'auto' | 'manual'>('auto');
  const [hedgeMode, setHedgeMode] = useState(false);
  const [duration, setDuration] = useState(1);
  const [durationUnit, setDurationUnit] = useState<'t' | 'm'>('t');
  const [stake, setStake] = useState(0.35);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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
    
    derivService.placeTrade(contract);
  };

  const handleReset = () => {
    if (onResetStats) {
      onResetStats();
    }
    setShowResetConfirm(false);
  };

  return (
    <div className="trading-controls">
      <div className="controls-header">
        <h3>Trading Controls</h3>
        <div className="price-info">
          <span>Price: ${currentPrice.toFixed(4)}</span>
          <span>Digit: {lastDigit}</span>
        </div>
      </div>

      <div className="balance-display" style={{
        background: accountType === 'real' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        padding: '8px 12px',
        borderRadius: '8px',
        marginBottom: '16px',
        textAlign: 'center',
        border: `1px solid ${accountType === 'real' ? '#ef4444' : '#10b981'}`
      }}>
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
          {accountType === 'real' ? '💰 REAL ACCOUNT' : '🎮 DEMO ACCOUNT'}
        </span>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: accountType === 'real' ? '#ef4444' : '#10b981' }}>
          ${balance.toFixed(2)}
        </div>
      </div>

      <div className="control-row">
        <div className="mode-selector">
          <button className={tradeMode === 'auto' ? 'active' : ''} onClick={() => setTradeMode('auto')}>AUTO</button>
          <button className={tradeMode === 'manual' ? 'active' : ''} onClick={() => setTradeMode('manual')}>MANUAL</button>
        </div>
        <button className={`hedge-toggle ${hedgeMode ? 'active' : ''}`} onClick={() => setHedgeMode(!hedgeMode)}>
          {hedgeMode ? '⚡ HEDGE ON' : '⚡ HEDGE OFF'}
        </button>
      </div>

      <div className="control-row">
        <div className="duration-control">
          <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={1} max={durationUnit === 't' ? 10 : 60} />
          <select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value as 't' | 'm')}>
            <option value="t">Ticks</option>
            <option value="m">Minutes</option>
          </select>
        </div>
        <div className="stake-control">
          <label>$</label>
          <input type="number" value={stake} onChange={(e) => setStake(Number(e.target.value))} step="0.01" min="0.35" />
        </div>
      </div>

      <div className="reset-section">
        {!showResetConfirm ? (
          <button className="reset-btn" onClick={() => setShowResetConfirm(true)}>🔄 Reset Wins & Losses</button>
        ) : (
          <div className="reset-confirm">
            <span>Reset all stats?</span>
            <button className="confirm-yes" onClick={handleReset}>Yes</button>
            <button className="confirm-no" onClick={() => setShowResetConfirm(false)}>No</button>
          </div>
        )}
      </div>

      {tradeMode === 'manual' && (
        <div className="manual-buttons">
          <div className="button-row">
            <button onClick={() => placeManualTrade('DIGITEVEN')} className="btn-even">EVEN</button>
            <button onClick={() => placeManualTrade('DIGITODD')} className="btn-odd">ODD</button>
          </div>
          <div className="button-row">
            <button onClick={() => placeManualTrade('DIGITOVER', '5')} className="btn-over">OVER 5</button>
            <button onClick={() => placeManualTrade('DIGITUNDER', '5')} className="btn-under">UNDER 5</button>
          </div>
          <div className="button-row">
            <button onClick={() => placeManualTrade('DIGITMATCH', lastDigit.toString())} className="btn-match">MATCH {lastDigit}</button>
            <button onClick={() => placeManualTrade('DIGITDIFF', lastDigit.toString())} className="btn-diff">DIFF {lastDigit}</button>
          </div>
        </div>
      )}

      {hedgeMode && tradeMode === 'auto' && (
        <div className="hedge-info"><p>⚡ Hedge Mode Active - Trading both HIGHER and LOWER</p></div>
      )}

      <button className={`start-stop-btn ${isTrading ? 'stop' : 'start'}`} onClick={() => setIsTrading(!isTrading)} disabled={tradeMode === 'auto' && !selectedStrategy}>
        {isTrading ? 'STOP TRADING' : 'START TRADING'}
      </button>

      {tradeMode === 'auto' && !selectedStrategy && <p className="warning">Please select a strategy first</p>}
    </div>
  );
};

export default TradingControls;