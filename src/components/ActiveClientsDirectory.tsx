import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import {
  Users,
  Search,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  X,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const ActiveClientsDirectory: React.FC = () => {
  const {
    allClients,
    stats,
    isClientsModalOpen,
    setIsClientsModalOpen,
    selectedClientForModal,
    setSelectedClientForModal,
  } = useTrading();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'daily' | 'online' | 'all'>('daily');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const filteredClients = useMemo(() => {
    return allClients.filter((client) => {
      // Filter criteria
      if (filterType === 'daily' && !client.isDailyTrader) return false;
      if (filterType === 'online' && !client.isCurrentlyOnline) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        client.name.toLowerCase().includes(q) ||
        client.city.toLowerCase().includes(q) ||
        client.accountId.toLowerCase().includes(q)
      );
    });
  }, [allClients, filterType, searchQuery]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredClients.slice(start, start + itemsPerPage);
  }, [filteredClients, page]);

  if (!isClientsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="active-clients-modal"
        className="bg-[#0e131d] border border-slate-700/80 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0b0e14]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  Client Directory & Active Traders Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  {stats.totalClients.toLocaleString()} Registered
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Displaying Indian trading accounts with real-time online status and INR market activity
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsClientsModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-[#080b12] border-b border-slate-800/80 text-xs">
          <div className="bg-[#0e131d] p-2.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Total Registered Clients</div>
            <div className="text-base font-extrabold font-mono text-white mt-0.5">
              {stats.totalClients.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#0e131d] p-2.5 rounded-xl border border-emerald-900/40 bg-emerald-950/10">
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Daily Active Traders
            </div>
            <div className="text-base font-extrabold font-mono text-emerald-400 mt-0.5">
              {stats.dailyActiveTraders.toLocaleString()}{' '}
              <span className="text-[10px] text-slate-400 font-normal">/ 1,600 Max</span>
            </div>
          </div>

          <div className="bg-[#0e131d] p-2.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Currently Online</div>
            <div className="text-base font-extrabold font-mono text-sky-400 mt-0.5">
              {allClients.filter((c) => c.isCurrentlyOnline).length.toLocaleString()} Traders
            </div>
          </div>

          <div className="bg-[#0e131d] p-2.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Today's Total Volume</div>
            <div className="text-base font-extrabold font-mono text-amber-300 mt-0.5">
              ₹ {(stats.volume24hInr / 1000000).toFixed(1)}M INR
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-[#0a0d14]">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setFilterType('daily');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType === 'daily'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Daily Active Traders ({stats.dailyActiveTraders.toLocaleString()})</span>
            </button>

            <button
              onClick={() => {
                setFilterType('online');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType === 'online'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-900/40'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Online Now</span>
            </button>

            <button
              onClick={() => {
                setFilterType('all');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>All {stats.totalClients.toLocaleString()} Clients</span>
            </button>
          </div>

          {/* Search Field */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search Indian name, APX-10xxx, city..."
              className="w-full bg-[#080b11] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Clients Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-[#080b12] border-b border-slate-800 z-10 font-mono text-[11px] text-slate-400">
              <tr>
                <th className="py-2.5 px-4">Client Name & ID</th>
                <th className="py-2.5 px-4">Location (India)</th>
                <th className="py-2.5 px-4">Status / Last Online</th>
                <th className="py-2.5 px-4">Balance (INR)</th>
                <th className="py-2.5 px-4">Today's P&L</th>
                <th className="py-2.5 px-4">Active Trades</th>
                <th className="py-2.5 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {paginatedClients.map((client) => {
                const isPos = client.todayPnLInr >= 0;

                return (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClientForModal(client)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    {/* Name & ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-white font-mono shrink-0">
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs hover:text-emerald-400 transition-colors">
                            {client.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {client.accountId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{client.city}</span>
                      </div>
                    </td>

                    {/* Last Online & Status */}
                    <td className="py-3 px-4">
                      {client.isCurrentlyOnline ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Active now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{client.lastOnline}</span>
                        </span>
                      )}
                    </td>

                    {/* Balance */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      ₹ {client.balanceInr.toLocaleString()}
                    </td>

                    {/* Today's P&L */}
                    <td className="py-3 px-4 font-mono">
                      {client.dailyTradesCount > 0 ? (
                        <span
                          className={`font-bold inline-flex items-center gap-0.5 ${
                            isPos ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isPos ? '+' : ''}₹ {client.todayPnLInr.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Active Trades */}
                    <td className="py-3 px-4">
                      {client.activePositions.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          {client.activePositions.map((pos, pIdx) => (
                            <span
                              key={pIdx}
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                pos.type === 'BUY'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {pos.type} {pos.assetSymbol.split('/')[0]}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[10px]">No open trade</span>
                      )}
                    </td>

                    {/* Action View */}
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1 cursor-pointer">
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {paginatedClients.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No clients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#090c13] flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{(page - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-white">
              {Math.min(page * itemsPerPage, filteredClients.length)}
            </strong>{' '}
            of <strong className="text-white">{filteredClients.length}</strong> clients
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 cursor-pointer"
            >
              Previous
            </button>
            <span className="font-mono text-white">
              {page} / {totalPages || 1}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Individual Client Details Sub-Modal */}
      {selectedClientForModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111622] border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono">
                  {selectedClientForModal.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedClientForModal.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedClientForModal.city}, India • {selectedClientForModal.accountId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClientForModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#0b0e14] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">INR Balance</span>
                <span className="text-white font-bold text-sm">₹ {selectedClientForModal.balanceInr.toLocaleString()}</span>
              </div>
              <div className="bg-[#0b0e14] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Last Online</span>
                <span className="text-emerald-400 font-bold">{selectedClientForModal.lastOnline}</span>
              </div>
              <div className="bg-[#0b0e14] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Today's P&L</span>
                <span className={selectedClientForModal.todayPnLInr >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {selectedClientForModal.todayPnLInr >= 0 ? '+' : ''}₹ {selectedClientForModal.todayPnLInr.toLocaleString()}
                </span>
              </div>
              <div className="bg-[#0b0e14] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Win Rate</span>
                <span className="text-amber-400 font-bold">{selectedClientForModal.winRate}%</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Open Positions ({selectedClientForModal.activePositions.length})
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedClientForModal.activePositions.map((pos, idx) => (
                  <div key={idx} className="bg-[#0b0e14] p-2 rounded-lg flex items-center justify-between text-xs border border-slate-800">
                    <div>
                      <span className="font-bold text-white mr-1.5">{pos.assetSymbol}</span>
                      <span className={pos.type === 'BUY' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {pos.type}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-slate-300 font-bold">₹ {pos.sizeInr.toLocaleString()}</div>
                      <div className={pos.livePnL >= 0 ? 'text-emerald-400 text-[10px]' : 'text-rose-400 text-[10px]'}>
                        {pos.livePnL >= 0 ? '+' : ''}₹ {pos.livePnL}
                      </div>
                    </div>
                  </div>
                ))}
                {selectedClientForModal.activePositions.length === 0 && (
                  <p className="text-xs text-slate-500 py-3 text-center">No active positions currently.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedClientForModal(null)}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
