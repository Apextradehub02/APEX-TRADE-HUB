import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { OrderType } from '../types';
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Zap,
  ArrowRight,
} from 'lucide-react';

export const OrderTerminal: React.FC = () => {
  const {
    selectedAsset,
    userBalanceInr,
    availableMarginInr,
    openPosition,
    setIsDepositModalOpen,
    isAuthenticated,
    setIsLoginModalOpen,
  } = useTrading();

  const [orderType, setOrderType] = useState<OrderType>('BUY');
  const [marginInr, setMarginInr] = useState<number>(10000); // ₹10,000 INR preset
  const [leverage, setLeverage] = useState<number>(10);
  const [stopLossPercent, setStopLossPercent] = useState<number>(5);
  const [takeProfitPercent, setTakeProfitPercent] = useState<number>(15);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const presets = [5000, 10000, 20000, 50000];
  const leverages = [1, 5, 10, 20, 50];

  // Calculated values in INR
  const totalNotionalInr = marginInr * leverage;
  const assetUnits = totalNotionalInr / (selectedAsset.currentPrice || 1);

  // Liquidation calculation
  const liquidationPrice =
    orderType === 'BUY'
      ? selectedAsset.currentPrice * (1 - 0.9 / leverage)
      : selectedAsset.currentPrice * (1 + 0.9 / leverage);

  const handleExecute = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      setNotification({
        message: 'Terminal locked. Please sign in with User ID: ZXCV1234 to trade.',
        type: 'error'
      });
      return;
    }

    const res = openPosition(
      selectedAsset.id,
      orderType,
      marginInr,
      leverage,
      stopLossPercent,
      takeProfitPercent
    );

    if (res.success) {
      setNotification({ message: res.message, type: 'success' });
    } else {
      setNotification({ message: res.message, type: 'error' });
    }

    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const hasEnoughMargin = availableMarginInr >= marginInr;

  return (
    <div id="apex-order-terminal" className="bg-[#0e131d] rounded-xl border border-slate-800/80 flex flex-col h-full overflow-hidden shadow-lg p-3 sm:p-4 select-none">
      {/* Terminal Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Execution Terminal</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Avail: <strong className="text-white">₹ {availableMarginInr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </span>
      </div>

      {/* Order Side Selector (BUY/LONG vs SELL/SHORT) */}
      <div className="grid grid-cols-2 gap-2 my-3">
        <button
          id="order-buy-toggle"
          onClick={() => setOrderType('BUY')}
          className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            orderType === 'BUY'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>BUY / LONG</span>
        </button>

        <button
          id="order-sell-toggle"
          onClick={() => setOrderType('SELL')}
          className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            orderType === 'SELL'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          <span>SELL / SHORT</span>
        </button>
      </div>

      {/* Margin Amount in INR */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Deposit Margin (INR)</span>
          <span className="font-mono text-slate-300">₹ {marginInr.toLocaleString()}</span>
        </div>

        {/* Quick Presets (10,000, 20,000 emphasized) */}
        <div className="grid grid-cols-4 gap-1.5">
          {presets.map((amt) => (
            <button
              key={amt}
              onClick={() => setMarginInr(amt)}
              className={`py-1 rounded-md text-[10px] font-mono font-bold transition-colors cursor-pointer border ${
                marginInr === amt
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-800'
              }`}
            >
              ₹ {(amt / 1000).toFixed(0)}k
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="relative mt-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">₹</span>
          <input
            id="order-margin-input"
            type="number"
            min="500"
            step="1000"
            value={marginInr || ''}
            onChange={(e) => setMarginInr(Math.max(0, Number(e.target.value)))}
            placeholder="e.g. 10000 or 20000"
            className="w-full bg-[#090c13] border border-slate-800 rounded-lg pl-7 pr-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/60"
          />
        </div>
      </div>

      {/* Leverage Selector */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Multiplier Leverage</span>
          <span className="font-mono text-emerald-400 font-bold">{leverage}x</span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {leverages.map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={`py-1 rounded-md text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                leverage === lev
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lev}x
            </button>
          ))}
        </div>
      </div>

      {/* Trade Summary Details */}
      <div className="bg-[#090c13] rounded-lg p-2.5 space-y-1.5 text-[11px] border border-slate-800/80 mb-3 font-mono">
        <div className="flex items-center justify-between text-slate-400">
          <span>Notional Value:</span>
          <span className="text-slate-100 font-bold">₹ {totalNotionalInr.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Asset Units:</span>
          <span className="text-slate-200">{assetUnits.toFixed(4)} {selectedAsset.symbol.split('/')[0]}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Entry Price:</span>
          <span className="text-emerald-400">₹ {selectedAsset.currentPrice.toFixed(selectedAsset.decimals)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Est. Liq Price:</span>
          <span className="text-rose-400">₹ {liquidationPrice.toFixed(selectedAsset.decimals)}</span>
        </div>
      </div>

      {/* Quick Deposit Prompt if low margin */}
      {!hasEnoughMargin && (
        <div className="mb-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Need ₹ {marginInr.toLocaleString()}</span>
          </div>
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Deposit ₹
          </button>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`mb-3 p-2 rounded-lg text-xs font-medium border ${
            notification.type === 'success'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Big Action Button */}
      <button
        id="execute-trade-button"
        onClick={handleExecute}
        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 ${
          orderType === 'BUY'
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30'
            : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-900/30'
        }`}
      >
        <span>Execute {orderType} ({leverage}x)</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Quick Deposit Fast-actions for ₹10k & ₹20k */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Instant Deposit:</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 font-bold text-[10px] bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded transition-colors cursor-pointer"
          >
            +₹10,000
          </button>
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 font-bold text-[10px] bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded transition-colors cursor-pointer"
          >
            +₹20,000
          </button>
        </div>
      </div>
    </div>
  );
};
