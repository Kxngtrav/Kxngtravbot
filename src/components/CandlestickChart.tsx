import React, { useEffect, useRef } from 'react';
import './CandlestickChart.css';

interface CandlestickChartProps {
  data: any[];
  height: number;
  showVolume?: boolean;
  timeframe?: '1m' | '5m' | '15m' | '1h';
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ 
  data, 
  height, 
  showVolume = true,
  timeframe = '1m'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 40, right: 40, bottom: showVolume ? 80 : 40, left: 60 };
    const chartWidth = w - padding.left - padding.right;
    const chartHeight = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = '#2d2d3a';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight;
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      const priceLabel = (() => {
        if (!data.length) return '';
        const prices = data.flatMap(d => [d.high, d.low]);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const price = maxPrice - (i / 5) * (maxPrice - minPrice);
        return price.toFixed(2);
      })();
      ctx.fillText(priceLabel, 5, y - 5);
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (i / 10) * chartWidth;
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, h - (showVolume ? padding.bottom - 40 : padding.bottom));
    }
    ctx.stroke();

    // Draw candles
    const validData = data.filter(d => d && d.high && d.low);
    if (validData.length === 0) return;

    const prices = validData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices) * 0.995;
    const maxPrice = Math.max(...prices) * 1.005;
    const priceRange = maxPrice - minPrice;

    const candleWidth = Math.max(2, Math.min(8, (chartWidth / validData.length) - 2));
    const spacing = Math.max(1, (chartWidth - candleWidth * validData.length) / (validData.length + 1));

    // Volume scaling
    const maxVolume = Math.max(...validData.map(d => d.volume || 1), 1);
    const volumeHeight = 40;

    validData.slice(-50).forEach((candle, i) => {
      const x = padding.left + spacing + i * (candleWidth + spacing);
      
      const openY = padding.top + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
      const closeY = padding.top + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
      const highY = padding.top + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
      const lowY = padding.top + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;

      // Draw wick
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.strokeStyle = '#94a3b8';
      ctx.stroke();

      // Draw candle body
      const isGreen = candle.close >= candle.open;
      ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
      
      const top = Math.min(openY, closeY);
      const bottom = Math.max(openY, closeY);
      ctx.fillRect(x, top, candleWidth, Math.max(1, bottom - top));

      // Draw volume bars
      if (showVolume && candle.volume) {
        const volumeBarHeight = (candle.volume / maxVolume) * volumeHeight;
        const volumeY = h - padding.bottom + 10 + (volumeHeight - volumeBarHeight);
        ctx.fillStyle = isGreen ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)';
        ctx.fillRect(x, volumeY, candleWidth, volumeBarHeight);
      }
    });

    // Draw time labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    const timeLabels = ['1m', '5m', '15m', '30m', '1h'];
    timeLabels.forEach((label, idx) => {
      const x = padding.left + (idx / 4) * chartWidth;
      ctx.fillText(label, x, h - (showVolume ? 15 : 25));
    });

    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`KXNGTRADER Live Chart (${timeframe})`, padding.left, 20);

    // Draw current price line
    if (validData.length > 0) {
      const currentPrice = validData[validData.length - 1].close;
      const currentY = padding.top + chartHeight - ((currentPrice - minPrice) / priceRange) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, currentY);
      ctx.lineTo(w - padding.right, currentY);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#3b82f6';
      ctx.font = '10px monospace';
      ctx.fillText(`Current: $${currentPrice.toFixed(2)}`, w - 120, currentY - 5);
    }

  }, [data, showVolume, timeframe]);

  return (
    <div className="chart-container">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={height}
        className="candlestick-chart"
      />
    </div>
  );
};

export default CandlestickChart;