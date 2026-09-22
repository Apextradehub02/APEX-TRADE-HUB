/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Header } from './components/Header';
import { TickerBar } from './components/TickerBar';
import { MarketWatch } from './components/MarketWatch';
import { TradingChart } from './components/TradingChart';
import { OrderTerminal } from './components/OrderTerminal';
import { PositionsAndPnL } from './components/PositionsAndPnL';
import { OrderBook } from './components/OrderBook';
import { DepositModal } from './components/DepositModal';
import { ActiveClientsDirectory } from './components/ActiveClientsDirectory';
import { ProfileModal } from './components/ProfileModal';
import { LoginModal } from './components/LoginModal';
import { AdminLoginPortal } from './components/AdminLoginPortal';
import { Layers, BarChart2, TrendingUp, Users } from 'lucide-react';

function DashboardContent() {
  const { isAuthenticated } = useTrading();
  const [mobileTab, setMobileTab] = useState<'chart' | 'trade' | 'positions' | 'market'>('chart');

  // If logged out, the page displays ONLY the "Go to Login" option / restricted portal.
  // Nothing from the trading terminal, balances, or marketing data is exposed.
  if (!isAuthenticated) {
    return <AdminLoginPortal />;
  }

  // Once logged in, the entire Admin Panel & Trading Terminal is revealed.
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white animate-in fade-in duration-300">
      {/* Top Institutional Header (Displays Admin Panel, live marketing data, volume, deposits, profile switcher & Log Out) */}
      <Header />

      {/* Live Market Ticker Tape */}
      <TickerBar />

      {/* Mobile Navigation Tabs (visible only on small screens) */}
      <div className="lg:hidden flex items-center justify-around bg-[#0c1017] border-b border-slate-800 p-1 text-xs">
        <button
          onClick={() => setMobileTab('chart')}
          className={`flex items-center gap-1 py-1.5 px-3 rounded-lg font-bold ${
            mobileTab === 'chart' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Chart</span>
        </button>
        <button
          onClick={() => setMobileTab('trade')}
          className={`flex items-center gap-1 py-1.5 px-3 rounded-lg font-bold ${
            mobileTab === 'trade' ? 'bg-emerald-600 text-white' : 'text-slate-400'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Trade</span>
        </button>
        <button
          onClick={() => setMobileTab('positions')}
          className={`flex items-center gap-1 py-1.5 px-3 rounded-lg font-bold ${
            mobileTab === 'positions' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Positions</span>
        </button>
        <button
          onClick={() => setMobileTab('market')}
          className={`flex items-center gap-1 py-1.5 px-3 rounded-lg font-bold ${
            mobileTab === 'market' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Markets</span>
        </button>
      </div>

      {/* Main Trading Floor Grid */}
      <main className="flex-1 p-2 sm:p-3 max-w-[1920px] w-full mx-auto">
        {/* Desktop & Tablet Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-2.5 xl:gap-3 h-[calc(100vh-105px)] min-h-[640px]">
          {/* Left Column: Market Watch (2.5 cols) */}
          <div className="col-span-3 xl:col-span-2.5 h-full overflow-hidden">
            <MarketWatch />
          </div>

          {/* Center Column: Live Chart (Top) & Positions / PnL Table (Bottom) (6.5 cols) */}
          <div className="col-span-6 xl:col-span-6.5 flex flex-col gap-2.5 xl:gap-3 h-full overflow-hidden">
            {/* Chart Area */}
            <div className="h-[56%] overflow-hidden">
              <TradingChart />
            </div>

            {/* Positions & Real-time P&L Panel */}
            <div className="h-[44%] overflow-hidden">
              <PositionsAndPnL />
            </div>
          </div>

          {/* Right Column: Execution Terminal (Top) & Market Depth / Order Book (Bottom) (3 cols) */}
          <div className="col-span-3 xl:col-span-3 flex flex-col gap-2.5 xl:gap-3 h-full overflow-hidden">
            {/* Trade Execution */}
            <div className="flex-1 overflow-hidden">
              <OrderTerminal />
            </div>

            {/* Order Book Depth & Client Execution Feed */}
            <div className="h-[42%] overflow-hidden">
              <OrderBook />
            </div>
          </div>
        </div>

        {/* Mobile Layout (Tabbed) */}
        <div className="lg:hidden space-y-3 pb-8">
          {mobileTab === 'chart' && (
            <div className="space-y-3">
              <div className="h-[380px]">
                <TradingChart />
              </div>
              <div className="h-[320px]">
                <PositionsAndPnL />
              </div>
            </div>
          )}

          {mobileTab === 'trade' && (
            <div className="space-y-3">
              <OrderTerminal />
              <OrderBook />
            </div>
          )}

          {mobileTab === 'positions' && (
            <div className="h-[500px]">
              <PositionsAndPnL />
            </div>
          )}

          {mobileTab === 'market' && (
            <div className="h-[500px]">
              <MarketWatch />
            </div>
          )}
        </div>
      </main>

      {/* Global Modals */}
      <DepositModal />
      <ActiveClientsDirectory />
      <ProfileModal />
      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <TradingProvider>
      <DashboardContent />
    </TradingProvider>
  );
}
