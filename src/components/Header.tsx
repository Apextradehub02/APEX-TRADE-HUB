import React from 'react';
import { useTrading } from '../context/TradingContext';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  PlusCircle,
  Wallet,
  ShieldCheck,
  ArrowRightLeft,
  User,
  ChevronDown,
  History,
  Clock,
  LogIn,
  LogOut,
  Lock,
  KeyRound,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    userBalanceInr,
    totalUnrealizedPnL,
    stats,
    setIsDepositModalOpen,
    setIsClientsModalOpen,
    positions,
    currentUser,
    activeUserId,
    switchUser,
    setIsProfileModalOpen,
    tradeHistoryCount,
    tradeHistoryDirection,
    depositsCount,
    depositsDirection,
    isAuthenticated,
    authenticatedUserId,
    setIsLoginModalOpen,
    logoutUser,
  } = useTrading();

  const isProfitable = totalUnrealizedPnL >= 0;
  const isUser1 = activeUserId === 'user-1';

  return (
    <header id="apex-header" className="bg-[#0e131d] border-b border-slate-800/80 sticky top-0 z-30 select-none backdrop-blur-md">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Market Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0e14] rounded-[7px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  Apex <span className="text-emerald-400">Trade Hub</span>
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px]">
                  <span className="text-slate-400">A Sub-Broker of</span>
                  <span className="font-bold text-[#ff5722] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
                    Angel One
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wide">
                  <ShieldCheck className="w-3 h-3 text-purple-400" />
                  ADMIN PANEL
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Institutional Terminal & Multi-Asset INR Market • Authorized Angel One Sub-Broker Network
              </p>
            </div>
          </div>
        </div>

        {/* Global Client & Volume Statistics (2,756 clients / 1,500-1,600 daily active) */}
        <div className="hidden xl:flex items-center gap-2 xl:gap-3 bg-[#0a0d14] px-3.5 py-1.5 rounded-xl border border-slate-800/80 text-xs">
          {/* Total Clients */}
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
            <div className="p-1.5 rounded-lg bg-slate-800/60 text-slate-300">
              <Users className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium leading-none">Total Clients</div>
              <div className="text-slate-100 font-mono font-bold text-xs mt-0.5">
                {stats.totalClients.toLocaleString()} Accounts
              </div>
            </div>
          </div>

          {/* Daily Active Traders Cohort */}
          <button
            id="header-active-traders-btn"
            onClick={() => setIsClientsModalOpen(true)}
            className="flex items-center gap-2 pr-3 border-r border-slate-800 hover:bg-slate-800/40 p-1 rounded-lg transition-colors cursor-pointer text-left"
            title="Click to view all active Indian clients and last online status"
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 relative">
              <Activity className="w-3.5 h-3.5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium leading-none flex items-center gap-1">
                Daily Active
                <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-950/70 px-1 rounded">1.5k+</span>
              </div>
              <div className="text-emerald-400 font-mono font-bold text-xs mt-0.5 flex items-center gap-1">
                {stats.dailyActiveTraders.toLocaleString()} Trading Today
              </div>
            </div>
          </button>

          {/* Trade History (Fluctuates between 370 and 400) */}
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <History className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium leading-none flex items-center gap-1">
                Trade History
                <span
                  className={`text-[9px] font-mono font-bold px-1 rounded ${
                    tradeHistoryDirection === 'up'
                      ? 'text-emerald-400 bg-emerald-950/70'
                      : 'text-rose-400 bg-rose-950/70'
                  }`}
                >
                  {tradeHistoryDirection === 'up' ? '▲' : '▼'}
                </span>
              </div>
              <div className="text-blue-300 font-mono font-bold text-xs mt-0.5">
                {tradeHistoryCount} Trades
              </div>
            </div>
          </div>

          {/* Deposits (INR) (Fluctuates between 370 and 400) */}
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium leading-none flex items-center gap-1">
                Deposits (INR)
                <span
                  className={`text-[9px] font-mono font-bold px-1 rounded ${
                    depositsDirection === 'up'
                      ? 'text-emerald-400 bg-emerald-950/70'
                      : 'text-rose-400 bg-rose-950/70'
                  }`}
                >
                  {depositsDirection === 'up' ? '▲' : '▼'}
                </span>
              </div>
              <div className="text-amber-300 font-mono font-bold text-xs mt-0.5">
                {depositsCount} Deposits
              </div>
            </div>
          </div>

          {/* 24h Volume in INR */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium leading-none">24h Vol (INR)</div>
              <div className="text-amber-300 font-mono font-bold text-xs mt-0.5">
                ₹ {(stats.volume24hInr / 1000000).toFixed(1)}M INR
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Switcher (User 1: Dipta Das vs User 2: Tushar Kumar Gupta) */}
        <div className="flex items-center gap-2 bg-[#090d15] p-1 rounded-xl border border-slate-800 shadow-sm">
          {/* User 1 Button: Dipta Das (Single) */}
          <button
            id="profile-user-1-btn"
            onClick={() => switchUser('user-1')}
            title="Switch to User 1: Dipta Das (Single)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isUser1
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
              isUser1 ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              DD
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold block leading-tight">Dipta Das</span>
              <span className={`text-[9px] block leading-none ${isUser1 ? 'text-emerald-200' : 'text-slate-500'}`}>
                (Single)
              </span>
            </div>
          </button>

          {/* User 2 Button: Tushar Kumar Gupta (Single) */}
          <button
            id="profile-user-2-btn"
            onClick={() => switchUser('user-2')}
            title="Switch to User 2: Tushar Kumar Gupta (Single)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !isUser1
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
              !isUser1 ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              TG
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold block leading-tight">Tushar K. Gupta</span>
              <span className={`text-[9px] block leading-none ${!isUser1 ? 'text-sky-200' : 'text-slate-500'}`}>
                (Single)
              </span>
            </div>
          </button>

          {/* Profile Modal trigger */}
          <button
            id="open-profile-modal-btn"
            onClick={() => setIsProfileModalOpen(true)}
            title="View Full Profile & Account Specs"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* User Account Bar & Quick Deposit */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Clients Directory Trigger Button */}
          <button
            id="view-clients-btn"
            onClick={() => setIsClientsModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/60 text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Clients</span>
            <span className="bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
              {stats.totalClients.toLocaleString()}
            </span>
          </button>

          {/* Account Balance & Real-time P&L preview */}
          <div className="bg-[#090d15] px-3 sm:px-4 py-1.5 rounded-xl border border-slate-800 flex items-center gap-3.5 text-xs">
            {/* Balance */}
            <div>
              <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Wallet className="w-3 h-3 text-slate-400" />
                <span>Balance (INR)</span>
              </div>
              <div className="text-slate-100 font-mono font-bold text-sm sm:text-base tracking-tight">
                ₹ {userBalanceInr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Live Unrealized P&L */}
            <div className="border-l border-slate-800/80 pl-3 hidden sm:block">
              <div className="text-[10px] text-slate-400 font-medium">Real-Time P&L</div>
              <div
                className={`font-mono font-bold text-xs flex items-center gap-0.5 transition-colors ${
                  isProfitable ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isProfitable ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {isProfitable ? '+' : ''}₹ {totalUnrealizedPnL.toFixed(2)}
                </span>
                {positions.length > 0 && (
                  <span className="text-[10px] opacity-75">
                    ({((totalUnrealizedPnL / (userBalanceInr || 1)) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Deposit Button (Direct access for ₹10k, ₹20k INR deposits) */}
          <button
            id="header-deposit-btn"
            onClick={() => {
              if (!isAuthenticated) {
                setIsLoginModalOpen(true);
              } else {
                setIsDepositModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-900/30 transition-all transform active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Deposit ₹</span>
          </button>

          {/* Institutional Auth: Log In / Log Out Option */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              {/* Active User ID Badge */}
              <div
                onClick={() => setIsProfileModalOpen(true)}
                title="Active Institutional User ID: ZXCV1234"
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#090d15] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-medium">User ID:</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {authenticatedUserId || 'ZXCV1234'}
                </span>
              </div>

              {/* Log Out Button */}
              <button
                id="header-logout-btn"
                onClick={logoutUser}
                title="Log out from institutional terminal (User ID: ZXCV1234)"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-800/50 hover:border-rose-600/70 text-xs font-semibold shadow-sm transition-all transform active:scale-95 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              {/* Log In Button */}
              <button
                id="header-login-btn"
                onClick={() => setIsLoginModalOpen(true)}
                title="Sign in with User ID: ZXCV1234 / Password: Kolkata@2026"
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-900/40 transition-all transform active:scale-95 cursor-pointer animate-pulse"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
