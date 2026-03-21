import React, { useEffect, useRef } from 'react';
import './CandlestickChart.css';

interface CandlestickChartProps {
  data: any[];
  height: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 40, right: 40, bottom: 40, left: 60 };
    const chartWidth = w - padding.left - padding.right;
    const chartHeight = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = '#2d2d3a';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight;
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
    }
    
    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (i / 10) * chartWidth;
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, h - padding.bottom);
    }
    ctx.stroke();

    const validData = data.filter(d => d && d.high && d.low);
    if (validData.length === 0) return;

    const prices = validData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices) * 0.995;
    const maxPrice = Math.max(...prices) * 1.005;
    const priceRange = maxPrice - minPrice;

    const candleWidth = Math.max(2, Math.min(8, (chartWidth / validData.length) - 2));
    const spacing = Math.max(1, (chartWidth - candleWidth * validData.length) / (validData.length + 1));

    validData.slice(-50).forEach((candle, i) => {
      const x = padding.left + spacing + i * (candleWidth + spacing);
      
      const openY = padding.top + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
      const closeY = padding.top + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
      const highY = padding.top + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
      const lowY = padding.top + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;

      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.strokeStyle = '#94a3b8';
      ctx.stroke();

      const isGreen = candle.close >= candle.open;
      ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
      
      const top = Math.min(openY, closeY);
      const bottom = Math.max(openY, closeY);
      ctx.fillRect(x, top, candleWidth, Math.max(1, bottom - top));
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Arial';
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - (i / 5) * priceRange;
      const y = padding.top + (i / 5) * chartHeight - 5;
      ctx.fillText(price.toFixed(2), 5, y);
    }

    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('KXNGTRADER Live Chart', padding.left, 25);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Arial';
    ctx.fillText('← Older', padding.left, h - 10);
    ctx.fillText('Newer →', w - 70, h - 10);

  }, [data]);

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