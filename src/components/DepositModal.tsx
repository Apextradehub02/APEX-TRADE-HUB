import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import {
  Wallet,
  X,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Zap
} from 'lucide-react';

const QUICK_INR_AMOUNTS = [
  10000, 20000, 8500, 8700, 2000, 1950, 899, 45230, 7456, 9582, 499, 989, 15000, 29506, 45854
];

export const DepositModal: React.FC = () => {
  const {
    isDepositModalOpen,
    setIsDepositModalOpen,
    depositInr,
    userBalanceInr,
  } = useTrading();

  const [selectedAmount, setSelectedAmount] = useState<number>(10000); // 10,000 or 20,000 INR
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI (GPay / PhonePe)');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [depositSuccess, setDepositSuccess] = useState<{ amount: number; txRef: string; method: string } | null>(null);

  if (!isDepositModalOpen) return null;

  const handleDeposit = () => {
    const finalAmount = customAmount ? Number(customAmount) : selectedAmount;
    if (finalAmount <= 0 || isNaN(finalAmount)) return;

    setIsProcessing(true);

    setTimeout(() => {
      const res = depositInr(finalAmount, selectedMethod);
      setIsProcessing(false);

      if (res.success) {
        setDepositSuccess({
          amount: finalAmount,
          txRef: res.txRef,
          method: selectedMethod,
        });

        // Trigger confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6'],
          });
        } catch (e) {
          // ignore if canvas not supported
        }
      }
    }, 600);
  };

  const handleClose = () => {
    setIsDepositModalOpen(false);
    setDepositSuccess(null);
    setCustomAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in select-none">
      <div
        id="apex-deposit-modal"
        className="bg-[#0e131d] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        {/* Modal Top */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0b0e14]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Deposit INR (₹)
              </h2>
              <p className="text-xs text-slate-400">
                Instant credit into your live trading balance
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {depositSuccess ? (
          /* Deposit Confirmation View */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">Deposit Confirmed!</h3>
              <p className="text-xs text-slate-400">
                Your funds have been credited to your Apex Trade Hub account.
              </p>
            </div>

            <div className="bg-[#080b11] p-4 rounded-xl border border-slate-800 max-w-sm mx-auto text-left font-mono space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Amount Credited:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  +₹ {depositSuccess.amount.toLocaleString()} INR
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Channel:</span>
                <span className="text-white">{depositSuccess.method}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Transaction Ref:</span>
                <span className="text-slate-300">{depositSuccess.txRef}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span>New Available Balance:</span>
                <span className="text-white font-bold">₹ {userBalanceInr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/40 cursor-pointer"
            >
              Start Trading Now
            </button>
          </div>
        ) : (
          /* Deposit Form */
          <div className="p-5 space-y-5">
            {/* Featured ₹10,000 & ₹20,000 Fast Cards */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2.5">
                Select Amount (INR)
              </label>
              <div className="grid grid-cols-2 gap-3 mb-2.5">
                {/* ₹10,000 Card */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAmount(10000);
                    setCustomAmount('');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    selectedAmount === 10000 && !customAmount
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                      : 'bg-[#090d14] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Popular Tier
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="font-mono text-xl font-extrabold text-white">
                    ₹ 10,000
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ₹10,000 INR Standard
                  </div>
                </button>

                {/* ₹20,000 Card */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAmount(20000);
                    setCustomAmount('');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    selectedAmount === 20000 && !customAmount
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                      : 'bg-[#090d14] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                      Recommended
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="font-mono text-xl font-extrabold text-white">
                    ₹ 20,000
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ₹20,000 INR Pro Trader
                  </div>
                </button>
              </div>

              {/* Quick Popular Amounts */}
              <div className="mb-2.5">
                <span className="text-[10px] text-slate-400 font-medium block mb-1.5">
                  Preset Amounts (INR):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {QUICK_INR_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer border ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-emerald-500/25 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-[#090d14] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  placeholder="Or enter custom amount in INR..."
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    if (e.target.value) setSelectedAmount(0);
                  }}
                  className="w-full bg-[#080b11] border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                Deposit Gateway
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['UPI (GPay / PhonePe)', 'Paytm', 'IMPS / NEFT', 'Net Banking', 'Debit / Credit Card'] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedMethod(method)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === method
                        ? 'bg-slate-800 border-emerald-500/80 text-white shadow-md'
                        : 'bg-[#090d14] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {method === 'UPI (GPay / PhonePe)' && <Zap className="w-4 h-4 text-emerald-400" />}
                    {method === 'Paytm' && <Smartphone className="w-4 h-4 text-cyan-400" />}
                    {method === 'IMPS / NEFT' && <Building className="w-4 h-4 text-amber-400" />}
                    {method === 'Net Banking' && <Building className="w-4 h-4 text-blue-400" />}
                    {method === 'Debit / Credit Card' && <CreditCard className="w-4 h-4 text-purple-400" />}
                    <span className="text-[10px] text-center leading-tight">{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant ledger processing with 256-bit bank-grade encryption.</span>
            </div>

            {/* Action Submit */}
            <button
              id="confirm-deposit-btn"
              type="button"
              disabled={isProcessing || (!selectedAmount && !customAmount)}
              onClick={handleDeposit}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-98"
            >
              {isProcessing ? (
                <span>Processing Transaction...</span>
              ) : (
                <>
                  <span>
                    Deposit ₹{' '}
                    {(customAmount ? Number(customAmount) : selectedAmount).toLocaleString()}{' '}
                    INR Now
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
