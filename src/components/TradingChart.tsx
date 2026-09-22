import React, { useState, useMemo, useRef } from 'react';
import { useTrading } from '../context/TradingContext';
import { CandleData } from '../types';
import {
  Maximize2,
  TrendingUp,
  BarChart2,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const TradingChart: React.FC = () => {
  const { selectedAsset } = useTrading();
  const [chartType, setChartType] = useState<'candlestick' | 'area'>('candlestick');
  const [timeframe, setTimeframe] = useState<string>('5m');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const candles = selectedAsset.candleHistory;
  const isUp24h = selectedAsset.changePercent24h >= 0;

  // Compute min and max across high and low
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (!candles || candles.length === 0) {
      return { minPrice: selectedAsset.currentPrice * 0.99, maxPrice: selectedAsset.currentPrice * 1.01, priceRange: 1 };
    }
    let min = Infinity;
    let max = -Infinity;
    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    });

    const padding = (max - min) * 0.08 || min * 0.01;
    return {
      minPrice: min - padding,
      maxPrice: max + padding,
      priceRange: (max + padding) - (min - padding) || 1,
    };
  }, [candles, selectedAsset.currentPrice]);

  // Chart dimensions inside SVG viewBox (e.g. 800 x 360)
  const svgWidth = 800;
  const svgHeight = 360;
  const paddingRight = 70;
  const paddingBottom = 26;
  const chartWidth = svgWidth - paddingRight;
  const chartHeight = svgHeight - paddingBottom;

  const getY = (price: number) => {
    const ratio = (price - minPrice) / priceRange;
    return chartHeight - ratio * chartHeight;
  };

  const candleWidth = Math.max(4, (chartWidth / (candles.length || 1)) * 0.65);
  const candleGap = chartWidth / (candles.length || 1);

  // For Area Chart Path
  const areaPath = useMemo(() => {
    if (!candles || candles.length === 0) return '';
    const points = candles.map((c, idx) => {
      const x = idx * candleGap + candleGap / 2;
      const y = getY(c.close);
      return `${x},${y}`;
    });

    const firstX = candleGap / 2;
    const lastX = (candles.length - 1) * candleGap + candleGap / 2;

    return `M ${firstX},${chartHeight} L ${points.join(' L ')} L ${lastX},${chartHeight} Z`;
  }, [candles, candleGap, chartHeight, minPrice, priceRange]);

  const linePath = useMemo(() => {
    if (!candles || candles.length === 0) return '';
    const points = candles.map((c, idx) => {
      const x = idx * candleGap + candleGap / 2;
      const y = getY(c.close);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  }, [candles, candleGap, minPrice, priceRange]);

  // Current hovered candle data
  const activeCandle = hoveredIndex !== null && candles[hoveredIndex] ? candles[hoveredIndex] : candles[candles.length - 1];

  const currentPriceY = getY(selectedAsset.currentPrice);

  return (
    <div
      id="apex-trading-chart"
      ref={containerRef}
      className="bg-[#0e131d] rounded-xl border border-slate-800/80 flex flex-col h-full overflow-hidden shadow-lg select-none"
    >
      {/* Chart Top Bar */}
      <div className="px-4 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Asset Header Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base text-white tracking-wide">{selectedAsset.symbol}</h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
              {selectedAsset.category}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span
              className={`font-mono text-base font-extrabold transition-colors ${
                selectedAsset.tickDirection === 'up'
                  ? 'text-emerald-400'
                  : selectedAsset.tickDirection === 'down'
                  ? 'text-rose-400'
                  : 'text-white'
              }`}
            >
              ₹ {selectedAsset.currentPrice.toLocaleString(undefined, {
                minimumFractionDigits: selectedAsset.decimals,
                maximumFractionDigits: selectedAsset.decimals,
              })}
            </span>
            <span
              className={`font-mono text-xs font-semibold inline-flex items-center ${
                isUp24h ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isUp24h ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {isUp24h ? '+' : ''}
              {selectedAsset.changePercent24h.toFixed(2)}% (₹ {selectedAsset.change24h > 0 ? '+' : ''}
              {selectedAsset.change24h.toFixed(selectedAsset.decimals)})
            </span>
          </div>
        </div>

        {/* Chart View Controls & Timeframes */}
        <div className="flex items-center gap-2">
          {/* Candlestick vs Area switch */}
          <div className="bg-[#090c13] p-0.5 rounded-lg border border-slate-800 flex items-center">
            <button
              onClick={() => setChartType('candlestick')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                chartType === 'candlestick'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3 h-3" />
              <span>Candles</span>
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                chartType === 'area'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Area</span>
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="bg-[#090c13] p-0.5 rounded-lg border border-slate-800 flex items-center">
            {['1m', '5m', '15m', '1H', '1D'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  timeframe === tf ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* OHLC Bar */}
      {activeCandle && (
        <div className="px-4 py-1.5 bg-[#090c13]/70 border-b border-slate-800/40 flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400">
          <div>
            O: <span className="text-slate-200">₹{activeCandle.open.toFixed(selectedAsset.decimals)}</span>
          </div>
          <div>
            H: <span className="text-emerald-400">₹{activeCandle.high.toFixed(selectedAsset.decimals)}</span>
          </div>
          <div>
            L: <span className="text-rose-400">₹{activeCandle.low.toFixed(selectedAsset.decimals)}</span>
          </div>
          <div>
            C: <span className="text-slate-200">₹{activeCandle.close.toFixed(selectedAsset.decimals)}</span>
          </div>
          <div>
            Spread: <span className="text-amber-300">₹{selectedAsset.spread}</span>
          </div>
          <div className="ml-auto text-[10px] text-slate-500 font-sans">
            Fluctuations Live Every ~1.4s
          </div>
        </div>
      )}

      {/* SVG Interactive Canvas */}
      <div className="flex-1 w-full relative min-h-[300px]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width;
            const svgX = relX * svgWidth;
            const idx = Math.floor(svgX / candleGap);
            if (idx >= 0 && idx < candles.length) {
              setHoveredIndex(idx);
            }
          }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gridGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const y = chartHeight * ratio;
            const priceLevel = maxPrice - ratio * priceRange;
            return (
              <g key={ratio}>
                <line
                  x1="0"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#1e2638"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={chartWidth + 6}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                >
                  ₹{priceLevel.toFixed(selectedAsset.decimals > 1 ? 1 : 0)}
                </text>
              </g>
            );
          })}

          {/* Volume bars background */}
          {candles.map((c, idx) => {
            const x = idx * candleGap + candleGap / 2 - candleWidth / 2;
            const maxVol = 6000;
            const volHeight = Math.min(45, (c.volume / maxVol) * 45);
            const isGreen = c.close >= c.open;
            return (
              <rect
                key={`vol-${idx}`}
                x={x}
                y={chartHeight - volHeight}
                width={candleWidth}
                height={volHeight}
                fill={isGreen ? '#10b981' : '#ef4444'}
                opacity={0.18}
              />
            );
          })}

          {/* Area or Candlesticks */}
          {chartType === 'area' ? (
            <>
              <path d={areaPath} fill="url(#areaGradient)" />
              <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.2" />
            </>
          ) : (
            candles.map((c, idx) => {
              const xCenter = idx * candleGap + candleGap / 2;
              const x = xCenter - candleWidth / 2;
              const yOpen = getY(c.open);
              const yClose = getY(c.close);
              const yHigh = getY(c.high);
              const yLow = getY(c.low);

              const isGreen = c.close >= c.open;
              const color = isGreen ? '#10b981' : '#ef4444';
              const bodyY = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

              return (
                <g key={`candle-${idx}`}>
                  {/* Wick */}
                  <line
                    x1={xCenter}
                    y1={yHigh}
                    x2={xCenter}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x}
                    y={bodyY}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })
          )}

          {/* Live Market Price Horizontal Line & Tag */}
          <line
            x1="0"
            y1={currentPriceY}
            x2={chartWidth}
            y2={currentPriceY}
            stroke={selectedAsset.tickDirection === 'up' ? '#10b981' : '#ef4444'}
            strokeDasharray="2 2"
            strokeWidth="1.2"
          />

          {/* Live Price Tag on Y-Axis */}
          <g transform={`translate(${chartWidth}, ${currentPriceY - 10})`}>
            <rect
              x="0"
              y="0"
              width={paddingRight}
              height="20"
              fill={selectedAsset.tickDirection === 'up' ? '#10b981' : '#ef4444'}
              rx="3"
            />
            <text
              x="6"
              y="13"
              fill="#ffffff"
              fontSize="9"
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
            >
              ₹{selectedAsset.currentPrice.toFixed(selectedAsset.decimals > 2 ? 2 : selectedAsset.decimals)}
            </text>
          </g>

          {/* Crosshair when hovering */}
          {hoveredIndex !== null && (
            <g>
              <line
                x1={hoveredIndex * candleGap + candleGap / 2}
                y1="0"
                x2={hoveredIndex * candleGap + candleGap / 2}
                y2={chartHeight}
                stroke="#94a3b8"
                strokeDasharray="2 2"
                strokeWidth="0.8"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
