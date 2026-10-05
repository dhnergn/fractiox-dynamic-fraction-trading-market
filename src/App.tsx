import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FractionItem, InventoryItem, CustomerOrder } from './types/game';
import { 
  ALL_FRACTION_ITEMS, 
  GAME_LEVELS, 
  getRandomCustomerOrder 
} from './utils/fractionGameData';
import { soundEngine } from './utils/audio';

import { ArcadeHeader } from './components/ArcadeHeader';
import { TradeCard } from './components/TradeCard';
import { CustomerCounter } from './components/CustomerCounter';
import { PieCombiner } from './components/PieCombiner';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GameOverModal } from './components/GameOverModal';
import { LevelSelectModal } from './components/LevelSelectModal';

import confetti from 'canvas-confetti';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

export default function App() {
  // Level & Game State
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const currentLevel = GAME_LEVELS[levelIndex] || GAME_LEVELS[0];

  const [gameState, setGameState] = useState<'PLAYING' | 'LEVEL_CLEARED' | 'GAME_OVER'>('PLAYING');
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState<number>(1);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});

  // Modals
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Economy & Gameplay
  const [coins, setCoins] = useState<number>(150);
  const [profitEarned, setProfitEarned] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(currentLevel.durationSeconds);
  const [comboStreak, setComboStreak] = useState<number>(0);

  // Inventory: fractionId -> InventoryItem
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>({});

  // Fractions active in this level
  const [activeFractions, setActiveFractions] = useState<FractionItem[]>(() => {
    return ALL_FRACTION_ITEMS.filter((f) => currentLevel.fractionsIncluded.includes(f.id));
  });

  // Customer orders
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);

  // Statistics
  const [customersServed, setCustomersServed] = useState<number>(0);
  const [jackpotsClaimed, setJackpotsClaimed] = useState<number>(0);

  // Sound toggle
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  // Initialize or restart level
  const startLevel = useCallback((index: number) => {
    const lvl = GAME_LEVELS[index] || GAME_LEVELS[0];
    setLevelIndex(index);
    setCoins(150);
    setProfitEarned(0);
    setTimeLeft(lvl.durationSeconds);
    setComboStreak(0);
    setInventory({});
    setCustomersServed(0);
    setJackpotsClaimed(0);
    setGameState('PLAYING');

    const lvlFractions = ALL_FRACTION_ITEMS.filter((f) => lvl.fractionsIncluded.includes(f.id)).map((f) => ({
      ...f,
      currentPrice: Math.round(f.fairValue * (0.8 + Math.random() * 0.4)),
      prevPrice: f.fairValue,
    }));
    setActiveFractions(lvlFractions);

    // Initial customer order
    setCustomerOrders([getRandomCustomerOrder(lvlFractions)]);
  }, []);

  // Start initial level on mount
  useEffect(() => {
    startLevel(0);
  }, [startLevel]);

  // Main Game Loop: Ticking clock, price shifts, customer order timers
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = setInterval(() => {
      // 1. Decrement Level Timer
      setTimeLeft((t) => {
        if (t <= 1) {
          // Time expired! Check if goal was met
          return 0;
        }
        return t - 1;
      });

      // 2. Oscillate Fraction Prices
      setActiveFractions((prev) =>
        prev.map((f) => {
          const fair = f.fairValue;
          const current = f.currentPrice;

          // Pull slightly toward fair value, but allow big swing waves
          const pull = (fair - current) * 0.08;
          // Random price wave between -$6 and +$6
          const swing = (Math.random() - 0.5) * 12;

          let next = Math.round(current + pull + swing);
          // Keep within reasonable bounds (min $5, max fairValue * 1.5)
          next = Math.max(5, Math.min(Math.round(fair * 1.45), next));

          return {
            ...f,
            prevPrice: current,
            currentPrice: next,
            priceTrend: next >= current ? 'UP' : 'DOWN',
            history: [...f.history.slice(1), next],
          };
        })
      );

      // 3. Decrement Customer Timers
      setCustomerOrders((prevOrders) => {
        const updated = prevOrders
          .map((order) => ({
            ...order,
            timeLeft: order.timeLeft - 1,
          }))
          .filter((order) => order.timeLeft > 0);

        // Spawn replacement if order was cleared or expired
        if (updated.length < 2 && activeFractions.length > 0) {
          updated.push(getRandomCustomerOrder(activeFractions));
        }
        return updated;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [gameState, activeFractions]);

  // Check Win / Lose Condition
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    // Victory: Hit Target Profit
    if (profitEarned >= currentLevel.targetProfit) {
      soundEngine.playLevelWin();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }

      // Calculate star rating (1, 2, or 3 stars)
      let stars = 1;
      if (profitEarned >= currentLevel.starThresholds[2]) {
        stars = 3;
      } else if (profitEarned >= currentLevel.starThresholds[1]) {
        stars = 2;
      }

      setLevelStars((prev) => ({
        ...prev,
        [currentLevel.levelNumber]: Math.max(prev[currentLevel.levelNumber] || 0, stars),
      }));

      // Unlock next level
      setHighestUnlockedLevel((prev) => Math.max(prev, currentLevel.levelNumber + 1));
      setGameState('LEVEL_CLEARED');
    } else if (timeLeft <= 0) {
      // Time Ran Out
      setGameState('GAME_OVER');
    }
  }, [profitEarned, timeLeft, currentLevel, gameState]);

  // BUY ACTION
  const handleBuy = useCallback(
    (fractionId: string) => {
      const fraction = activeFractions.find((f) => f.id === fractionId);
      if (!fraction || coins < fraction.currentPrice) return;

      soundEngine.playBuy();

      const price = fraction.currentPrice;
      const isGoodBargain = price <= fraction.fairValue * 0.88;

      setCoins((c) => c - price);
      setInventory((prev) => {
        const existing = prev[fractionId];
        if (existing) {
          const newShares = existing.shares + 1;
          const newAvg = (existing.boughtAt * existing.shares + price) / newShares;
          return {
            ...prev,
            [fractionId]: {
              fractionId,
              shares: newShares,
              boughtAt: newAvg,
            },
          };
        } else {
          return {
            ...prev,
            [fractionId]: {
              fractionId,
              shares: 1,
              boughtAt: price,
            },
          };
        }
      });

      // If bought at bargain sale, build combo streak!
      if (isGoodBargain) {
        setComboStreak((s) => {
          const next = s + 1;
          soundEngine.playCombo(next);
          return next;
        });
      }
    },
    [activeFractions, coins]
  );

  // SELL ACTION
  const handleSell = useCallback(
    (fractionId: string) => {
      const fraction = activeFractions.find((f) => f.id === fractionId);
      const inv = inventory[fractionId];
      if (!fraction || !inv || inv.shares <= 0) return;

      soundEngine.playSell();

      const sellPrice = fraction.currentPrice;
      const profit = Math.max(0, sellPrice - inv.boughtAt);

      setCoins((c) => c + sellPrice);
      setProfitEarned((p) => p + profit);

      setInventory((prev) => {
        const remaining = inv.shares - 1;
        if (remaining <= 0) {
          const next = { ...prev };
          delete next[fractionId];
          return next;
        } else {
          return {
            ...prev,
            [fractionId]: {
              ...inv,
              shares: remaining,
            },
          };
        }
      });
    },
    [activeFractions, inventory]
  );

  // SERVE CUSTOMER ORDER
  const handleServeCustomer = useCallback(
    (orderId: string, fractionId: string) => {
      const order = customerOrders.find((o) => o.id === orderId);
      const fraction = activeFractions.find((f) => f.id === fractionId);
      const inv = inventory[fractionId];
      if (!order || !fraction || !inv || inv.shares <= 0) return;

      soundEngine.playCustomerSatisfied();

      const payout = Math.round(fraction.fairValue * order.bonusMultiplier);
      const profit = Math.max(10, payout - inv.boughtAt);

      setCoins((c) => c + payout);
      setProfitEarned((p) => p + profit);
      setCustomersServed((count) => count + 1);

      // Decrement inventory
      setInventory((prev) => {
        const remaining = inv.shares - 1;
        if (remaining <= 0) {
          const next = { ...prev };
          delete next[fractionId];
          return next;
        } else {
          return {
            ...prev,
            [fractionId]: {
              ...inv,
              shares: remaining,
            },
          };
        }
      });

      // Clear customer order & trigger celebration
      setCustomerOrders((prev) => prev.filter((o) => o.id !== orderId));
    },
    [customerOrders, activeFractions, inventory]
  );

  // WHOLE PIE FUSION / JACKPOT CLAIM
  const handleClaimJackpot = useCallback(
    (usedFractions: Record<string, number>, bonusReward: number) => {
      soundEngine.playJackpot();

      // Deduct from inventory
      setInventory((prev) => {
        const next = { ...prev };
        Object.entries(usedFractions).forEach(([id, count]) => {
          if (next[id]) {
            const rem = next[id].shares - count;
            if (rem <= 0) {
              delete next[id];
            } else {
              next[id] = { ...next[id], shares: rem };
            }
          }
        });
        return next;
      });

      const totalWin = 100 + bonusReward; // $100 par + $50 bonus = $150
      setCoins((c) => c + totalWin);
      setProfitEarned((p) => p + bonusReward + 30);
      setJackpotsClaimed((j) => j + 1);
    },
    []
  );

  // Star calculation for current modal
  const starsEarned = useMemo(() => {
    if (profitEarned >= currentLevel.starThresholds[2]) return 3;
    if (profitEarned >= currentLevel.starThresholds[1]) return 2;
    return 1;
  }, [profitEarned, currentLevel]);

  // Next level handler
  const handleNextLevel = () => {
    if (levelIndex < GAME_LEVELS.length - 1) {
      startLevel(levelIndex + 1);
    } else {
      startLevel(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Arcade Header HUD */}
      <ArcadeHeader
        coins={coins}
        profitEarned={profitEarned}
        targetProfit={currentLevel.targetProfit}
        timeLeft={timeLeft}
        levelNumber={currentLevel.levelNumber}
        levelTitle={currentLevel.title}
        comboStreak={comboStreak}
        isMuted={isMuted}
        toggleMute={toggleMute}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenLevelSelect={() => setShowLevelSelect(true)}
      />

      {/* Main Play Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 space-y-6">
        {/* Quick Rule Helper Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-base">💡</span>
            <span>
              <strong className="text-emerald-400">Green = SALE!</strong> Buy low! When prices jump to <strong className="text-rose-400">Red = HOT</strong>, sell high for big profit!
            </span>
          </div>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 font-mono cursor-pointer shrink-0"
          >
            <span>Learn in 10s</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top: Customer Counter Rush */}
        <CustomerCounter
          orders={customerOrders}
          fractions={activeFractions}
          inventory={inventory}
          onServeCustomer={handleServeCustomer}
        />

        {/* Middle: Whole Pie Fusion Combiner */}
        <PieCombiner
          fractions={activeFractions}
          inventory={inventory}
          onClaimJackpot={handleClaimJackpot}
        />

        {/* Fraction Slice Market Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏪</span>
              <h2 className="text-base font-black text-white uppercase tracking-wider font-mono">
                Fraction Slice Market (Live Prices)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Level {currentLevel.levelNumber} Items ({activeFractions.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeFractions.map((fraction) => (
              <TradeCard
                key={fraction.id}
                fraction={fraction}
                inventory={inventory[fraction.id]}
                coins={coins}
                onBuy={handleBuy}
                onSell={handleSell}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Floating Bottom Bag Indicator for Mobile / Quick View */}
      {Object.keys(inventory).length > 0 && (
        <div className="sticky bottom-4 z-30 max-w-md mx-auto w-full px-4">
          <div className="bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 shadow-xl shadow-cyan-500/10 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-bold">Your Bag:</span>
              <div className="flex gap-1.5 overflow-x-auto max-w-[200px]">
                {Object.values(inventory).map((item) => {
                  const f = activeFractions.find((itemF) => itemF.id === item.fractionId);
                  if (!f) return null;
                  return (
                    <span
                      key={f.id}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold"
                    >
                      {f.numerator}/{f.denominator}×{item.shares}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="font-mono text-emerald-400 font-black">
              Goal: ${profitEarned} / ${currentLevel.targetProfit}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {showLevelSelect && (
        <LevelSelectModal
          levels={GAME_LEVELS}
          currentLevelIndex={levelIndex}
          highestUnlockedLevel={highestUnlockedLevel}
          levelStars={levelStars}
          onSelectLevel={(idx) => startLevel(idx)}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {(gameState === 'LEVEL_CLEARED' || gameState === 'GAME_OVER') && (
        <GameOverModal
          isVictory={gameState === 'LEVEL_CLEARED'}
          profitEarned={profitEarned}
          targetProfit={currentLevel.targetProfit}
          stars={starsEarned}
          levelNumber={currentLevel.levelNumber}
          totalCustomersServed={customersServed}
          jackpotsClaimed={jackpotsClaimed}
          onNextLevel={levelIndex < GAME_LEVELS.length - 1 ? handleNextLevel : undefined}
          onRestartLevel={() => startLevel(levelIndex)}
        />
      )}
    </div>
  );
}
