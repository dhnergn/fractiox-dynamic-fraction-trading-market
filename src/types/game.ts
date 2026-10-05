export type GameMode = 'CAMPAIGN' | 'ARCADE' | 'PRACTICE';

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'LEVEL_CLEARED' | 'GAME_OVER';

export interface FractionItem {
  id: string;
  name: string;
  numerator: number;
  denominator: number;
  percentage: number; // e.g. 50 for 1/2
  fairValue: number;  // $50 for 1/2
  currentPrice: number;
  prevPrice: number;
  priceTrend: 'UP' | 'DOWN' | 'STABLE';
  color: string;
  emoji: string;
  history: number[];
}

export interface InventoryItem {
  fractionId: string;
  shares: number;
  boughtAt: number;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  avatar: string;
  requestedFractionId: string;
  bonusMultiplier: number; // e.g. 1.4x payout
  timeLeft: number;        // seconds
  maxTime: number;
}

export interface GameLevel {
  levelNumber: number;
  title: string;
  description: string;
  targetProfit: number;
  durationSeconds: number;
  fractionsIncluded: string[]; // fraction IDs
  starThresholds: [number, number, number]; // profits for 1, 2, 3 stars
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}
