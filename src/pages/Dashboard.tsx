import React, { useState, useEffect, useRef } from 'react';
import CandlestickChart from '../components/CandlestickChart';
import TradingControls from '../components/TradingControls';
import RecentTrades from '../components/RecentTrades';
import StrategySelector from '../components/StrategySelector';
import AccountInfo from '../components/AccountInfo';
import DerivService from '../services/DerivService';
import './Dashboard.css';

interface DashboardProps {
  apiToken: string;
  accountType: 'demo' | 'real';
  platform: 'deriv' | 'mt5';
}

const Dashboard: React.FC<DashboardProps> = ({ apiToken, accountType, platform }) => {
  const [currentPrice, setCurrentPrice] = useState(1234.56);
  const [lastDigit, setLastDigit] = useState(4);
  const [digitHistory, setDigitHistory] = useState<number[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [balance, setBalance] = useState(accountType === 'demo' ? 10000 : 0);
  const [connected, setConnected] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [isTrading, setIsTrading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const derivService = useRef<DerivService | null>(null);

  // Reset stats function
  const resetStats = () => {
    setTrades([]);
    if (derivService.current) {
      derivService.current.resetStats();
    }
    console.log('Stats reset');
  };

  // Generate initial chart data
  useEffect(() => {
    const initialData = [];
    let price = 1234.56;
    for (let i = 0; i < 50; i++) {
      price += (Math.random() - 0.5) * 2;
      initialData.push({
        time: Date.now() - (50 - i) * 60000,
        open: price - Math.random(),
        high: price + Math.random(),
        low: price - Math.random(),
        close: price,
        volume: Math.floor(Math.random() * 1000)
      });
    }
    setChartData(initialData);
  }, []);

  // Initialize Deriv service and connect
  useEffect(() => {
    console.log('Initializing Deriv service...');
    console.log('Account Type:', accountType);
    console.log('API Token:', apiToken ? `${apiToken.substring(0, 8)}...` : 'No token');

    // Create new Deriv service instance
    derivService.current = new DerivService();

    // Connect to Deriv
    const connectToDeriv = async () => {
      try {
        setConnectionError(null);
        
        if (accountType === 'demo' && !apiToken) {
          console.log('Creating new Deriv demo account...');
          await derivService.current?.createDemoAccount();
          setConnected(true);
          setBalance(10000);
          console.log('Demo account created successfully');
        } else {
          console.log('Connecting with token...');
          await derivService.current?.connect(apiToken, accountType === 'demo');
          setConnected(true);
        }
      } catch (err: any) {
        console.error('Connection error:', err);
        setConnectionError(err.message || 'Failed to connect to Deriv');
        setConnected(false);
      }
    };

    connectToDeriv();

    // Set up event listeners
    if (derivService.current) {
      // Balance updates
      derivService.current.on('connected', (data: any) => {
        console.log('Connected event received:', data);
        setConnected(true);
        if (data.balance) {
          setBalance(data.balance);
        }
        setConnectionError(null);
      });

      // Tick updates
      derivService.current.on('tick', (data: any) => {
        if (data && data.price) {
          setCurrentPrice(data.price);
          const digit = Math.floor(data.price) % 10;
          setLastDigit(digit);
          
          // Update digit history for TradeX strategy
          setDigitHistory(prev => {
            const newHistory = [...prev, digit];
            // Keep last 100 digits
            if (newHistory.length > 100) newHistory.shift();
            return newHistory;
          });
          
          // Update chart data
          setChartData(prev => {
            const newData = [...prev];
            const lastCandle = newData[newData.length - 1];
            const now = Date.now();
            const minuteTime = Math.floor(now / 60000) * 60000;
            
            if (!lastCandle || lastCandle.time !== minuteTime) {
              newData.push({
                time: minuteTime,
                open: data.price,
                high: data.price,
                low: data.price,
                close: data.price,
                volume: 1
              });
            } else {
              lastCandle.high = Math.max(lastCandle.high, data.price);
              lastCandle.low = Math.min(lastCandle.low, data.price);
              lastCandle.close = data.price;
              lastCandle.volume += 1;
            }
            return newData.slice(-100);
          });
        }
      });

      // Candle updates
      derivService.current.on('candle', (data: any) => {
        if (data && data.candle) {
          setChartData(prev => [...prev.slice(-100), data.candle]);
        }
      });

      // TRADE UPDATES - Shows trades in Recent Trades table
      derivService.current.on('trade', (trade: any) => {
        console.log('✅ Trade received in Dashboard:', trade);
        setTrades(prev => {
          const newTrades = [trade, ...prev.slice(0, 49)];
          console.log('📊 Updated trades count:', newTrades.length);
          return newTrades;
        });
        if (trade.profit) {
          setBalance(prev => prev + trade.profit);
        }
      });

      // Balance updates
      derivService.current.on('balance', (data: any) => {
        if (data && data.balance) {
          setBalance(data.balance);
        }
      });

      // Error updates
      derivService.current.on('error', (error: any) => {
        console.error('Deriv error:', error);
        setConnectionError(error.message || 'Trading error occurred');
      });
    }

    // Cleanup on unmount
    return () => {
      if (derivService.current) {
        derivService.current.disconnect();
      }
    };
  }, [apiToken, accountType]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>KXNG<span>TRADER</span></h1>
          <p className="subtitle">Elite Trading Dashboard</p>
          {connectionError && (
            <div style={{
              marginTop: '8px',
              padding: '6px 12px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '0.8rem'
            }}>
              ⚠️ {connectionError}
            </div>
          )}
        </div>
        <AccountInfo 
          balance={balance} 
          lastDigit={lastDigit} 
          currentPrice={currentPrice}
          connected={connected}
          accountType={accountType}
          platform={platform}
        />
      </div>

      <div className="dashboard-grid">
        <div className="grid-item chart-container">
          <CandlestickChart data={chartData} height={450} />
        </div>

        <div className="grid-item strategy-container">
          <StrategySelector 
            onSelectStrategy={setSelectedStrategy} 
            selectedStrategy={selectedStrategy}
            platform={platform}
          />
        </div>

        <div className="grid-item controls-container">
          <TradingControls 
            isTrading={isTrading}
            setIsTrading={setIsTrading}
            selectedStrategy={selectedStrategy}
            lastDigit={lastDigit}
            currentPrice={currentPrice}
            derivService={derivService.current}
            connected={connected}
            onResetStats={resetStats}
            accountType={accountType}
            balance={balance}
            digitHistory={digitHistory}
          />
        </div>

        <div className="grid-item trades-container">
          <RecentTrades trades={trades} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;