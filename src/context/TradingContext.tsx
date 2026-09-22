import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  MarketAsset,
  Position,
  ClosedPosition,
  DepositTransaction,
  ClientTrader,
  PaymentMethod,
  OrderType,
  PlatformStats,
  UserProfile,
} from '../types';
import { getInitialAssets } from '../data/marketAssets';
import { ALL_MOCK_CLIENTS, TOTAL_REGISTERED_CLIENTS, DAILY_ACTIVE_TARGET } from '../data/mockTraders';

export interface LiveExecutionFeedItem {
  id: string;
  traderName: string;
  traderCity: string;
  assetSymbol: string;
  type: OrderType;
  amountInr: number;
  time: string;
  pnl?: number;
}

interface TradingContextType {
  assets: MarketAsset[];
  selectedAsset: MarketAsset;
  setSelectedAssetId: (id: string) => void;
  activeUserId: 'user-1' | 'user-2';
  currentUser: UserProfile;
  allProfiles: UserProfile[];
  switchUser: (userId: 'user-1' | 'user-2') => void;
  userBalanceInr: number;
  positions: Position[];
  closedPositions: ClosedPosition[];
  deposits: DepositTransaction[];
  stats: PlatformStats;
  liveExecutions: LiveExecutionFeedItem[];
  allClients: ClientTrader[];
  selectedClientForModal: ClientTrader | null;
  setSelectedClientForModal: (client: ClientTrader | null) => void;
  openPosition: (
    assetId: string,
    type: OrderType,
    amountInr: number,
    leverage: number,
    stopLoss?: number,
    takeProfit?: number
  ) => { success: boolean; message: string };
  closePosition: (positionId: string) => void;
  depositInr: (amount: number, method: PaymentMethod) => { success: boolean; message: string; txRef: string };
  totalUnrealizedPnL: number;
  totalEquityInr: number;
  usedMarginInr: number;
  availableMarginInr: number;
  resetAccount: () => void;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  isClientsModalOpen: boolean;
  setIsClientsModalOpen: (open: boolean) => void;
  tradeHistoryCount: number;
  tradeHistoryDirection: 'up' | 'down';
  depositsCount: number;
  depositsDirection: 'up' | 'down';
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  // Auth state & actions
  isAuthenticated: boolean;
  authenticatedUserId: string;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginUser: (userId: string, pass: string) => { success: boolean; error?: string };
  logoutUser: () => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

// Initial Profile 1: Dipta Das (Single)
const INITIAL_USER_1: UserProfile = {
  id: 'user-1',
  name: 'Dipta Das',
  accountType: 'Single',
  accountId: 'ZXCV1234',
  loginUserId: 'ZXCV1234',
  email: 'dipta.das@apextrade.in',
  city: 'Kolkata, West Bengal',
  joinedDate: 'Jan 2024',
  tier: 'Diamond Single Tier',
  kycStatus: 'Verified',
  balanceInr: 132546.22, // requested balance
  positions: [
    {
      id: 'pos-init-1',
      assetId: 'usd-inr',
      assetSymbol: 'USD/INR',
      type: 'BUY',
      entryPrice: 84.28,
      currentPrice: 84.35,
      amountInr: 10000,
      leverage: 10,
      units: (10000 * 10) / 84.28,
      unrealizedPnL: 830.56,
      pnlPercent: 8.31,
      openedAt: '10:42 AM',
    },
    {
      id: 'pos-init-2',
      assetId: 'gold-inr',
      assetSymbol: 'XAU/INR (Gold)',
      type: 'BUY',
      entryPrice: 218100,
      currentPrice: 218450,
      amountInr: 20000,
      leverage: 5,
      units: (20000 * 5) / 218100,
      unrealizedPnL: 160.48,
      pnlPercent: 0.80,
      openedAt: '11:15 AM',
    },
  ],
  closedPositions: [
    {
      id: 'closed-1',
      assetSymbol: 'BTC/INR',
      type: 'BUY',
      entryPrice: 7780000,
      closePrice: 7850000,
      amountInr: 15000,
      leverage: 10,
      realizedPnL: 1349.6,
      pnlPercent: 8.99,
      openedAt: '10:14 AM',
      closedAt: '11:02 AM',
    },
  ],
  deposits: [
    {
      id: 'dep-init-1',
      amountInr: 20000,
      method: 'UPI (GPay / PhonePe)',
      status: 'Completed',
      timestamp: '09:30 AM',
      transactionRef: 'UPI-984210349',
    },
    {
      id: 'dep-init-2',
      amountInr: 10000,
      method: 'Paytm',
      status: 'Completed',
      timestamp: '08:15 AM',
      transactionRef: 'PTM-447192801',
    },
  ],
};

// Initial Profile 2: Tushar Kumar Gupta (Single)
const INITIAL_USER_2: UserProfile = {
  id: 'user-2',
  name: 'Tushar Kumar Gupta',
  accountType: 'Single',
  accountId: 'APX-IND-2002-TG',
  email: 'tushar.gupta@apextrade.in',
  city: 'Mumbai, Maharashtra',
  joinedDate: 'Mar 2024',
  tier: 'Elite Single Tier',
  kycStatus: 'Verified',
  balanceInr: 175850.50,
  positions: [
    {
      id: 'pos-init-3',
      assetId: 'nifty-inr',
      assetSymbol: 'NIFTY50/INR',
      type: 'BUY',
      entryPrice: 25420,
      currentPrice: 25480,
      amountInr: 15000,
      leverage: 15,
      units: (15000 * 15) / 25420,
      unrealizedPnL: 531.08,
      pnlPercent: 3.54,
      openedAt: '11:20 AM',
    },
    {
      id: 'pos-init-4',
      assetId: 'btc-inr',
      assetSymbol: 'BTC/INR',
      type: 'BUY',
      entryPrice: 7820000,
      currentPrice: 7845000,
      amountInr: 25000,
      leverage: 5,
      units: (25000 * 5) / 7820000,
      unrealizedPnL: 399.62,
      pnlPercent: 1.60,
      openedAt: '11:50 AM',
    },
  ],
  closedPositions: [
    {
      id: 'closed-2',
      assetSymbol: 'CRUDE/INR',
      type: 'BUY',
      entryPrice: 6100,
      closePrice: 6210,
      amountInr: 20000,
      leverage: 10,
      realizedPnL: 3606.56,
      pnlPercent: 18.03,
      openedAt: '09:45 AM',
      closedAt: '10:55 AM',
    },
  ],
  deposits: [
    {
      id: 'dep-init-3',
      amountInr: 50000,
      method: 'IMPS / NEFT',
      status: 'Completed',
      timestamp: '09:00 AM',
      transactionRef: 'IMPS-771920381',
    },
    {
      id: 'dep-init-4',
      amountInr: 20000,
      method: 'UPI (GPay / PhonePe)',
      status: 'Completed',
      timestamp: '10:10 AM',
      transactionRef: 'UPI-881290334',
    },
  ],
};

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<MarketAsset[]>(getInitialAssets);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('usd-inr');

  // Active User Switcher ('user-1' = Dipta Das, 'user-2' = Tushar Kumar Gupta)
  const [activeUserId, setActiveUserId] = useState<'user-1' | 'user-2'>(() => {
    const savedId = localStorage.getItem('apex_active_user_id');
    return (savedId === 'user-2') ? 'user-2' : 'user-1';
  });

  // Profiles State
  const [profiles, setProfiles] = useState<Record<'user-1' | 'user-2', UserProfile>>(() => {
    try {
      const savedProfiles = localStorage.getItem('apex_user_profiles');
      if (savedProfiles) {
        const parsed = JSON.parse(savedProfiles);
        if (parsed['user-1'] && parsed['user-2']) {
          // Ensure Dipta Das balance matches 132546.22 if was 50000
          if (parsed['user-1'].balanceInr === 50000) {
            parsed['user-1'].balanceInr = 132546.22;
          }
          return parsed;
        }
      }
    } catch (e) {
      // fallback to initial
    }
    return {
      'user-1': INITIAL_USER_1,
      'user-2': INITIAL_USER_2,
    };
  });

  const currentUser = profiles[activeUserId];
  const allProfiles = useMemo(() => [profiles['user-1'], profiles['user-2']], [profiles]);

  const [allClients] = useState<ClientTrader[]>(ALL_MOCK_CLIENTS);
  const [selectedClientForModal, setSelectedClientForModal] = useState<ClientTrader | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isClientsModalOpen, setIsClientsModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Authentication State (strictly requires typing credentials to unlock)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('apex_is_authenticated') === 'true';
  });

  const [authenticatedUserId, setAuthenticatedUserId] = useState<string>(() => {
    return localStorage.getItem('apex_auth_user_id') || 'ZXCV1234';
  });

  const loginUser = useCallback((userId: string, pass: string): { success: boolean; error?: string } => {
    const cleanId = userId.trim().toUpperCase();
    const cleanPass = pass.trim();

    if ((cleanId === 'ZXCV1234' || cleanId === 'APX-IND-1001-DD') && cleanPass === 'Kolkata@2026') {
      setIsAuthenticated(true);
      setAuthenticatedUserId('ZXCV1234');
      localStorage.setItem('apex_is_authenticated', 'true');
      localStorage.setItem('apex_auth_user_id', 'ZXCV1234');
      setIsLoginModalOpen(false);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid User ID or Password. Access denied.',
    };
  }, []);

  const logoutUser = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.setItem('apex_is_authenticated', 'false');
    setIsLoginModalOpen(false);
  }, []);

  const [tradeHistoryCount, setTradeHistoryCount] = useState<number>(384);
  const [tradeHistoryDirection, setTradeHistoryDirection] = useState<'up' | 'down'>('up');
  const [depositsCount, setDepositsCount] = useState<number>(382);
  const [depositsDirection, setDepositsDirection] = useState<'up' | 'down'>('up');

  // Platform dynamic statistics
  const [stats, setStats] = useState<PlatformStats>({
    totalClients: TOTAL_REGISTERED_CLIENTS, // 2,756
    dailyActiveTraders: DAILY_ACTIVE_TARGET, // 1,500 - 1,600
    volume24hInr: 42800000,
    totalPositionsOpen: 3410,
    tradeHistoryCount: 384,
    depositsCount: 382,
    platformUptime: '99.98%',
  });

  // Real-time live execution ticker from the 1,500-1,600 active Indian traders
  const [liveExecutions, setLiveExecutions] = useState<LiveExecutionFeedItem[]>([
    { id: 'exec-1', traderName: 'Vikram Malhotra', traderCity: 'Mumbai', assetSymbol: 'USD/INR', type: 'BUY', amountInr: 15000, time: 'Just now' },
    { id: 'exec-2', traderName: 'Priya Patel', traderCity: 'Ahmedabad', assetSymbol: 'XAU/INR (Gold)', type: 'BUY', amountInr: 25000, time: '2s ago', pnl: 2450 },
    { id: 'exec-3', traderName: 'Rohan Sharma', traderCity: 'Delhi NCR', assetSymbol: 'BTC/INR', type: 'SELL', amountInr: 20000, time: '5s ago' },
    { id: 'exec-4', traderName: 'Ananya Iyer', traderCity: 'Bengaluru', assetSymbol: 'EUR/INR', type: 'BUY', amountInr: 10000, time: '8s ago', pnl: 890 },
    { id: 'exec-5', traderName: 'Arjun Das', traderCity: 'Kolkata', assetSymbol: 'NIFTY50/INR', type: 'BUY', amountInr: 30000, time: '12s ago' },
  ]);

  // Persist active user and profile changes
  useEffect(() => {
    localStorage.setItem('apex_active_user_id', activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    localStorage.setItem('apex_user_profiles', JSON.stringify(profiles));
    // Keep legacy single key synced for compatibility
    localStorage.setItem('apex_balance_inr', currentUser.balanceInr.toString());
  }, [profiles, currentUser.balanceInr]);

  // Switch between user 1 and user 2
  const switchUser = useCallback((userId: 'user-1' | 'user-2') => {
    setActiveUserId(userId);
  }, []);

  // Real-time market tick engine
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) => {
        return prevAssets.map((asset) => {
          const volatility = asset.category === 'Crypto' ? 0.0018 : asset.category === 'Commodities' ? 0.001 : 0.0004;
          const drift = (Math.random() - 0.498) * volatility;
          const priceChange = asset.currentPrice * drift;
          const newPrice = Math.max(0.001, Number((asset.currentPrice + priceChange).toFixed(asset.decimals)));
          
          const tickDirection = newPrice > asset.currentPrice ? 'up' : newPrice < asset.currentPrice ? 'down' : asset.tickDirection;
          const updatedPriceHistory = [...asset.priceHistory.slice(1), newPrice];

          const updatedCandles = [...asset.candleHistory];
          if (updatedCandles.length > 0) {
            const lastIdx = updatedCandles.length - 1;
            const lastCandle = { ...updatedCandles[lastIdx] };
            lastCandle.close = newPrice;
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
            lastCandle.volume += Math.floor(Math.random() * 40) + 5;
            updatedCandles[lastIdx] = lastCandle;
          }

          const change24h = newPrice - asset.open24h;
          const changePercent24h = (change24h / asset.open24h) * 100;
          const high24h = Math.max(asset.high24h, newPrice);
          const low24h = Math.min(asset.low24h, newPrice);

          return {
            ...asset,
            previousPrice: asset.currentPrice,
            currentPrice: newPrice,
            change24h,
            changePercent24h,
            high24h,
            low24h,
            tickDirection,
            priceHistory: updatedPriceHistory,
            candleHistory: updatedCandles,
          };
        });
      });

      // Update positions live P&L across all profiles
      setProfiles((prev) => {
        const updateProfilePositions = (prof: UserProfile): UserProfile => {
          const updatedPositions = prof.positions.map((pos) => {
            const currentAsset = assets.find((a) => a.id === pos.assetId);
            if (!currentAsset) return pos;

            const currentPrice = currentAsset.currentPrice;
            let unrealizedPnL = 0;

            if (pos.type === 'BUY') {
              const priceDelta = currentPrice - pos.entryPrice;
              unrealizedPnL = (priceDelta / pos.entryPrice) * pos.amountInr * pos.leverage;
            } else {
              const priceDelta = pos.entryPrice - currentPrice;
              unrealizedPnL = (priceDelta / pos.entryPrice) * pos.amountInr * pos.leverage;
            }

            const pnlPercent = (unrealizedPnL / pos.amountInr) * 100;

            return {
              ...pos,
              currentPrice,
              unrealizedPnL: Number(unrealizedPnL.toFixed(2)),
              pnlPercent: Number(pnlPercent.toFixed(2)),
            };
          });

          return {
            ...prof,
            positions: updatedPositions,
          };
        };

        return {
          'user-1': updateProfilePositions(prev['user-1']),
          'user-2': updateProfilePositions(prev['user-2']),
        };
      });

      // Micro update to daily active count (1,500 - 1,600) and trade history (fluctuating between 370 and 400)
      setStats((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        let newActive = prev.dailyActiveTraders + delta;
        if (newActive < 1510) newActive = 1515;
        if (newActive > 1595) newActive = 1590;

        // Trade history fluctuation: sometimes rising, sometimes falling, strictly between 370 and 400
        const roll = Math.random();
        let historyDelta = 0;
        if (roll < 0.45) {
          historyDelta = Math.floor(Math.random() * 3) + 1; // rising: +1, +2, +3
        } else if (roll < 0.90) {
          historyDelta = -(Math.floor(Math.random() * 3) + 1); // falling: -1, -2, -3
        }

        let newHistory = (prev.tradeHistoryCount || 384) + historyDelta;
        if (newHistory < 370) newHistory = 371 + Math.floor(Math.random() * 3);
        if (newHistory > 400) newHistory = 399 - Math.floor(Math.random() * 3);

        if (newHistory > (prev.tradeHistoryCount || 384)) {
          setTradeHistoryDirection('up');
        } else if (newHistory < (prev.tradeHistoryCount || 384)) {
          setTradeHistoryDirection('down');
        }
        setTradeHistoryCount(newHistory);

        // Deposits fluctuation: sometimes rising, sometimes falling, strictly between 370 and 400
        const depRoll = Math.random();
        let depDelta = 0;
        if (depRoll < 0.45) {
          depDelta = Math.floor(Math.random() * 3) + 1; // rising: +1, +2, +3
        } else if (depRoll < 0.90) {
          depDelta = -(Math.floor(Math.random() * 3) + 1); // falling: -1, -2, -3
        }

        let newDeposits = (prev.depositsCount || 382) + depDelta;
        if (newDeposits < 370) newDeposits = 371 + Math.floor(Math.random() * 3);
        if (newDeposits > 400) newDeposits = 399 - Math.floor(Math.random() * 3);

        if (newDeposits > (prev.depositsCount || 382)) {
          setDepositsDirection('up');
        } else if (newDeposits < (prev.depositsCount || 382)) {
          setDepositsDirection('down');
        }
        setDepositsCount(newDeposits);

        return {
          ...prev,
          dailyActiveTraders: newActive,
          tradeHistoryCount: newHistory,
          depositsCount: newDeposits,
          volume24hInr: prev.volume24hInr + Math.floor(Math.random() * 12000),
        };
      });

      // Append live trades from client pool
      if (Math.random() < 0.45) {
        const randomClient = allClients[Math.floor(Math.random() * DAILY_ACTIVE_TARGET)];
        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        const isBuy = Math.random() > 0.45;
        const tradeAmount = [5000, 10000, 15000, 20000, 50000][Math.floor(Math.random() * 5)];
        const hasProfit = Math.random() > 0.4;
        const pnl = hasProfit ? Math.round(Math.random() * 2800 + 450) : -Math.round(Math.random() * 1400 + 200);

        const newItem: LiveExecutionFeedItem = {
          id: `exec-${Date.now()}-${Math.random()}`,
          traderName: randomClient.name,
          traderCity: randomClient.city,
          assetSymbol: randomAsset.symbol,
          type: isBuy ? 'BUY' : 'SELL',
          amountInr: tradeAmount,
          time: 'Just now',
          pnl: Math.random() > 0.6 ? pnl : undefined,
        };

        setLiveExecutions((prev) => [newItem, ...prev.slice(0, 9)]);
      }
    }, 1400);

    return () => clearInterval(interval);
  }, [assets, allClients]);

  // Selected asset
  const selectedAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  // Current user's values
  const userBalanceInr = currentUser.balanceInr;
  const positions = currentUser.positions;
  const closedPositions = currentUser.closedPositions;
  const deposits = currentUser.deposits;

  // Margin & Equity calculations in INR
  const usedMarginInr = useMemo(() => {
    return positions.reduce((sum, p) => sum + p.amountInr, 0);
  }, [positions]);

  const totalUnrealizedPnL = useMemo(() => {
    return positions.reduce((sum, p) => sum + p.unrealizedPnL, 0);
  }, [positions]);

  const totalEquityInr = useMemo(() => {
    return userBalanceInr + totalUnrealizedPnL;
  }, [userBalanceInr, totalUnrealizedPnL]);

  const availableMarginInr = useMemo(() => {
    return Math.max(0, userBalanceInr - usedMarginInr);
  }, [userBalanceInr, usedMarginInr]);

  // Open position handler for active profile
  const openPosition = useCallback(
    (
      assetId: string,
      type: OrderType,
      amountInr: number,
      leverage: number,
      stopLoss?: number,
      takeProfit?: number
    ) => {
      if (amountInr <= 0) {
        return { success: false, message: 'Please enter a valid amount in INR (₹).' };
      }

      if (amountInr > availableMarginInr) {
        return {
          success: false,
          message: `Insufficient margin! Available: ₹ ${availableMarginInr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. You can deposit ₹10,000 or ₹20,000 INR.`,
        };
      }

      const targetAsset = assets.find((a) => a.id === assetId);
      if (!targetAsset) {
        return { success: false, message: 'Asset not found.' };
      }

      const entryPrice = targetAsset.currentPrice;
      const totalNotional = amountInr * leverage;
      const units = totalNotional / entryPrice;

      const newPosition: Position = {
        id: `pos-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        assetId: targetAsset.id,
        assetSymbol: targetAsset.symbol,
        type,
        entryPrice,
        currentPrice: entryPrice,
        amountInr,
        leverage,
        units,
        unrealizedPnL: 0,
        pnlPercent: 0,
        stopLoss,
        takeProfit,
        openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setProfiles((prev) => {
        const active = prev[activeUserId];
        return {
          ...prev,
          [activeUserId]: {
            ...active,
            positions: [newPosition, ...active.positions],
          },
        };
      });

      return {
        success: true,
        message: `[${currentUser.name}] Opened ${type} on ${targetAsset.symbol} for ₹ ${amountInr.toLocaleString()} with ${leverage}x leverage.`,
      };
    },
    [availableMarginInr, assets, activeUserId, currentUser.name]
  );

  // Close position handler for active profile
  const closePosition = useCallback(
    (positionId: string) => {
      const pos = positions.find((p) => p.id === positionId);
      if (!pos) return;

      const realizedPnL = pos.unrealizedPnL;

      const closedItem: ClosedPosition = {
        id: `closed-${Date.now()}`,
        assetSymbol: pos.assetSymbol,
        type: pos.type,
        entryPrice: pos.entryPrice,
        closePrice: pos.currentPrice,
        amountInr: pos.amountInr,
        leverage: pos.leverage,
        realizedPnL,
        pnlPercent: pos.pnlPercent,
        openedAt: pos.openedAt,
        closedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setProfiles((prev) => {
        const active = prev[activeUserId];
        return {
          ...prev,
          [activeUserId]: {
            ...active,
            balanceInr: Math.max(0, active.balanceInr + realizedPnL),
            positions: active.positions.filter((p) => p.id !== positionId),
            closedPositions: [closedItem, ...active.closedPositions],
          },
        };
      });
    },
    [positions, activeUserId]
  );

  // Deposit function supporting ₹10,000, ₹20,000 or custom amounts in INR
  const depositInr = useCallback(
    (amount: number, method: PaymentMethod) => {
      if (amount <= 0) {
        return { success: false, message: 'Deposit amount must be greater than 0.', txRef: '' };
      }

      const txRef = `${method.substring(0, 3).replace(/[^a-zA-Z]/g, '').toUpperCase()}-${Math.floor(100000000 + Math.random() * 900000000)}`;

      const newTx: DepositTransaction = {
        id: `tx-${Date.now()}`,
        amountInr: amount,
        method,
        status: 'Completed',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        transactionRef: txRef,
      };

      setProfiles((prev) => {
        const active = prev[activeUserId];
        return {
          ...prev,
          [activeUserId]: {
            ...active,
            balanceInr: active.balanceInr + amount,
            deposits: [newTx, ...active.deposits],
          },
        };
      });

      return {
        success: true,
        message: `Successfully credited ₹ ${amount.toLocaleString()} to ${currentUser.name}'s account via ${method}!`,
        txRef,
      };
    },
    [activeUserId, currentUser.name]
  );

  const resetAccount = useCallback(() => {
    setProfiles((prev) => {
      const active = prev[activeUserId];
      const initialBalance = activeUserId === 'user-1' ? INITIAL_USER_1.balanceInr : INITIAL_USER_2.balanceInr;
      return {
        ...prev,
        [activeUserId]: {
          ...active,
          balanceInr: initialBalance,
          positions: [],
        },
      };
    });
  }, [activeUserId]);

  return (
    <TradingContext.Provider
      value={{
        assets,
        selectedAsset,
        setSelectedAssetId,
        activeUserId,
        currentUser,
        allProfiles,
        switchUser,
        userBalanceInr,
        positions,
        closedPositions,
        deposits,
        stats,
        liveExecutions,
        allClients,
        selectedClientForModal,
        setSelectedClientForModal,
        openPosition,
        closePosition,
        depositInr,
        totalUnrealizedPnL,
        totalEquityInr,
        usedMarginInr,
        availableMarginInr,
        resetAccount,
        isDepositModalOpen,
        setIsDepositModalOpen,
        isClientsModalOpen,
        setIsClientsModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        tradeHistoryCount,
        tradeHistoryDirection,
        depositsCount,
        depositsDirection,
        isAuthenticated,
        authenticatedUserId,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
}
