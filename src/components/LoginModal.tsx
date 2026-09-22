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
  X,
  ArrowRight,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginUser,
    isAuthenticated,
    authenticatedUserId,
    logoutUser,
  } = useTrading();

  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = loginUser(userIdInput, passwordInput);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessMessage('Authentication Successful! Welcome back.');
        setTimeout(() => {
          setIsLoginModalOpen(false);
          setSuccessMessage(null);
        }, 900);
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div
        id="apex-login-modal"
        className="bg-[#0e131d] border border-slate-700/90 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Top Banner */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0b0e14]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  Institutional Login
                </h2>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                  SECURE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Apex Trade Hub · A Sub-Broker of <span className="text-[#ff5722] font-semibold">Angel One</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 bg-[#0a0d14]">
          {/* Currently Logged In State Notification */}
          {isAuthenticated && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-300 font-medium">Currently signed in as: </span>
                  <strong className="text-white font-mono">{authenticatedUserId}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={logoutUser}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer ml-2"
              >
                Log Out
              </button>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5 animate-in shake">
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User ID Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Institutional User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  placeholder="Enter User ID"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#07090f] border border-slate-700/80 rounded-xl text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase tracking-wider"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Terminal Password
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
                  placeholder="Enter password"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#07090f] border border-slate-700/80 rounded-xl text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
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
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Log In to Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Session · Restricted Institutional Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
