import React from 'react';
import './RecentTrades.css';

interface Trade {
  id: string;
  type: string;
  stake: number;
  profit: number;
  win: boolean;
  timestamp: Date;
  strategy?: string;
  digit?: number;
}

interface RecentTradesProps {
  trades: Trade[];
}

const RecentTrades: React.FC<RecentTradesProps> = ({ trades }) => {
  console.log('📊 RecentTrades received:', trades.length, 'trades');

  if (trades.length === 0) {
    return (
      <div className="recent-trades">
        <h3>Recent Trades</h3>
        <div className="no-trades-message">
          <p>No trades yet. Start trading to see results!</p>
          <p className="hint">💡 Try clicking EVEN or ODD buttons in MANUAL mode</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-trades">
      <h3>Recent Trades ({trades.length})</h3>
      <div className="trades-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Strategy</th>
              <th>Type</th>
              <th>Stake</th>
              <th>Profit</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {trades.slice(0, 10).map((trade, index) => (
              <tr key={trade.id || index}>
                <td>{new Date(trade.timestamp).toLocaleTimeString()}</td>
                <td>{trade.strategy || 'Manual'}</td>
                <td>{trade.type}</td>
                <td>${trade.stake.toFixed(2)}</td>
                <td className={trade.win ? 'profit' : 'loss'}>
                  {trade.win ? '+' : ''}{trade.profit.toFixed(2)}
                </td>
                <td className={trade.win ? 'win' : 'loss'}>
                  {trade.win ? 'WIN' : 'LOSS'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTrades;