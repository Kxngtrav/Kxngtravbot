const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', version: '2.0.0', name: 'KXNGTRADER Elite' });
});

app.post('/api/connect/deriv', (req, res) => {
  const { token, isReal } = req.body;
  // Handle Deriv connection logic
  res.json({ success: true, message: 'Connected to Deriv', token: token.substring(0, 8) + '...' });
});

app.post('/api/connect/mt5', (req, res) => {
  const { login, password, server } = req.body;
  // Handle MT5 connection logic
  res.json({ success: true, message: 'Connected to MT5', account: login });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 KXNGTRADER Elite running on port ${PORT}`);
  console.log(`📊 Server: http://localhost:${PORT}`);
});

// WebSocket for real-time data
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('subscribe', (symbol) => {
    console.log(`Client ${socket.id} subscribed to ${symbol}`);
    // Start sending real-time data
    startSendingData(socket, symbol);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

function startSendingData(socket, symbol) {
  let price = symbol.includes('R_') ? 1234.56 : 1.23456;
  
  const interval = setInterval(() => {
    // Generate realistic price movement
    const change = (Math.random() - 0.5) * 2;
    price += change;
    
    // Create candle data
    const candle = {
      time: Date.now(),
      open: price - Math.random() * 0.5,
      high: price + Math.random() * 0.8,
      low: price - Math.random() * 0.8,
      close: price,
      volume: Math.floor(Math.random() * 1000) + 500
    };
    
    socket.emit('tick', { symbol, price, time: Date.now() });
    socket.emit('candle', { symbol, candle });
  }, 1000);
  
  socket.on('disconnect', () => {
    clearInterval(interval);
  });
}