import React from 'react';
import './AccountInfo.css';

interface AccountInfoProps {
  balance: number;
  lastDigit: number;
  currentPrice: number;
  connected: boolean;
  accountType: 'demo' | 'real';
  platform: 'deriv' | 'mt5';
}

const AccountInfo: React.FC<AccountInfoProps> = ({ 
  balance, lastDigit, currentPrice, connected, accountType, platform 
}) => {
  return (
    <div className="account-info">
      <div className="info-card">
        <div className="info-label">Balance</div>
        <div className="info-value">${balance.toFixed(2)}</div>
        <div className={`status-badge ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '● CONNECTED' : '● DISCONNECTED'}
        </div>
      </div>
      <div className="info-card">
        <div className="info-label">Price</div>
        <div className="info-value price">${currentPrice.toFixed(4)}</div>
      </div>
      <div className="info-card">
        <div className="info-label">Last Digit</div>
        <div className="info-value digit">{lastDigit}</div>
      </div>
      <div className="info-card">
        <div className="info-label">Mode</div>
        <div className="info-value mode">{accountType.toUpperCase()}</div>
        <div className="platform-badge">{platform.toUpperCase()}</div>
      </div>
    </div>
  );
};

export default AccountInfo;