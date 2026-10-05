export interface FractionAsset {
  id: string;
  ticker: string;
  name: string;
  numerator: number;
  denominator: number;
  decimal: number;
  truePercent: number; // e.g. 75 for 3/4
  fairPrice: number;   // $1 per 1% intrinsic par, so 75.00
  currentPrice: number;
  previousPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  priceHistory: number[];
  volume: number;
  category: 'Halves & Quarters' | 'Thirds & Sixths' | 'Fifths & Tenths' | 'Eighths & Twelfths';
  accentColor: string;
  description: string;
}

export interface Position {
  fractionId: string;
  shares: number;
  averageBuyPrice: number;
  totalInvested: number;
}

export interface TradeRecord {
  id: string;
  timestamp: number;
  fractionId: string;
  ticker: string;
  type: 'BUY' | 'SELL' | 'ARBITRAGE' | 'MERGE_WHOLE';
  shares: number;
  price: number;
  total: number;
  pnl?: number;
  note?: string;
}

export interface MarketNews {
  id: string;
  timestamp: number;
  headline: string;
  impactType: 'BULLISH' | 'BEARISH' | 'VOLATILE' | 'NEUTRAL';
  affectedFractionIds?: string[];
  multiplier?: number;
  description: string;
}

export interface ClientOrderChallenge {
  id: string;
  clientName: string;
  orderPrompt: string;
  type: 'RANGE_TARGET' | 'EQUIVALENCE' | 'COMPARISON' | 'MERGE_TARGET';
  targetMinPercent?: number;
  targetMaxPercent?: number;
  comparisonTargetId?: string;
  comparisonOperator?: '>' | '<' | '=';
  targetSum?: number; // e.g. 1.0 for whole
  rewardCash: number;
  rewardXp: number;
  durationSeconds: number;
  remainingSeconds: number;
  completed: boolean;
  failed: boolean;
}

export interface GameAchievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
}

export type DisplayNotation = 'FRACTION' | 'PERCENT' | 'DECIMAL' | 'ALL';

export type GameSpeed = 'SLOW' | 'NORMAL' | 'FAST' | 'FRENZY';

export type ActiveTab = 'MARKET' | 'PORTFOLIO' | 'ARBITRAGE' | 'SYNTHESIZER' | 'CHALLENGES';
