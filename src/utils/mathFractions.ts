import { FractionAsset, MarketNews, ClientOrderChallenge } from '../types/market';

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function lcm(a: number, b: number): number {
  return (!a || !b) ? 0 : Math.abs((a * b) / gcd(a, b));
}

export function simplifyFraction(num: number, den: number): { num: number; den: number } {
  const divisor = gcd(num, den);
  return {
    num: num / divisor,
    den: den / divisor,
  };
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatPercent(num: number, includeSign: boolean = false): string {
  const sign = includeSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
}

export const INITIAL_FRACTIONS: FractionAsset[] = [
  // Halves & Quarters
  {
    id: 'half_1_2',
    ticker: '$HALF',
    name: 'The Unit Half',
    numerator: 1,
    denominator: 2,
    decimal: 0.5,
    truePercent: 50,
    fairPrice: 50.00,
    currentPrice: 48.50,
    previousPrice: 48.50,
    openPrice: 50.00,
    highPrice: 51.20,
    lowPrice: 47.80,
    priceHistory: [50.0, 49.5, 49.0, 48.5, 48.5],
    volume: 1420,
    category: 'Halves & Quarters',
    accentColor: '#38bdf8', // sky
    description: 'The golden benchmark of fractional liquidity. Exactly 50.0% of unity.',
  },
  {
    id: 'quarter_1_4',
    ticker: '$1QRTR',
    name: 'First Quarter',
    numerator: 1,
    denominator: 4,
    decimal: 0.25,
    truePercent: 25,
    fairPrice: 25.00,
    currentPrice: 26.20,
    previousPrice: 26.20,
    openPrice: 25.00,
    highPrice: 27.00,
    lowPrice: 24.50,
    priceHistory: [25.0, 25.4, 25.8, 26.2, 26.2],
    volume: 980,
    category: 'Halves & Quarters',
    accentColor: '#818cf8', // indigo
    description: 'Standard 25% quadrant asset. Vital building block for synthetics.',
  },
  {
    id: 'quarter_2_4',
    ticker: '$2QRTR',
    name: 'Two Quarters (50% Parity)',
    numerator: 2,
    denominator: 4,
    decimal: 0.5,
    truePercent: 50,
    fairPrice: 50.00,
    currentPrice: 52.80, // mispriced relative to $HALF!
    previousPrice: 52.80,
    openPrice: 50.00,
    highPrice: 53.50,
    lowPrice: 49.50,
    priceHistory: [50.0, 51.0, 51.9, 52.8, 52.8],
    volume: 640,
    category: 'Halves & Quarters',
    accentColor: '#0ea5e9', // ocean
    description: 'Equivalent to 1/2. Often drifts from $HALF creating prime arbitrage.',
  },
  {
    id: 'quarter_3_4',
    ticker: '$3QRTR',
    name: 'Three Quarters',
    numerator: 3,
    denominator: 4,
    decimal: 0.75,
    truePercent: 75,
    fairPrice: 75.00,
    currentPrice: 72.50,
    previousPrice: 72.50,
    openPrice: 75.00,
    highPrice: 76.10,
    lowPrice: 71.80,
    priceHistory: [75.0, 74.2, 73.0, 72.5, 72.5],
    volume: 1850,
    category: 'Halves & Quarters',
    accentColor: '#3b82f6', // blue
    description: 'Heavyweight 75% equity fraction. High institutional demand.',
  },

  // Thirds & Sixths
  {
    id: 'third_1_3',
    ticker: '$1THRD',
    name: 'Unit Third',
    numerator: 1,
    denominator: 3,
    decimal: 1 / 3,
    truePercent: 33.333,
    fairPrice: 33.33,
    currentPrice: 35.10,
    previousPrice: 35.10,
    openPrice: 33.33,
    highPrice: 36.00,
    lowPrice: 32.50,
    priceHistory: [33.33, 34.0, 34.5, 35.1, 35.1],
    volume: 1100,
    category: 'Thirds & Sixths',
    accentColor: '#a855f7', // purple
    description: 'Perpetual repeating decimal 0.333... Trading at continuous flow.',
  },
  {
    id: 'third_2_3',
    ticker: '$2THRD',
    name: 'Two Thirds',
    numerator: 2,
    denominator: 3,
    decimal: 2 / 3,
    truePercent: 66.667,
    fairPrice: 66.67,
    currentPrice: 64.20,
    previousPrice: 64.20,
    openPrice: 66.67,
    highPrice: 67.50,
    lowPrice: 63.80,
    priceHistory: [66.67, 65.5, 64.9, 64.2, 64.2],
    volume: 1320,
    category: 'Thirds & Sixths',
    accentColor: '#c084fc', // light purple
    description: 'The dominant 66.67% fraction. Merges with 1/3 for instant full par.',
  },
  {
    id: 'sixth_1_6',
    ticker: '$1SIX',
    name: 'Unit Sixth',
    numerator: 1,
    denominator: 6,
    decimal: 1 / 6,
    truePercent: 16.667,
    fairPrice: 16.67,
    currentPrice: 16.20,
    previousPrice: 16.20,
    openPrice: 16.67,
    highPrice: 17.50,
    lowPrice: 15.80,
    priceHistory: [16.67, 16.4, 16.3, 16.2, 16.2],
    volume: 720,
    category: 'Thirds & Sixths',
    accentColor: '#9333ea', // deep purple
    description: 'High volatility sub-unit. Multiplies synthetic yields when paired.',
  },
  {
    id: 'sixth_5_6',
    ticker: '$5SIX',
    name: 'Five Sixths',
    numerator: 5,
    denominator: 6,
    decimal: 5 / 6,
    truePercent: 83.333,
    fairPrice: 83.33,
    currentPrice: 86.40,
    previousPrice: 86.40,
    openPrice: 83.33,
    highPrice: 87.20,
    lowPrice: 82.80,
    priceHistory: [83.33, 84.5, 85.8, 86.4, 86.4],
    volume: 910,
    category: 'Thirds & Sixths',
    accentColor: '#7e22ce',
    description: 'High-value 83.33% yield asset. Highly sought after by funds.',
  },

  // Fifths & Tenths
  {
    id: 'fifth_1_5',
    ticker: '$1FIFTH',
    name: 'Unit Fifth',
    numerator: 1,
    denominator: 5,
    decimal: 0.2,
    truePercent: 20,
    fairPrice: 20.00,
    currentPrice: 19.10,
    previousPrice: 19.10,
    openPrice: 20.00,
    highPrice: 21.00,
    lowPrice: 18.50,
    priceHistory: [20.0, 19.8, 19.4, 19.1, 19.1],
    volume: 1250,
    category: 'Fifths & Tenths',
    accentColor: '#10b981', // emerald
    description: 'Clean metric base unit (20.0%). Very stable price floor.',
  },
  {
    id: 'fifth_2_5',
    ticker: '$2FIFTH',
    name: 'Two Fifths',
    numerator: 2,
    denominator: 5,
    decimal: 0.4,
    truePercent: 40,
    fairPrice: 40.00,
    currentPrice: 41.50,
    previousPrice: 41.50,
    openPrice: 40.00,
    highPrice: 42.20,
    lowPrice: 39.50,
    priceHistory: [40.0, 40.8, 41.2, 41.5, 41.5],
    volume: 860,
    category: 'Fifths & Tenths',
    accentColor: '#059669',
    description: '40.0% standard swap. Direct pairing with 3/5 gives 100% parity.',
  },
  {
    id: 'fifth_4_5',
    ticker: '$4FIFTH',
    name: 'Four Fifths',
    numerator: 4,
    denominator: 5,
    decimal: 0.8,
    truePercent: 80,
    fairPrice: 80.00,
    currentPrice: 77.20,
    previousPrice: 77.20,
    openPrice: 80.00,
    highPrice: 81.00,
    lowPrice: 76.50,
    priceHistory: [80.0, 79.1, 78.0, 77.2, 77.2],
    volume: 1640,
    category: 'Fifths & Tenths',
    accentColor: '#34d399',
    description: 'The 80.0% institutional pillar. Low default rate in liquidity pools.',
  },
  {
    id: 'tenth_7_10',
    ticker: '$7TENTH',
    name: 'Seven Tenths',
    numerator: 7,
    denominator: 10,
    decimal: 0.7,
    truePercent: 70,
    fairPrice: 70.00,
    currentPrice: 73.10,
    previousPrice: 73.10,
    openPrice: 70.00,
    highPrice: 74.00,
    lowPrice: 69.20,
    priceHistory: [70.0, 71.0, 72.3, 73.1, 73.1],
    volume: 1120,
    category: 'Fifths & Tenths',
    accentColor: '#047857',
    description: 'Decenary 70.0% index asset. Frequently utilized in risk parity.',
  },

  // Eighths & Twelfths
  {
    id: 'eighth_1_8',
    ticker: '$1OCTO',
    name: 'Unit Eighth',
    numerator: 1,
    denominator: 8,
    decimal: 0.125,
    truePercent: 12.5,
    fairPrice: 12.50,
    currentPrice: 11.80,
    previousPrice: 11.80,
    openPrice: 12.50,
    highPrice: 13.20,
    lowPrice: 11.20,
    priceHistory: [12.5, 12.1, 11.9, 11.8, 11.8],
    volume: 780,
    category: 'Eighths & Twelfths',
    accentColor: '#f59e0b', // amber
    description: 'Binary subdivision unit (12.5%). Used in micro-spreads.',
  },
  {
    id: 'eighth_3_8',
    ticker: '$3OCTO',
    name: 'Three Eighths',
    numerator: 3,
    denominator: 8,
    decimal: 0.375,
    truePercent: 37.5,
    fairPrice: 37.50,
    currentPrice: 38.90,
    previousPrice: 38.90,
    openPrice: 37.50,
    highPrice: 39.80,
    lowPrice: 36.80,
    priceHistory: [37.5, 37.9, 38.4, 38.9, 38.9],
    volume: 670,
    category: 'Eighths & Twelfths',
    accentColor: '#d97706',
    description: 'Exact 37.5% Fibonacci-adjacent fractional instrument.',
  },
  {
    id: 'eighth_5_8',
    ticker: '$5OCTO',
    name: 'Five Eighths',
    numerator: 5,
    denominator: 8,
    decimal: 0.625,
    truePercent: 62.5,
    fairPrice: 62.50,
    currentPrice: 59.40,
    previousPrice: 59.40,
    openPrice: 62.50,
    highPrice: 63.80,
    lowPrice: 58.50,
    priceHistory: [62.5, 61.2, 60.1, 59.4, 59.4],
    volume: 1390,
    category: 'Eighths & Twelfths',
    accentColor: '#b45309',
    description: 'Golden mean proxy (62.5%). High demand from quant traders.',
  },
  {
    id: 'twelfth_7_12',
    ticker: '$7TWELF',
    name: 'Seven Twelfths',
    numerator: 7,
    denominator: 12,
    decimal: 7 / 12,
    truePercent: 58.333,
    fairPrice: 58.33,
    currentPrice: 61.20,
    previousPrice: 61.20,
    openPrice: 58.33,
    highPrice: 62.50,
    lowPrice: 57.80,
    priceHistory: [58.33, 59.2, 60.4, 61.2, 61.2],
    volume: 840,
    category: 'Eighths & Twelfths',
    accentColor: '#eab308', // gold
    description: 'Complex duodecimal fraction (58.33%). High arbitrage volatility.',
  },
];

export const NEWS_DATABASE: Omit<MarketNews, 'id' | 'timestamp'>[] = [
  {
    headline: 'Central Bank lowers Denominator Reserve Ratio',
    impactType: 'BULLISH',
    multiplier: 1.08,
    description: 'Market liquidity expands across all fractions as investors seek high-percentage yields.',
  },
  {
    headline: 'Surprise Decimal Devaluation hits Fifths & Tenths',
    impactType: 'BEARISH',
    affectedFractionIds: ['fifth_1_5', 'fifth_2_5', 'fifth_4_5', 'tenth_7_10'],
    multiplier: 0.88,
    description: 'Metric fractions experience sudden discount pressure, opening rare value accumulation zones.',
  },
  {
    headline: 'Prime Numerators Rally on Theoretical Math Endorsement',
    impactType: 'BULLISH',
    affectedFractionIds: ['quarter_3_4', 'third_2_3', 'sixth_5_6', 'eighth_3_8', 'eighth_5_8', 'twelfth_7_12'],
    multiplier: 1.12,
    description: 'Fractions with numerators 3, 5, and 7 jump to premium pricing over fair par.',
  },
  {
    headline: 'Duodecimal Short Squeeze: Twelfths & Eighths spike',
    impactType: 'VOLATILE',
    affectedFractionIds: ['eighth_1_8', 'eighth_3_8', 'eighth_5_8', 'twelfth_7_12'],
    multiplier: 1.15,
    description: 'Short sellers caught off guard as high-denominator fractions spike in rapid trading.',
  },
  {
    headline: 'Algorithmic Arbitrageurs Force Parity Mean-Reversion',
    impactType: 'NEUTRAL',
    multiplier: 1.0,
    description: 'Major quant funds trade mispriced spreads, pulling discount assets back towards 100% fair value.',
  },
  {
    headline: 'Halves & Quarters Index declares record dividend',
    impactType: 'BULLISH',
    affectedFractionIds: ['half_1_2', 'quarter_1_4', 'quarter_2_4', 'quarter_3_4'],
    multiplier: 1.09,
    description: 'Blue-chip quadrant instruments see strong inflow from institutional balance sheets.',
  },
  {
    headline: 'Fraction Synthesizer Surge: Demand for 1.0 Wholes hits peak',
    impactType: 'BULLISH',
    multiplier: 1.07,
    description: 'Wholesale synthesizers are locking up inventory, creating a supply deficit across the floor.',
  },
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first_trade',
    title: 'Floor Debut',
    description: 'Execute your first fraction buy or sell order.',
    iconName: 'TrendingUp',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'arbitrage_master',
    title: 'Parity Arbitrageur',
    description: 'Capitalize on 3 equivalent fraction price spreads.',
    iconName: 'Zap',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'whole_in_one',
    title: 'Whole in One',
    description: 'Synthesize exactly 1.0 whole fraction and claim liquidation bonus.',
    iconName: 'Target',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'value_investor',
    title: 'Bargain Hunter',
    description: 'Buy a fraction trading at more than 10% discount to fair value.',
    iconName: 'Tag',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'quant_millionaire',
    title: 'Cap Table Titan',
    description: 'Reach a portfolio net worth of $2,500.00.',
    iconName: 'Award',
    unlocked: false,
    progress: 0,
    maxProgress: 2500,
  },
  {
    id: 'challenge_ace',
    title: 'Pit Floor Ace',
    description: 'Successfully complete 5 rapid client math challenges.',
    iconName: 'CheckCircle2',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
];

export function generateClientChallenge(existingFractions: FractionAsset[]): ClientOrderChallenge {
  const challengeTypes: ('RANGE_TARGET' | 'EQUIVALENCE' | 'COMPARISON' | 'MERGE_TARGET')[] = [
    'RANGE_TARGET',
    'EQUIVALENCE',
    'COMPARISON',
    'MERGE_TARGET',
  ];
  const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
  const clients = ['Vanguard Math Fund', 'Euler Capital', 'Fibonacci LP', 'Pythagoras Quant', 'Gauss Prime Desk'];
  const clientName = clients[Math.floor(Math.random() * clients.length)];
  const id = `order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (type === 'RANGE_TARGET') {
    // Range between two percentages, e.g., 55% to 75%
    const min = Math.floor(Math.random() * 5) * 10 + 20; // 20, 30, 40, 50, 60
    const max = min + 20; // 40, 50, 60, 70, 80
    return {
      id,
      clientName,
      type,
      targetMinPercent: min,
      targetMaxPercent: max,
      orderPrompt: `Client needs any fraction asset with an intrinsic percentage strictly between ${min}% and ${max}%. Select a matching asset from the market!`,
      rewardCash: 75,
      rewardXp: 120,
      durationSeconds: 45,
      remainingSeconds: 45,
      completed: false,
      failed: false,
    };
  } else if (type === 'EQUIVALENCE') {
    return {
      id,
      clientName,
      type,
      orderPrompt: `Arbitrage request: Identify two equivalent fractions currently trading at different prices ($HALF vs $2QRTR) and buy the cheaper one!`,
      rewardCash: 90,
      rewardXp: 150,
      durationSeconds: 40,
      remainingSeconds: 40,
      completed: false,
      failed: false,
    };
  } else if (type === 'COMPARISON') {
    const randomAsset = existingFractions[Math.floor(Math.random() * existingFractions.length)];
    const operator = Math.random() > 0.5 ? '>' : '<';
    const opWord = operator === '>' ? 'GREATER than' : 'LESS than';
    return {
      id,
      clientName,
      type,
      comparisonTargetId: randomAsset.id,
      comparisonOperator: operator,
      orderPrompt: `Institutional hedging order: Select and buy any fraction asset strictly ${opWord} ${randomAsset.numerator}/${randomAsset.denominator} (${randomAsset.truePercent.toFixed(1)}%).`,
      rewardCash: 85,
      rewardXp: 130,
      durationSeconds: 35,
      remainingSeconds: 35,
      completed: false,
      failed: false,
    };
  } else {
    // MERGE_TARGET
    return {
      id,
      clientName,
      type,
      targetSum: 1.0,
      orderPrompt: `Synthesizer urgency: Combine any set of fractions in your portfolio to reach exactly 1.0 Whole (100% unity) and liquidate!`,
      rewardCash: 120,
      rewardXp: 200,
      durationSeconds: 60,
      remainingSeconds: 60,
      completed: false,
      failed: false,
    };
  }
}
