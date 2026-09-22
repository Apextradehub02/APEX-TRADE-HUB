import { MarketAsset, CandleData } from '../types';

function generateInitialCandles(basePrice: number, volatility: number, count = 36): { candles: CandleData[]; history: number[] } {
  const candles: CandleData[] = [];
  const history: number[] = [];
  const now = Date.now();
  const intervalMs = 60 * 1000; // 1 min candles

  let current = basePrice * (1 - volatility * 3);

  for (let i = count - 1; i >= 0; i--) {
    const time = now - i * intervalMs;
    const change = (Math.random() - 0.49) * volatility * current;
    const open = current;
    const close = Math.max(current + change, basePrice * 0.5);
    const high = Math.max(open, close) + Math.random() * volatility * current * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * current * 0.5;
    const volume = Math.floor(Math.random() * 5000) + 1200;

    candles.push({
      time,
      open: Number(open.toFixed(4)),
      high: Number(high.toFixed(4)),
      low: Number(low.toFixed(4)),
      close: Number(close.toFixed(4)),
      volume,
    });

    history.push(Number(close.toFixed(4)));
    current = close;
  }

  return { candles, history };
}

interface AssetConfig {
  id: string;
  symbol: string;
  name: string;
  category: 'Forex' | 'Commodities' | 'Crypto' | 'Indices';
  basePrice: number;
  volatility: number;
  decimals: number;
  spread: number;
}

const ASSET_CONFIGS: AssetConfig[] = [
  {
    id: 'usd-inr',
    symbol: 'USD/INR',
    name: 'US Dollar / Indian Rupee',
    category: 'Forex',
    basePrice: 84.35,
    volatility: 0.0012,
    decimals: 2,
    spread: 0.02,
  },
  {
    id: 'eur-inr',
    symbol: 'EUR/INR',
    name: 'Euro / Indian Rupee',
    category: 'Forex',
    basePrice: 91.80,
    volatility: 0.0015,
    decimals: 2,
    spread: 0.03,
  },
  {
    id: 'gbp-inr',
    symbol: 'GBP/INR',
    name: 'British Pound / Indian Rupee',
    category: 'Forex',
    basePrice: 109.60,
    volatility: 0.0016,
    decimals: 2,
    spread: 0.04,
  },
  {
    id: 'jpy-inr',
    symbol: 'JPY/INR',
    name: '100 Japanese Yen / Indian Rupee',
    category: 'Forex',
    basePrice: 56.40,
    volatility: 0.0018,
    decimals: 2,
    spread: 0.02,
  },
  {
    id: 'gold-inr',
    symbol: 'XAU/INR (Gold)',
    name: 'Spot Gold (Troy Oz) / INR',
    category: 'Commodities',
    basePrice: 218450.0,
    volatility: 0.002,
    decimals: 0,
    spread: 35.0,
  },
  {
    id: 'crude-inr',
    symbol: 'CRUDE/INR',
    name: 'Brent Crude Oil (Barrel) / INR',
    category: 'Commodities',
    basePrice: 6240.0,
    volatility: 0.003,
    decimals: 1,
    spread: 2.5,
  },
  {
    id: 'btc-inr',
    symbol: 'BTC/INR',
    name: 'Bitcoin / Indian Rupee',
    category: 'Crypto',
    basePrice: 7850000.0,
    volatility: 0.004,
    decimals: 0,
    spread: 850.0,
  },
  {
    id: 'eth-inr',
    symbol: 'ETH/INR',
    name: 'Ethereum / Indian Rupee',
    category: 'Crypto',
    basePrice: 289500.0,
    volatility: 0.0045,
    decimals: 0,
    spread: 60.0,
  },
  {
    id: 'nifty-inr',
    symbol: 'NIFTY50/INR',
    name: 'NSE Nifty 50 Index Equities',
    category: 'Indices',
    basePrice: 25380.0,
    volatility: 0.0022,
    decimals: 1,
    spread: 4.0,
  },
  {
    id: 'sensex-inr',
    symbol: 'SENSEX/INR',
    name: 'BSE Sensex 30 Bluechip Index',
    category: 'Indices',
    basePrice: 82920.0,
    volatility: 0.0024,
    decimals: 1,
    spread: 12.0,
  }
];

export function getInitialAssets(): MarketAsset[] {
  return ASSET_CONFIGS.map(cfg => {
    const { candles, history } = generateInitialCandles(cfg.basePrice, cfg.volatility);
    const currentPrice = history[history.length - 1];
    const open24h = history[0];
    const change24h = currentPrice - open24h;
    const changePercent24h = (change24h / open24h) * 100;
    const high24h = Math.max(...history);
    const low24h = Math.min(...history);
    const volume24h = Math.floor(Math.random() * 250000) + 75000;

    return {
      id: cfg.id,
      symbol: cfg.symbol,
      name: cfg.name,
      category: cfg.category,
      currentPrice,
      previousPrice: history[history.length - 2] || currentPrice,
      open24h,
      high24h,
      low24h,
      change24h,
      changePercent24h,
      volume24h,
      decimals: cfg.decimals,
      tickDirection: change24h >= 0 ? 'up' : 'down',
      priceHistory: history,
      candleHistory: candles,
      spread: cfg.spread,
    };
  });
}
