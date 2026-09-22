import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { Search, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

export const MarketWatch: React.FC = () => {
  const { assets, selectedAsset, setSelectedAssetId } = useTrading();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Forex', 'Commodities', 'Crypto', 'Indices'];

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesCategory = activeCategory === 'All' || asset.category === activeCategory;
      const matchesSearch =
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [assets, activeCategory, searchQuery]);

  return (
    <div id="market-watch-panel" className="bg-[#0e131d] rounded-xl border border-slate-800/80 flex flex-col h-full overflow-hidden shadow-lg">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Market Watch (INR)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {filteredAssets.length} Pairs
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="market-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search USD, Gold, BTC..."
            className="w-full bg-[#080b11] border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                activeCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredAssets.map((asset) => {
          const isSelected = asset.id === selectedAsset.id;
          const isUp = asset.changePercent24h >= 0;

          return (
            <div
              key={asset.id}
              onClick={() => setSelectedAssetId(asset.id)}
              className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-slate-800/70 border-l-2 border-emerald-400'
                  : 'hover:bg-slate-800/30'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white tracking-wide">{asset.symbol}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                    {asset.category}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {asset.name}
                </div>
              </div>

              {/* Price & Change */}
              <div className="text-right space-y-0.5">
                <div
                  className={`font-mono text-xs font-bold transition-colors ${
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
                </div>
                <div
                  className={`inline-flex items-center text-[10px] font-mono px-1 py-0.2 rounded ${
                    isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />}
                  {isUp ? '+' : ''}
                  {asset.changePercent24h.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}

        {filteredAssets.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-500">
            No assets match "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
