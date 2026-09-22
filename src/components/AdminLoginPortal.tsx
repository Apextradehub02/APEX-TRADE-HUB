import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

export const AdminLoginPortal: React.FC = () => {
  const { loginUser } = useTrading();

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = loginUser(userIdInput, passwordInput);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessMessage('Credentials Verified. Opening Admin Panel & Live Trading Terminal...');
      } else {
        setErrorMessage(result.error || 'Invalid credentials. Please verify your User ID and Password.');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-emerald-600/10 via-teal-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-xl shadow-emerald-500/20 mb-4">
            <div className="w-full h-full bg-[#090d15] rounded-[14px] flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Apex Trade Hub</span>
          </h1>
          <div className="flex items-center justify-center gap-1.5 mt-1.5 text-xs text-slate-300 font-medium">
            <span className="text-slate-400">A Sub-Broker of</span>
            <span className="font-bold text-[#ff5722] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
              Angel One
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Institutional Admin Gateway</span>
          </div>
        </div>

        {/* Notice of Restricted Public Access */}
        <div className="mb-5 p-3.5 rounded-xl bg-[#0a0d15] border border-slate-800/90 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Confidential Admin Space</span>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            Live marketing statistics, trade terminal, order book depth, and account balances are restricted. Only authorized administrators with credentials can access the system.
          </p>
        </div>

        {/* Dynamic Card: "Go to Login" Option vs Active Login Form */}
        {!showLoginForm ? (
          <div className="bg-[#0e131d] border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Administrator Access Required</h2>
              <p className="text-xs text-slate-400 mt-1">
                Please authenticate using your assigned User ID and Password to unlock the trading terminal and marketing statistics.
              </p>
            </div>

            {/* Primary "Go to Login" Button */}
            <button
              id="go-to-login-btn"
              onClick={() => setShowLoginForm(true)}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-[#0e131d] border border-slate-800/90 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-4 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Admin Login</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Secure Gateway</span>
            </div>

            {/* Error Notice */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">Access Denied</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Success Notice */}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">{successMessage}</span>
              </div>
            )}

            {/* Active Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* User ID Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Institutional User ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    placeholder="Enter your User ID"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#07090f] border border-slate-700 rounded-xl text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter your Password"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#07090f] border border-slate-700 rounded-xl text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-admin-login-btn"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Log In to Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Back to Go to Login View */}
              <button
                type="button"
                onClick={() => setShowLoginForm(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-300 py-1 transition-colors cursor-pointer"
              >
                Back
              </button>
            </form>
          </div>
        )}

        {/* Footer Security Badges */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            256-Bit SSL Encrypted
          </span>
          <span>•</span>
          <span>Kolkata Node</span>
          <span>•</span>
          <span>Authorized Access Only</span>
        </div>
      </div>
    </div>
  );
};
