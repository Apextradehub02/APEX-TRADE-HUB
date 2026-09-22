import { ClientTrader } from '../types';

const FIRST_NAMES = [
  'Aarav', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Sneha', 'Rajesh', 'Pooja',
  'Aditya', 'Neha', 'Arjun', 'Divya', 'Kabir', 'Ishaan', 'Kavita', 'Siddharth',
  'Meera', 'Rahul', 'Shreya', 'Amit', 'Swati', 'Kunal', 'Sunita', 'Deepak',
  'Ritu', 'Sanjay', 'Anjali', 'Harish', 'Shalini', 'Alok', 'Tanvi', 'Manish',
  'Rashi', 'Varun', 'Nidhi', 'Gaurav', 'Simran', 'Tarun', 'Preeti', 'Nikhil',
  'Pallavi', 'Vivek', 'Sangeeta', 'Vishal', 'Kriti', 'Manoj', 'Rupa', 'Ajay',
  'Deepika', 'Prateek', 'Bhavna', 'Abhishek', 'Monika', 'Karan', 'Payal',
  'Yash', 'Shruti', 'Devendra', 'Aakanksha', 'Mohit', 'Juhi', 'Ashwin', 'Lata'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Verma', 'Mehta', 'Iyer', 'Singh', 'Roy', 'Das',
  'Mukherjee', 'Nair', 'Joshi', 'Malhotra', 'Banerjee', 'Gupta', 'Agarwal',
  'Rao', 'Chatterjee', 'Reddy', 'Kapoor', 'Choudhury', 'Bhattacharya',
  'Saxena', 'Sengupta', 'Trivedi', 'Nambiar', 'Deshmukh', 'Kulkarni',
  'Pillai', 'Mishra', 'Ghosh', 'Bose', 'Dutta', 'Pandey', 'Chopra', 'Dewan'
];

const CITIES = [
  'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Pune', 'Surat', 'Jaipur', 'Lucknow', 'Indore', 'Chandigarh',
  'Nagpur', 'Kochi', 'Vadodara', 'Coimbatore', 'Bhopal', 'Patna', 'Visakhapatnam'
];

const ASSET_SYMBOLS = ['USD/INR', 'EUR/INR', 'BTC/INR', 'XAU/INR (Gold)', 'CRUDE/INR', 'NIFTY50/INR', 'GBP/INR'];

// Deterministic Pseudo-Random Generator with seed for consistent yet natural variety
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate the full pool of 2,756 registered clients
export const TOTAL_REGISTERED_CLIENTS = 2756;

// Daily active traders cohort (1,500 to 1,600)
export const DAILY_ACTIVE_TARGET = 1548;

export function generateAllClients(): ClientTrader[] {
  const clients: ClientTrader[] = [];

  for (let i = 0; i < TOTAL_REGISTERED_CLIENTS; i++) {
    const seed = i * 17 + 31;
    const fIdx = Math.floor(pseudoRandom(seed) * FIRST_NAMES.length);
    const lIdx = Math.floor(pseudoRandom(seed + 1) * LAST_NAMES.length);
    const cIdx = Math.floor(pseudoRandom(seed + 2) * CITIES.length);

    const name = `${FIRST_NAMES[fIdx]} ${LAST_NAMES[lIdx]}`;
    const city = CITIES[cIdx];
    const accountId = `APX-${10000 + i}`;

    // Target between 1,500 and 1,600 daily traders (index < 1548)
    const isDailyTrader = i < DAILY_ACTIVE_TARGET;

    let isCurrentlyOnline = false;
    let lastOnline = '2 days ago';
    let lastOnlineMinutesAgo = 2880;

    if (isDailyTrader) {
      // Out of the daily traders, ~700-900 are online right now or within the last 15 mins
      const randStatus = pseudoRandom(seed + 3);
      if (randStatus < 0.48) {
        isCurrentlyOnline = true;
        lastOnline = 'Active now';
        lastOnlineMinutesAgo = 0;
      } else if (randStatus < 0.70) {
        const mins = Math.floor(pseudoRandom(seed + 4) * 14) + 1;
        lastOnline = `${mins}m ago`;
        lastOnlineMinutesAgo = mins;
      } else if (randStatus < 0.90) {
        const mins = Math.floor(pseudoRandom(seed + 5) * 45) + 15;
        lastOnline = `${mins}m ago`;
        lastOnlineMinutesAgo = mins;
      } else {
        const hours = Math.floor(pseudoRandom(seed + 6) * 5) + 1;
        lastOnline = `${hours}h ago`;
        lastOnlineMinutesAgo = hours * 60;
      }
    } else {
      // Inactive today, last seen yesterday or earlier
      const days = Math.floor(pseudoRandom(seed + 7) * 4) + 1;
      lastOnline = `${days}d ago`;
      lastOnlineMinutesAgo = days * 1440;
    }

    const baseBalance = Math.floor(pseudoRandom(seed + 8) * 650000) + 15000;
    // Round to clean Rupee
    const balanceInr = Math.round(baseBalance / 500) * 500;

    const dailyTradesCount = isDailyTrader ? Math.floor(pseudoRandom(seed + 9) * 28) + 3 : 0;
    const pnlSign = pseudoRandom(seed + 10) > 0.42 ? 1 : -1;
    const todayPnLInr = isDailyTrader ? Math.round(pseudoRandom(seed + 11) * 32500 * pnlSign) : 0;
    const winRate = Math.round((0.48 + pseudoRandom(seed + 12) * 0.38) * 100);

    // Active positions for current online traders
    const activePositions = [];
    if (isCurrentlyOnline || (isDailyTrader && lastOnlineMinutesAgo < 30)) {
      const numPositions = Math.floor(pseudoRandom(seed + 13) * 3) + 1;
      for (let p = 0; p < numPositions; p++) {
        const asset = ASSET_SYMBOLS[Math.floor(pseudoRandom(seed + 14 + p) * ASSET_SYMBOLS.length)];
        const type = pseudoRandom(seed + 15 + p) > 0.45 ? 'BUY' : 'SELL';
        const sizeInr = (Math.floor(pseudoRandom(seed + 16 + p) * 12) + 1) * 5000;
        const livePnL = Math.round((pseudoRandom(seed + 17 + p) * 5400 - 2400));
        activePositions.push({
          assetSymbol: asset,
          type: type as 'BUY' | 'SELL',
          sizeInr,
          livePnL,
        });
      }
    }

    clients.push({
      id: `client-${i + 1}`,
      name,
      avatarSeed: name.toLowerCase().replace(/\s+/g, '-'),
      city,
      accountId,
      balanceInr,
      dailyTradesCount,
      isDailyTrader,
      isCurrentlyOnline,
      lastOnline,
      lastOnlineMinutesAgo,
      todayPnLInr,
      winRate,
      activePositions,
    });
  }

  return clients;
}

// Cached singleton list
export const ALL_MOCK_CLIENTS = generateAllClients();

// Quick statistics
export const CLIENT_STATISTICS = {
  totalRegistered: TOTAL_REGISTERED_CLIENTS, // 2,700
  dailyActive: DAILY_ACTIVE_TARGET, // 1,548 (between 1,500 and 1,600)
  currentlyOnline: ALL_MOCK_CLIENTS.filter(c => c.isCurrentlyOnline).length,
  totalBalanceInr: ALL_MOCK_CLIENTS.reduce((acc, c) => acc + c.balanceInr, 0),
  dailyTradingVolumeInr: 42800000, // ~42.8 Million INR
};
