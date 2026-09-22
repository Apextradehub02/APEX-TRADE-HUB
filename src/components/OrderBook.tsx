import React, { useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { Zap, Activity } from 'lucide-react';

export const OrderBook: React.FC = () => {
  const { selectedAsset, liveExecutions } = useTrading();

  // Generate synthetic order book depth around current price
  const { asks, bids } = useMemo(() => {
    const p = selectedAsset.currentPrice;
    const step = selectedAsset.spread || p * 0.0005;

    const asksList = [];
    for (let i = 5; i >= 1; i--) {
      const askPrice = p + i * step;
      const size = Math.floor(Math.random() * 45000) + 5000;
      asksList.push({ price: askPrice, size, total: 0 });
    }

    const bidsList = [];
    for (let i = 1; i <= 5; i++) {
      const bidPrice = Math.max(0.0001, p - i * step);
      const size = Math.floor(Math.random() * 45000) + 5000;
      bidsList.push({ price: bidPrice, size, total: 0 });
    }

    return { asks: asksList, bids: bidsList };
  }, [selectedAsset.currentPrice, selectedAsset.spread]);

  return (
    <div id="apex-order-book" className="bg-[#0e131d] rounded-xl border border-slate-800/80 flex flex-col h-full overflow-hidden shadow-lg p-3 text-xs select-none">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Market Depth (INR)</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Spread: <strong className="text-amber-300">₹{selectedAsset.spread}</strong>
        </span>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-2 text-[10px] font-mono text-slate-500 pb-1">
        <span>Price (₹)</span>
        <span className="text-right">Size (INR)</span>
      </div>

      {/* Asks (Sell Orders - Red) */}
      <div className="space-y-0.5 font-mono text-[11px] mb-1">
        {asks.map((ask, idx) => (
          <div key={`ask-${idx}`} className="relative flex justify-between py-0.5 px-1 rounded hover:bg-rose-500/10">
            <div
              className="absolute right-0 top-0 bottom-0 bg-rose-500/10 pointer-events-none rounded"
              style={{ width: `${Math.min(100, (ask.size / 50000) * 100)}%` }}
            />
            <span className="text-rose-400 relative z-10">
              {ask.price.toFixed(selectedAsset.decimals)}
            </span>
            <span className="text-slate-300 text-right relative z-10">
              ₹ {ask.size.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Mid Market Price Badge */}
      <div className="py-1.5 px-2 bg-[#090c13] rounded-lg border border-slate-800 my-1 flex items-center justify-between font-mono">
        <span className="text-[10px] text-slate-400 font-sans">Mid Market:</span>
        <span
          className={`font-bold text-xs ${
            selectedAsset.tickDirection === 'up'
              ? 'text-emerald-400'
              : selectedAsset.tickDirection === 'down'
              ? 'text-rose-400'
              : 'text-white'
          }`}
        >
          ₹ {selectedAsset.currentPrice.toFixed(selectedAsset.decimals)}
        </span>
      </div>

      {/* Bids (Buy Orders - Green) */}
      <div className="space-y-0.5 font-mono text-[11px]">
        {bids.map((bid, idx) => (
          <div key={`bid-${idx}`} className="relative flex justify-between py-0.5 px-1 rounded hover:bg-emerald-500/10">
            <div
              className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 pointer-events-none rounded"
              style={{ width: `${Math.min(100, (bid.size / 50000) * 100)}%` }}
            />
            <span className="text-emerald-400 relative z-10">
              {bid.price.toFixed(selectedAsset.decimals)}
            </span>
            <span className="text-slate-300 text-right relative z-10">
              ₹ {bid.size.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Real-time Indian Trader Execution Feed */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex-1 flex flex-col min-h-[140px]">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1.5">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Live Client Trades (1,500+ Daily)
          </span>
          <span className="text-[9px] text-emerald-400 font-mono">Real-Time</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 no-scrollbar">
          {liveExecutions.slice(0, 5).map((trade) => (
            <div
              key={trade.id}
              className="p-1.5 rounded-lg bg-[#080b11] border border-slate-800/60 flex items-center justify-between text-[10px] font-mono"
            >
              <div>
                <span className="text-white font-bold">{trade.traderName.split(' ')[0]}</span>{' '}
                <span className="text-slate-500">({trade.traderCity})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-bold px-1 py-0.2 rounded ${
                    trade.type === 'BUY'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {trade.type}
                </span>
                <span className="text-slate-300">₹{trade.amountInr.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
