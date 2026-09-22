export type AssetCategory = 'Forex' | 'Commodities' | 'Crypto' | 'Indices';

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  currentPrice: number;
  previousPrice: number;
  open24h: number;
  high24h: number;
  low24h: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  decimals: number;
  tickDirection: 'up' | 'down' | 'neutral';
  priceHistory: number[];
  candleHistory: CandleData[];
  spread: number;
}

export type OrderType = 'BUY' | 'SELL';

export interface Position {
  id: string;
  assetId: string;
  assetSymbol: string;
  type: OrderType;
  entryPrice: number;
  currentPrice: number;
  amountInr: number; // Margin allocated in INR (₹)
  leverage: number;
  units: number;
  unrealizedPnL: number; // Profit or loss in INR (₹)
  pnlPercent: number;
  stopLoss?: number;
  takeProfit?: number;
  openedAt: string;
}

export interface ClosedPosition {
  id: string;
  assetSymbol: string;
  type: OrderType;
  entryPrice: number;
  closePrice: number;
  amountInr: number;
  leverage: number;
  realizedPnL: number;
  pnlPercent: number;
  openedAt: string;
  closedAt: string;
}

export interface ActiveTradeSummary {
  assetSymbol: string;
  type: OrderType;
  sizeInr: number;
  livePnL: number;
}

export interface ClientTrader {
  id: string;
  name: string;
  avatarSeed: string;
  city: string;
  accountId: string;
  balanceInr: number;
  dailyTradesCount: number;
  isDailyTrader: boolean; // Part of the 1,500 - 1,600 daily trading cohort
  isCurrentlyOnline: boolean;
  lastOnline: string;
  lastOnlineMinutesAgo: number;
  todayPnLInr: number;
  winRate: number;
  activePositions: ActiveTradeSummary[];
}

export type PaymentMethod = 'UPI (GPay / PhonePe)' | 'Paytm' | 'IMPS / NEFT' | 'Net Banking' | 'Debit / Credit Card';

export interface DepositTransaction {
  id: string;
  amountInr: number;
  method: PaymentMethod;
  status: 'Completed' | 'Processing';
  timestamp: string;
  transactionRef: string;
}

export interface LiveMarketTick {
  assetId: string;
  symbol: string;
  price: number;
  change: number;
  timestamp: number;
  direction: 'up' | 'down';
}

export interface PlatformStats {
  totalClients: number; // 2,756
  dailyActiveTraders: number; // 1,500 - 1,600
  volume24hInr: number;
  totalPositionsOpen: number;
  tradeHistoryCount: number; // Fluctuates between 370 and 400
  depositsCount: number; // Fluctuates between 370 and 400
  platformUptime: string;
}

export interface UserProfile {
  id: 'user-1' | 'user-2';
  name: string; // 'Dipta Das' | 'Tushar Kumar Gupta'
  accountType: 'Single';
  accountId: string;
  loginUserId?: string; // e.g. ZXCV1234
  email: string;
  city: string;
  joinedDate: string;
  tier: string;
  kycStatus: 'Verified' | 'Pending';
  balanceInr: number;
  positions: Position[];
  closedPositions: ClosedPosition[];
  deposits: DepositTransaction[];
}

export interface AuthState {
  isAuthenticated: boolean;
  userId: string;
}

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

export interface TradingContextType {
  currentUser: UserProfile;
  activeUserId: 'user-1' | 'user-2';
  switchUser: (userId: 'user-1' | 'user-2') => void;
  allProfiles: UserProfile[];
  assets: MarketAsset[];
  selectedAsset: MarketAsset;
  selectAsset: (assetId: string) => void;
  positions: Position[];
  closedPositions: ClosedPosition[];
  deposits: DepositTransaction[];
  stats: PlatformStats;
  userBalanceInr: number;
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

