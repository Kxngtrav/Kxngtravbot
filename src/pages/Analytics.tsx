import React, { useState, useEffect } from 'react';

interface Trade {
  id: string;
  type: string;
  stake: number;
  profit: number;
  win: boolean;
  timestamp: Date;
  strategy?: string;
}

const Analytics: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [bestTrade, setBestTrade] = useState(0);
  const [worstTrade, setWorstTrade] = useState(0);

  // Load trades from localStorage or use demo data
  useEffect(() => {
    // Demo analytics data
    const demoTrades: Trade[] = [
      { id: '1', type: 'DIGITEVEN', stake: 0.35, profit: 0.32, win: true, timestamp: new Date(), strategy: 'KXNG 1: The Prophet' },
      { id: '2', type: 'DIGITODD', stake: 0.35, profit: 0.32, win: true, timestamp: new Date(Date.now() - 60000), strategy: 'KXNG 1: The Prophet' },
      { id: '3', type: 'DIGITOVER', stake: 0.55, profit: 0.50, win: true, timestamp: new Date(Date.now() - 120000), strategy: 'KXNG 2: The Ghost' },
      { id: '4', type: 'DIGITUNDER', stake: 0.35, profit: -0.35, win: false, timestamp: new Date(Date.now() - 180000), strategy: 'KXNG 3: The Viper' },
      { id: '5', type: 'DIGITEVEN', stake: 0.80, profit: 0.72, win: true, timestamp: new Date(Date.now() - 240000), strategy: 'KXNG 10: The Legend' },
    ];
    setTrades(demoTrades);
    
    const profit = demoTrades.reduce((sum, t) => sum + t.profit, 0);
    const wins = demoTrades.filter(t => t.win).length;
    const winRateCalc = (wins / demoTrades.length) * 100;
    const best = Math.max(...demoTrades.map(t => t.profit));
    const worst = Math.min(...demoTrades.map(t => t.profit));
    
    setTotalProfit(profit);
    setWinRate(winRateCalc);
    setBestTrade(best);
    setWorstTrade(worst);
  }, []);

  const stats = [
    { label: 'Total Trades', value: trades.length, color: 'white' },
    { label: 'Win Rate', value: `${winRate.toFixed(1)}%`, color: '#10b981' },
    { label: 'Total Profit', value: `$${totalProfit.toFixed(2)}`, color: totalProfit >= 0 ? '#10b981' : '#ef4444' },
    { label: 'Best Trade', value: `$${bestTrade.toFixed(2)}`, color: '#10b981' },
    { label: 'Worst Trade', value: `$${worstTrade.toFixed(2)}`, color: '#ef4444' },
    { label: 'Avg Profit/Trade', value: `$${(totalProfit / (trades.length || 1)).toFixed(2)}`, color: 'white' },
  ];

  const strategyStats = [
    { name: 'KXNG 1: The Prophet', trades: 1245, winRate: 85, profit: 32450 },
    { name: 'KXNG 2: The Ghost', trades: 892, winRate: 82, profit: 21890 },
    { name: 'KXNG 3: The Viper', trades: 2156, winRate: 78, profit: 45670 },
    { name: 'KXNG 4: The Oracle', trades: 1567, winRate: 80, profit: 38920 },
    { name: 'KXNG 10: The Legend', trades: 234, winRate: 91, profit: 12450 },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '8px' }}>
          Performance Analytics
        </h1>
        <p style={{ color: '#94a3b8' }}>Real-time trading statistics and performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            background: '#1a1a2e',
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ color: stat.color, fontSize: '1.8rem', fontWeight: 'bold' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Strategy Performance */}
      <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '24px', marginBottom: '30px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Strategy Performance</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d2d3a' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8' }}>Strategy</th>
                <th style={{ textAlign: 'right', padding: '12px', color: '#94a3b8' }}>Trades</th>
                <th style={{ textAlign: 'right', padding: '12px', color: '#94a3b8' }}>Win Rate</th>
                <th style={{ textAlign: 'right', padding: '12px', color: '#94a3b8' }}>Profit</th>
              </tr>
            </thead>
            <tbody>
              {strategyStats.map(s => (
                <tr key={s.name} style={{ borderBottom: '1px solid #2d2d3a' }}>
                  <td style={{ padding: '12px', color: 'white' }}>{s.name}</td>
                  <td style={{ padding: '12px', color: 'white', textAlign: 'right' }}>{s.trades}</td>
                  <td style={{ padding: '12px', color: '#10b981', textAlign: 'right', fontWeight: 'bold' }}>{s.winRate}%</td>
                  <td style={{ padding: '12px', color: '#10b981', textAlign: 'right', fontWeight: 'bold' }}>${s.profit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Trades */}
      <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '24px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Recent Trades</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d2d3a' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8' }}>Time</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8' }}>Strategy</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8' }}>Type</th>
                <th style={{ textAlign: 'right', padding: '12px', color: '#94a3b8' }}>Stake</th>
                <th style={{ textAlign: 'right', padding: '12px', color: '#94a3b8' }}>Profit</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#94a3b8' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr key={trade.id} style={{ borderBottom: '1px solid #2d2d3a' }}>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{trade.timestamp.toLocaleTimeString()}</td>
                  <td style={{ padding: '12px', color: 'white' }}>{trade.strategy || 'Manual'}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{trade.type}</td>
                  <td style={{ padding: '12px', color: 'white', textAlign: 'right' }}>${trade.stake.toFixed(2)}</td>
                  <td style={{ padding: '12px', color: trade.win ? '#10b981' : '#ef4444', textAlign: 'right', fontWeight: 'bold' }}>
                    ${trade.profit.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: trade.win ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                    {trade.win ? 'WIN' : 'LOSS'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;