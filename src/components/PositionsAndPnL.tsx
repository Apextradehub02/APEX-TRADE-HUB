import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import {
  TrendingUp,
  TrendingDown,
  XCircle,
  History,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { SEEDED_TRADE_HISTORY, HistoricalTradeRecord } from '../data/mockTradeHistory';
import { SEEDED_DEPOSITS, SeededDepositRecord } from '../data/mockDeposits';

export const PositionsAndPnL: React.FC = () => {
  const {
    positions,
    closedPositions,
    deposits,
    closePosition,
    totalUnrealizedPnL,
    totalEquityInr,
    usedMarginInr,
    currentUser,
    tradeHistoryCount,
    tradeHistoryDirection,
    depositsCount,
    depositsDirection,
  } = useTrading();

  const [activeTab, setActiveTab] = useState<'positions' | 'history' | 'deposits'>('positions');
  const [historyScope, setHistoryScope] = useState<'all' | 'my'>('all');
  const [depositsScope, setDepositsScope] = useState<'all' | 'my'>('all');

  const isProfitable = totalUnrealizedPnL >= 0;

  // Combine user closed positions with market trade history
  const combinedHistory: HistoricalTradeRecord[] = useMemo(() => {
    const userTrades: HistoricalTradeRecord[] = closedPositions.map((c) => ({
      id: c.id,
      traderName: `${currentUser.name} (You)`,
      traderCity: currentUser.city.split(',')[0],
      assetSymbol: c.assetSymbol,
      type: c.type,
      amountInr: c.amountInr,
      entryPrice: c.entryPrice,
      closePrice: c.closePrice,
      realizedPnL: c.realizedPnL,
      pnlPercent: c.pnlPercent,
      closedAt: c.closedAt,
      isUserTrade: true,
    }));

    return [...userTrades, ...SEEDED_TRADE_HISTORY];
  }, [closedPositions, currentUser.name, currentUser.city]);

  // Combine user deposits with market inbound deposits
  const combinedDeposits: SeededDepositRecord[] = useMemo(() => {
    const userDeposits: SeededDepositRecord[] = deposits.map((d) => ({
      id: d.id,
      depositorName: `${currentUser.name} (You)`,
      city: currentUser.city.split(',')[0],
      amountInr: d.amountInr,
      method: d.method,
      status: d.status,
      timestamp: d.timestamp,
      transactionRef: d.transactionRef,
      isUserDeposit: true,
    }));

    return [...userDeposits, ...SEEDED_DEPOSITS];
  }, [deposits, currentUser.name, currentUser.city]);

  return (
    <div id="apex-positions-panel" className="bg-[#0e131d] rounded-xl border border-slate-800/80 flex flex-col h-full overflow-hidden shadow-lg select-none">
      {/* Tab Navigation & Live P&L Summary */}
      <div className="px-4 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#0b0e16]">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          {/* Open Positions Tab */}
          <button
            id="tab-open-positions"
            onClick={() => setActiveTab('positions')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'positions'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Positions</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
              {positions.length}
            </span>
          </button>

          {/* Trade History Tab (Fluctuates between 370 and 400) */}
          <button
            id="tab-closed-history"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span>Trade History</span>
            <span
              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold flex items-center gap-0.5 transition-all border ${
                tradeHistoryDirection === 'up'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
              title="Trade history fluctuating between 370 and 400"
            >
              <span>{tradeHistoryDirection === 'up' ? '▲' : '▼'}</span>
              <span>{tradeHistoryCount}</span>
            </span>
          </button>

          {/* Deposits (INR) Tab (Fluctuates between 370 and 400) */}
          <button
            id="tab-deposits-history"
            onClick={() => setActiveTab('deposits')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'deposits'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Deposits (INR)</span>
            <span
              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold flex items-center gap-0.5 transition-all border ${
                depositsDirection === 'up'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
              title="Deposits fluctuating between 370 and 400"
            >
              <span>{depositsDirection === 'up' ? '▲' : '▼'}</span>
              <span>{depositsCount}</span>
            </span>
          </button>
        </div>

        {/* Global Summary Bar */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:block">
            <span className="text-slate-500 mr-1.5 font-sans">Used Margin:</span>
            <span className="text-slate-200 font-bold">₹ {usedMarginInr.toLocaleString()}</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-slate-500 mr-1.5 font-sans">Equity:</span>
            <span className="text-slate-100 font-bold">₹ {totalEquityInr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center gap-1 bg-[#070a10] px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-sans text-[11px]">Total Live P&L:</span>
            <span
              className={`font-bold flex items-center ${
                isProfitable ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isProfitable ? '+' : ''}₹ {totalUnrealizedPnL.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-[#0a0d14]">
        {/* Open Positions Table */}
        {activeTab === 'positions' && (
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#080b12] text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Instrument</th>
                <th className="py-2.5 px-3">Side</th>
                <th className="py-2.5 px-3">Margin (INR)</th>
                <th className="py-2.5 px-3">Lev.</th>
                <th className="py-2.5 px-3">Entry Price</th>
                <th className="py-2.5 px-3">Current Price</th>
                <th className="py-2.5 px-3">Unrealized P&L</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {positions.map((pos) => {
                const isPosProfit = pos.unrealizedPnL >= 0;
                return (
                  <tr key={pos.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Instrument */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{pos.assetSymbol}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({pos.openedAt})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {pos.units.toFixed(4)} Units
                      </div>
                    </td>

                    {/* Side */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          pos.type === 'BUY'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {pos.type}
                      </span>
                    </td>

                    {/* Margin in INR */}
                    <td className="py-3 px-3 text-slate-200">
                      ₹ {pos.amountInr.toLocaleString()}
                    </td>

                    {/* Leverage */}
                    <td className="py-3 px-3 text-amber-300 font-bold">
                      {pos.leverage}x
                    </td>

                    {/* Entry Price */}
                    <td className="py-3 px-3 text-slate-300">
                      ₹ {pos.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </td>

                    {/* Current Live Market Price */}
                    <td className="py-3 px-3 font-bold text-slate-100">
                      ₹ {pos.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </td>

                    {/* Live Unrealized P&L in INR */}
                    <td className="py-3 px-3">
                      <div
                        className={`font-bold flex items-center gap-0.5 ${
                          isPosProfit ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isPosProfit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>
                          {isPosProfit ? '+' : ''}₹ {pos.unrealizedPnL.toFixed(2)}
                        </span>
                      </div>
                      <div
                        className={`text-[10px] ${
                          isPosProfit ? 'text-emerald-500/80' : 'text-rose-500/80'
                        }`}
                      >
                        {isPosProfit ? '+' : ''}{pos.pnlPercent.toFixed(2)}% ROI
                      </div>
                    </td>

                    {/* Close Action */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => closePosition(pos.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 border border-slate-700/60 hover:border-rose-800/60 text-[11px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        title="Close position and collect P&L into INR balance"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Close</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {positions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 text-xs">
                    No active positions. Execute a trade using the Execution Terminal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Closed Positions & Fluctuating Trade History (370 - 400) */}
        {activeTab === 'history' && (
          <div className="flex flex-col h-full">
            {/* Live Fluctuating Counter Header */}
            <div className="px-4 py-2.5 bg-[#080b13] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Trade History:</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-white font-extrabold text-sm sm:text-base">
                      {tradeHistoryCount}
                    </span>
                    <span className="text-slate-400 text-xs">Completed Trades</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono inline-flex items-center gap-1 transition-all ${
                        tradeHistoryDirection === 'up'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm shadow-rose-950'
                      }`}
                    >
                      {tradeHistoryDirection === 'up' ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          <span>Rising</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 text-rose-400" />
                          <span>Falling</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-mono">
                  <Activity className="w-3 h-3" />
                  Fluctuating Range: 370 – 400
                </span>
              </div>

              {/* View Scope Toggle */}
              <div className="flex items-center gap-1.5 bg-[#0a0d16] p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setHistoryScope('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    historyScope === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Trade History ({tradeHistoryCount})
                </button>
                <button
                  onClick={() => setHistoryScope('my')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    historyScope === 'my'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {currentUser.name} Closed ({closedPositions.length})
                </button>
              </div>
            </div>

            {/* Trade History Records Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#080b12] text-slate-400 text-[11px] sticky top-0 z-10">
                    <th className="py-2.5 px-3">Trader</th>
                    <th className="py-2.5 px-3">Instrument</th>
                    <th className="py-2.5 px-3">Side</th>
                    <th className="py-2.5 px-3">Amount (INR)</th>
                    <th className="py-2.5 px-3">Entry / Exit</th>
                    <th className="py-2.5 px-3">Realized P&L</th>
                    <th className="py-2.5 px-3 text-right">Settled At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {(historyScope === 'all' ? combinedHistory : closedPositions.map((c) => ({
                    id: c.id,
                    traderName: currentUser.name,
                    traderCity: currentUser.city.split(',')[0],
                    assetSymbol: c.assetSymbol,
                    type: c.type,
                    amountInr: c.amountInr,
                    entryPrice: c.entryPrice,
                    closePrice: c.closePrice,
                    realizedPnL: c.realizedPnL,
                    pnlPercent: c.pnlPercent,
                    closedAt: c.closedAt,
                    isUserTrade: true,
                  }))).map((item) => {
                    const isGain = item.realizedPnL >= 0;
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          item.isUserTrade
                            ? 'bg-blue-950/20 hover:bg-blue-950/30'
                            : 'hover:bg-slate-800/30'
                        }`}
                      >
                        {/* Trader Identity */}
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{item.traderName}</span>
                            {item.isUserTrade && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-sans font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-sans">
                            {item.traderCity}
                          </span>
                        </td>

                        {/* Instrument */}
                        <td className="py-2.5 px-3 font-bold text-slate-200">
                          {item.assetSymbol}
                        </td>

                        {/* Side */}
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              item.type === 'BUY'
                                ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                                : 'text-rose-400 bg-rose-500/15 border border-rose-500/30'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-2.5 px-3 text-slate-200">
                          ₹ {item.amountInr.toLocaleString()}
                        </td>

                        {/* Entry / Exit */}
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                          ₹{item.entryPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} → ₹{item.closePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>

                        {/* Realized P&L */}
                        <td className="py-2.5 px-3">
                          <span
                            className={`font-bold inline-flex items-center gap-0.5 ${
                              isGain ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isGain ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {isGain ? '+' : ''}₹ {item.realizedPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isGain ? '+' : ''}{item.pnlPercent.toFixed(2)}%)
                          </span>
                        </td>

                        {/* Time */}
                        <td className="py-2.5 px-3 text-right text-slate-500 text-[10px] font-sans">
                          {item.closedAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Deposits History & Fluctuating Deposits Counter (370 - 400) */}
        {activeTab === 'deposits' && (
          <div className="flex flex-col h-full">
            {/* Live Fluctuating Counter Header for Deposits */}
            <div className="px-4 py-2.5 bg-[#080b13] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Deposits (INR):</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-white font-extrabold text-sm sm:text-base">
                      {depositsCount}
                    </span>
                    <span className="text-slate-400 text-xs">Completed Inbound Deposits</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono inline-flex items-center gap-1 transition-all ${
                        depositsDirection === 'up'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm shadow-rose-950'
                      }`}
                    >
                      {depositsDirection === 'up' ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          <span>Rising</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 text-rose-400" />
                          <span>Falling</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono">
                  <Activity className="w-3 h-3" />
                  Fluctuating Range: 370 – 400
                </span>
              </div>

              {/* View Scope Toggle */}
              <div className="flex items-center gap-1.5 bg-[#0a0d16] p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setDepositsScope('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    depositsScope === 'all'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Deposits ({depositsCount})
                </button>
                <button
                  onClick={() => setDepositsScope('my')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    depositsScope === 'my'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {currentUser.name} ({deposits.length})
                </button>
              </div>
            </div>

            {/* Inbound Deposits Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#080b12] text-slate-400 text-[11px] sticky top-0 z-10">
                    <th className="py-2.5 px-3">Depositor</th>
                    <th className="py-2.5 px-3">Transaction Ref</th>
                    <th className="py-2.5 px-3">Channel / Method</th>
                    <th className="py-2.5 px-3">Amount Credited</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Settled Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {(depositsScope === 'all'
                    ? combinedDeposits
                    : deposits.map((d) => ({
                        id: d.id,
                        depositorName: `${currentUser.name} (You)`,
                        city: currentUser.city.split(',')[0],
                        amountInr: d.amountInr,
                        method: d.method,
                        status: d.status,
                        timestamp: d.timestamp,
                        transactionRef: d.transactionRef,
                        isUserDeposit: true,
                      }))
                  ).map((dep) => (
                    <tr
                      key={dep.id}
                      className={`transition-colors ${
                        dep.isUserDeposit
                          ? 'bg-amber-950/20 hover:bg-amber-950/30'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      {/* Depositor Identity */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{dep.depositorName}</span>
                          {dep.isUserDeposit && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-sans font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-sans">
                          {dep.city}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-300 font-bold">{dep.transactionRef}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px] font-sans font-semibold">
                          {dep.method}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-emerald-400 font-bold text-sm">
                        +₹ {dep.amountInr.toLocaleString()} INR
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          {dep.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 text-[10px] font-sans">
                        {dep.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
