import React from 'react';
import { useTrading } from '../context/TradingContext';
import {
  UserCheck,
  X,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  Layers,
  ArrowRightLeft,
  MapPin,
  Mail,
  Award,
  Calendar,
  Sparkles,
  LogOut,
  LogIn,
  KeyRound,
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    currentUser,
    allProfiles,
    activeUserId,
    switchUser,
    isProfileModalOpen,
    setIsProfileModalOpen,
    totalUnrealizedPnL,
    isAuthenticated,
    authenticatedUserId,
    logoutUser,
    setIsLoginModalOpen,
  } = useTrading();

  if (!isProfileModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div
        id="apex-profile-modal"
        className="bg-[#0e131d] border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0b0e14]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  Trader Profile & Account Switcher
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/30">
                  Single Account
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Switch seamlessly between User 1 (Dipta Das) and User 2 (Tushar Kumar Gupta)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Active Profile Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-[#121827] border border-slate-700/80 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 border-2 border-emerald-400/40 flex items-center justify-center font-mono font-extrabold text-white text-xl shadow-lg shadow-emerald-950/50 shrink-0">
                  {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-lg">{currentUser.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30">
                      Single Account
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-slate-300 font-bold">{currentUser.accountId}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {currentUser.city}
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {currentUser.kycStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Profile Balance & Equity */}
              <div className="bg-[#080b11] p-3 rounded-xl border border-slate-800 text-right font-mono min-w-[170px]">
                <div className="text-[10px] text-slate-400 font-sans uppercase tracking-wider font-semibold">
                  Trading Balance
                </div>
                <div className="text-emerald-400 font-extrabold text-base sm:text-lg">
                  ₹ {currentUser.balanceInr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {currentUser.positions.length} Open Positions
                </div>
              </div>
            </div>
          </div>

          {/* User 1 vs User 2 Switcher Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-sky-400" />
                Select & Switch Active Profile
              </span>
              <span className="text-[11px] text-slate-400">
                Independent margin, balances & trade ledgers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {allProfiles.map((prof, index) => {
                const isActive = prof.id === activeUserId;
                const isUser1 = prof.id === 'user-1';

                return (
                  <div
                    key={prof.id}
                    onClick={() => {
                      if (!isActive) switchUser(prof.id);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isActive
                        ? 'bg-gradient-to-b from-[#111c2e] to-[#0c1422] border-sky-500/80 shadow-lg shadow-sky-950/40 ring-1 ring-sky-500/40'
                        : 'bg-[#090d14] border-slate-800/90 hover:border-slate-700 hover:bg-[#0d121c]'
                    }`}
                  >
                    {/* Top status & tag */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isUser1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          User {index + 1} Profile
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300 font-semibold">
                          Single
                        </span>
                      </div>

                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Active Now
                        </span>
                      ) : (
                        <span className="text-[10px] text-sky-400 font-bold hover:underline flex items-center gap-1">
                          <ArrowRightLeft className="w-3 h-3" />
                          Click to Switch
                        </span>
                      )}
                    </div>

                    {/* Trader info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-white text-base shadow shrink-0 ${
                        isUser1
                          ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
                          : 'bg-gradient-to-br from-blue-600 to-indigo-700'
                      }`}>
                        {prof.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-sm">{prof.name}</h4>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {prof.accountId} • {prof.city.split(',')[0]}
                        </div>
                      </div>
                    </div>

                    {/* Balance and Open trades */}
                    <div className="bg-[#070a10] p-2.5 rounded-lg border border-slate-800/80 mb-3 font-mono text-xs flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-sans">Account Balance</div>
                        <div className="text-white font-bold text-sm">
                          ₹ {prof.balanceInr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-sans">Open Trades</div>
                        <div className="text-slate-300 font-bold">
                          {prof.positions.length} Positions
                        </div>
                      </div>
                    </div>

                    {/* Switch Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        switchUser(prof.id);
                      }}
                      className={`w-full py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                          : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-md shadow-sky-950/40 active:scale-98'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Currently Active ({prof.name.split(' ')[0]})</span>
                        </>
                      ) : (
                        <>
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Switch to {prof.name}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account Profile Details Grid */}
          <div className="bg-[#090d14] rounded-xl border border-slate-800/90 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Current Profile Account Specs</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#070a10] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Account Structure</span>
                <span className="text-white font-bold font-mono">Single (Individual)</span>
              </div>
              <div className="bg-[#070a10] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Account Tier</span>
                <span className="text-amber-400 font-bold">{currentUser.tier}</span>
              </div>
              <div className="bg-[#070a10] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">KYC & Compliance</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Government Verified
                </span>
              </div>
              <div className="bg-[#070a10] p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Registered Since</span>
                <span className="text-slate-200 font-mono">{currentUser.joinedDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-slate-500" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-slate-400">Partner:</span>
                <span className="text-[#ff5722] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
                  Angel One Sub-Broker
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-400">Login ID:</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                  {authenticatedUserId || 'ZXCV1234'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0a0d14] flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Profile: <strong className="text-white">{currentUser.name}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-mono text-[11px]">ID: {authenticatedUserId || 'ZXCV1234'}</span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  logoutUser();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
