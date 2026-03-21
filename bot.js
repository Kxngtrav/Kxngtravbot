const socket = io();
let priceChart;
let priceData = [];
let timeLabels = [];

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    setupEventListeners();
    setupDigitDistribution();
    socket.emit('subscribe_ticks', 'R_75');
});

function initChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Price',
                data: priceData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: { 
                x: { display: false }, 
                y: { grid: { color: '#2d3340' } } 
            },
            plugins: { legend: { display: false } }
        }
    });
}

function setupEventListeners() {
    const symbolSelect = document.getElementById('symbolSelect');
    if (symbolSelect) {
        symbolSelect.addEventListener('change', (e) => {
            socket.emit('subscribe_ticks', e.target.value);
            document.querySelector('.ticker-symbol').textContent = e.target.value;
        });
    }

    const hedgeBtn = document.getElementById('startHedgeBtn');
    if (hedgeBtn) {
        hedgeBtn.addEventListener('click', () => {
            const stake = document.getElementById('hedgeStake').value;
            const duration = document.getElementById('hedgeDuration').value;
            const symbol = document.getElementById('symbolSelect').value;
            
            socket.emit('place_hedge', {
                amount: parseFloat(stake),
                duration: parseInt(duration),
                symbol: symbol
            });
            
            const hedgeDisplay = document.getElementById('activeHedgeDisplay');
            if (hedgeDisplay) {
                hedgeDisplay.style.display = 'flex';
            }
            
            alert('Hedge strategy activated! Trading both directions simultaneously.');
        });
    }

    document.querySelectorAll('.activate-strategy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const strategy = e.target.closest('button').dataset.strategy;
            alert(`${strategy} strategy activated! The AI will now trade using this strategy.`);
        });
    });

    const aiTradingBtn = document.getElementById('startAITrading');
    if (aiTradingBtn) {
        aiTradingBtn.addEventListener('click', () => {
            alert('AI Trading Started! The bot will now automatically trade based on active strategies.');
        });
    }
}

function setupDigitDistribution() {
    const grid = document.getElementById('digitDistribution');
    if (!grid) return;
    
    for (let i = 0; i <= 9; i++) {
        const div = document.createElement('div');
        div.className = 'digit-item';
        div.innerHTML = `<span class="digit-number">${i}</span>
                        <span class="digit-percent" id="digit-${i}">0%</span>`;
        grid.appendChild(div);
    }
}

socket.on('connect', () => {
    console.log('Connected to server');
    const statusEl = document.getElementById('connectionStatus');
    if (statusEl) {
        statusEl.innerHTML = '<i class="fas fa-circle" style="color: #22c55e;"></i> Connected to Deriv';
    }
});

socket.on('tick', (data) => {
    const priceEl = document.getElementById('currentPrice');
    const digitEl = document.getElementById('currentDigit')?.querySelector('.digit-value');
    const changeEl = document.getElementById('priceChange');
    
    if (priceEl) {
        if (priceData.length > 0) {
            const lastPrice = priceData[priceData.length - 1];
            const change = data.price - lastPrice;
            if (changeEl) {
                changeEl.textContent = (change > 0 ? '+' : '') + change.toFixed(4);
                changeEl.className = 'ticker-change ' + (change >= 0 ? 'positive' : 'negative');
            }
        }
        priceEl.textContent = data.price.toFixed(4);
    }
    
    if (digitEl) digitEl.textContent = data.digit;
    
    priceData.push(data.price);
    timeLabels.push(new Date(data.epoch * 1000).toLocaleTimeString());
    
    if (priceData.length > 50) {
        priceData.shift();
        timeLabels.shift();
    }
    
    if (priceChart) {
        priceChart.data.labels = timeLabels;
        priceChart.data.datasets[0].data = priceData;
        priceChart.update();
    }
    
    updateDigitDistribution(data.digit);
});

let digitCounts = new Array(10).fill(0);
let totalTicks = 0;

function updateDigitDistribution(digit) {
    digitCounts[digit]++;
    totalTicks++;
    
    for (let i = 0; i <= 9; i++) {
        const percent = totalTicks > 0 ? ((digitCounts[i] / totalTicks) * 100).toFixed(1) : 0;
        const el = document.getElementById(`digit-${i}`);
        if (el) el.textContent = percent + '%';
    }
}

socket.on('balance', (data) => {
    const balanceEl = document.querySelector('.balance-amount');
    if (balanceEl) {
        balanceEl.textContent = `$${data.balance.toFixed(2)}`;
    }
});