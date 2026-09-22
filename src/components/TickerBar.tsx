import React from 'react';
import { useTrading } from '../context/TradingContext';
import { ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';

export const TickerBar: React.FC = () => {
  const { assets, selectedAsset, setSelectedAssetId, liveExecutions } = useTrading();

  return (
    <div id="apex-ticker-bar" className="bg-[#0a0c12] border-b border-slate-800/60 overflow-hidden py-1.5 px-2 text-xs flex items-center select-none">
      {/* Live Trader Activity Snippet */}
      <div className="hidden md:flex items-center gap-2 pl-2 pr-3 py-0.5 border-r border-slate-800 shrink-0 text-[11px]">
        <span className="flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
          <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
          Indian Desk Live
        </span>
        {liveExecutions.length > 0 && (
          <div className="text-slate-300 max-w-[260px] truncate">
            <span className="font-medium text-white">{liveExecutions[0].traderName}</span> ({liveExecutions[0].traderCity}){' '}
            <span className={liveExecutions[0].type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>
              {liveExecutions[0].type}
            </span>{' '}
            {liveExecutions[0].assetSymbol} ₹{liveExecutions[0].amountInr.toLocaleString()}
          </div>
        )}
      </div>

      {/* Scrolling Assets Ticker */}
      <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-3 px-2">
        {assets.map((asset) => {
          const isSelected = asset.id === selectedAsset.id;
          const isUp = asset.changePercent24h >= 0;

          return (
            <button
              key={asset.id}
              onClick={() => setSelectedAssetId(asset.id)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-slate-800/90 border-slate-700 text-white shadow-sm'
                  : 'bg-slate-900/40 border-slate-800/40 text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <span className="font-bold text-[11px] text-slate-200">{asset.symbol}</span>
              <span
                className={`font-mono text-xs font-semibold ${
                  asset.tickDirection === 'up'
                    ? 'text-emerald-400'
                    : asset.tickDirection === 'down'
                    ? 'text-rose-400'
                    : 'text-slate-200'
                }`}
              >
                ₹ {asset.currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: asset.decimals,
                  maximumFractionDigits: asset.decimals,
                })}
              </span>

              <span
                className={`flex items-center text-[10px] font-mono px-1 py-0.2 rounded ${
                  isUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                }`}
              >
                {isUp ? <ArrowUpRight className="w-2.5 h-2.5 inline" /> : <ArrowDownRight className="w-2.5 h-2.5 inline" />}
                {isUp ? '+' : ''}
                {asset.changePercent24h.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
