type EventCallback = (data: any) => void;

class DerivService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, EventCallback[]> = new Map();
  private autoTradeInterval: any = null;
  private balance: number = 0;
  private isTrading: boolean = false;
  private lastDigit: number = 0;
  private currentPrice: number = 0;
  private stake: number = 0.35;
  private token: string = '';
  private isConnected: boolean = false;

  connect(token: string, isDemo: boolean = true): Promise<void> {
    this.token = token;
    console.log(`🔌 Connecting to Deriv ${isDemo ? 'DEMO' : 'REAL'} API...`);
    
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
        
        this.socket.onopen = () => {
          console.log('WebSocket open, authorizing...');
          if (token && token !== 'demo') {
            this.socket?.send(JSON.stringify({ authorize: token }));
          } else {
            this.socket?.send(JSON.stringify({ 
              new_account_virtual: 1,
              client_name: 'KXNGTRADER Bot',
              residence: 'us'
            }));
          }
        };

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('📨 Received:', data.msg_type);
          
          if (data.msg_type === 'authorize') {
            console.log('✅ Authorized! Balance:', data.authorize.balance);
            this.balance = data.authorize.balance;
            this.isConnected = true;
            this.emit('connected', { balance: this.balance });
            resolve();
            // Subscribe to ticks
            this.socket?.send(JSON.stringify({ ticks: 'R_100', subscribe: 1 }));
            // Subscribe to contract updates
            this.socket?.send(JSON.stringify({ subscribe: 1, proposal_open_contract: 1 }));
          }
          
          if (data.msg_type === 'new_account_virtual') {
            console.log('✅ Demo account created! Balance:', data.new_account_virtual.balance);
            this.balance = data.new_account_virtual.balance;
            this.isConnected = true;
            this.emit('connected', { balance: this.balance });
            resolve();
            this.socket?.send(JSON.stringify({ ticks: 'R_100', subscribe: 1 }));
            this.socket?.send(JSON.stringify({ subscribe: 1, proposal_open_contract: 1 }));
          }
          
          if (data.msg_type === 'tick') {
            this.currentPrice = data.tick.quote;
            this.lastDigit = Math.floor(this.currentPrice) % 10;
            this.emit('tick', { price: this.currentPrice, digit: this.lastDigit });
          }
          
          if (data.msg_type === 'buy') {
            console.log('✅ Trade placed!', data);
            this.emit('trade_placed', data);
          }
          
          if (data.msg_type === 'proposal_open_contract') {
            const contract = data.proposal_open_contract;
            console.log('📊 Contract update:', contract);
            
            if (contract.is_sold) {
              const profit = contract.profit;
              this.balance += profit;
              
              const tradeData = {
                id: contract.contract_id,
                type: contract.contract_type,
                stake: contract.buy_price,
                profit: profit,
                win: profit > 0,
                timestamp: new Date(contract.exit_tick_time || Date.now()),
                digit: Math.floor(contract.exit_tick || this.currentPrice) % 10
              };
              
              console.log('💰 TRADE COMPLETED:', tradeData);
              this.emit('trade', tradeData);
              this.emit('balance', { balance: this.balance });
            }
          }
          
          if (data.msg_type === 'proposal') {
            console.log('📊 Got proposal, buying...');
            this.socket?.send(JSON.stringify({ 
              buy: data.proposal.id, 
              price: data.proposal.ask_price 
            }));
          }
          
          if (data.msg_type === 'error') {
            console.error('❌ Error:', data.error);
            this.emit('error', data.error);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  createDemoAccount(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('🎮 Creating Deriv Demo Account...');
        this.socket = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
        
        this.socket.onopen = () => {
          this.socket?.send(JSON.stringify({ 
            new_account_virtual: 1,
            client_name: 'KXNGTRADER Bot',
            residence: 'us'
          }));
        };

        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.msg_type === 'new_account_virtual') {
            console.log('✅ Demo account created! Balance:', data.new_account_virtual.balance);
            this.balance = data.new_account_virtual.balance;
            this.isConnected = true;
            this.emit('connected', { balance: this.balance });
            resolve();
            this.socket?.send(JSON.stringify({ ticks: 'R_100', subscribe: 1 }));
            this.socket?.send(JSON.stringify({ subscribe: 1, proposal_open_contract: 1 }));
          }
          
          if (data.msg_type === 'tick') {
            this.currentPrice = data.tick.quote;
            this.lastDigit = Math.floor(this.currentPrice) % 10;
            this.emit('tick', { price: this.currentPrice, digit: this.lastDigit });
          }
          
          if (data.msg_type === 'error') {
            console.error('Error:', data.error);
            reject(data.error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  placeTrade(contract: any) {
    console.log('📤 Placing trade:', contract);
    
    const proposalRequest = {
      proposal: 1,
      amount: contract.amount,
      basis: contract.basis,
      contract_type: contract.contract_type,
      currency: contract.currency,
      duration: contract.duration,
      duration_unit: contract.duration_unit,
      symbol: contract.symbol
    };
    
    if (contract.barrier) {
      (proposalRequest as any).barrier = contract.barrier;
    }
    
    this.socket?.send(JSON.stringify(proposalRequest));
  }

  startAutoTrading(strategy: any, stakeAmount: number) {
    if (this.autoTradeInterval) {
      clearInterval(this.autoTradeInterval);
    }
    
    this.isTrading = true;
    this.stake = stakeAmount;
    
    console.log('🚀 STARTING AUTO TRADING! Every 3 seconds');
    
    this.autoTradeInterval = setInterval(() => {
      if (!this.isTrading) return;
      
      const tradeType = this.lastDigit % 2 === 0 ? 'DIGITODD' : 'DIGITEVEN';
      
      console.log(`🤖 Auto trade - Predicting ${tradeType}`);
      
      this.placeTrade({
        amount: this.stake,
        basis: 'stake',
        contract_type: tradeType,
        currency: 'USD',
        duration: 1,
        duration_unit: 't',
        symbol: 'R_100'
      });
    }, 3000);
  }

  stopAutoTrading() {
    this.isTrading = false;
    if (this.autoTradeInterval) {
      clearInterval(this.autoTradeInterval);
      this.autoTradeInterval = null;
    }
    console.log('🛑 Auto Trading Stopped');
  }

  resetStats() {
    console.log('Stats reset');
    this.emit('stats_reset', {});
  }

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(cb => {
      try { cb(data); } catch (e) { console.error(e); }
    });
  }

  disconnect() {
    this.stopAutoTrading();
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default DerivService;