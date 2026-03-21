import React from 'react';
import './RecentTrades.css';

interface Trade {
  id: string;
  type: string;
  stake: number;
  profit: number;
  win: boolean;
  timestamp: Date;
}

interface RecentTradesProps {
  trades: Trade[];
}

const RecentTrades: React.FC<RecentTradesProps> = ({ trades }) => {
  return (
    <div className="recent-trades">
      <h3>Recent Trades</h3>
      <div className="trades-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Stake</th>
              <th>Profit</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={trade.id || index}>
                <td>{new Date(trade.timestamp).toLocaleTimeString()}</td>
                <td>{trade.type}</td>
                <td>${trade.stake.toFixed(2)}</td>
                <td className={trade.win ? 'profit' : 'loss'}>
                  ${trade.profit.toFixed(2)}
                </td>
                <td className={trade.win ? 'win' : 'loss'}>
                  {trade.win ? 'WIN' : 'LOSS'}
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td colSpan={5} className="no-trades">No trades yet. Start trading to see results!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTrades;