import React, { useState } from 'react';
import { FractionItem, InventoryItem } from '../types/game';
import { VibrantFractionPie } from './VibrantFractionPie';
import { Sparkles, RotateCcw, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PieCombinerProps {
  fractions: FractionItem[];
  inventory: Record<string, InventoryItem>;
  onClaimJackpot: (usedFractions: Record<string, number>, bonusReward: number) => void;
}

export const PieCombiner: React.FC<PieCombinerProps> = ({
  fractions,
  inventory,
  onClaimJackpot,
}) => {
  const [selectedTokens, setSelectedTokens] = useState<Record<string, number>>({});

  const availableItems = Object.values(inventory).filter((i) => i.shares > 0);

  const handleAdd = (id: string) => {
    const owned = inventory[id]?.shares || 0;
    const current = selectedTokens[id] || 0;
    if (current < owned) {
      setSelectedTokens((prev) => ({
        ...prev,
        [id]: current + 1,
      }));
    }
  };

  const handleRemove = (id: string) => {
    const current = selectedTokens[id] || 0;
    if (current > 1) {
      setSelectedTokens((prev) => ({
        ...prev,
        [id]: current - 1,
      }));
    } else {
      setSelectedTokens((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleClear = () => {
    setSelectedTokens({});
  };

  // Calculate sum of percentages
  let totalPercent = 0;
  Object.entries(selectedTokens).forEach(([id, count]) => {
    const f = fractions.find((item) => item.id === id);
    if (f) {
      totalPercent += f.percentage * count;
    }
  });

  const isExactWhole = Math.round(totalPercent) === 100;
  const isOver = totalPercent > 100.5;

  const handleBake = () => {
    if (!isExactWhole) return;
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch {
      // ignore
    }
    onClaimJackpot(selectedTokens, 50); // $50 jackpot bonus
    setSelectedTokens({});
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🥧</span>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
              Whole Pie Fusion (100% Unity = +$50 Jackpot!)
            </h3>
            <p className="text-xs text-slate-400">
              Combine slices from your bag (e.g. 1/4 + 3/4 or 1/3 + 2/3) to make a full 100% pie!
            </p>
          </div>
        </div>

        {Object.keys(selectedTokens).length > 0 && (
          <button
            onClick={handleClear}
            className="self-end sm:self-center text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Tray</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left 2 Cols: Fusion Pan */}
        <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 font-semibold">Pie Progress:</span>
            <span
              className={`font-black text-sm ${
                isExactWhole
                  ? 'text-emerald-400'
                  : isOver
                  ? 'text-rose-400'
                  : 'text-cyan-400'
              }`}
            >
              {Math.round(totalPercent)}% / 100% {isExactWhole ? '🎉 READY TO BAKE!' : ''}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative mb-3">
            <div
              style={{ width: `${Math.min(totalPercent, 100)}%` }}
              className={`h-full transition-all duration-300 ${
                isExactWhole
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-md shadow-emerald-500/50'
                  : isOver
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
            />
          </div>

          {/* Slices on the tray */}
          <div className="min-h-[44px] flex flex-wrap items-center gap-2">
            {Object.keys(selectedTokens).length === 0 ? (
              <span className="text-xs text-slate-500 italic">
                Tap your owned slices below to add them to the baking tray!
              </span>
            ) : (
              Object.entries(selectedTokens).map(([id, count]) => {
                const fraction = fractions.find((f) => f.id === id);
                if (!fraction) return null;
                return (
                  <button
                    key={id}
                    onClick={() => handleRemove(id)}
                    title="Click to remove"
                    className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono flex items-center gap-1.5 text-white cursor-pointer transition-colors"
                  >
                    <span>{fraction.emoji}</span>
                    <span className="font-bold">{fraction.numerator}/{fraction.denominator}</span>
                    <span className="text-cyan-400">×{count}</span>
                    <span className="text-slate-400 hover:text-rose-400 ml-1">✕</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Bake / Fusion Action */}
        <div>
          {isExactWhole ? (
            <button
              onClick={handleBake}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transform hover:scale-105 transition-all cursor-pointer animate-bounce"
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>CLAIM $50 JACKPOT!</span>
            </button>
          ) : (
            <div className="text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
              {isOver ? (
                <span className="text-rose-400 font-bold">
                  Too much! Remove a slice to make exactly 100%.
                </span>
              ) : (
                <span>
                  Need <strong className="text-white">{Math.round(100 - totalPercent)}%</strong> more to complete the whole pie.
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Add from Inventory */}
      {availableItems.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-[11px] font-mono text-slate-400 shrink-0">Your Bag:</span>
          {availableItems.map((item) => {
            const fraction = fractions.find((f) => f.id === item.fractionId);
            if (!fraction) return null;
            const inTray = selectedTokens[fraction.id] || 0;
            const canAdd = inTray < item.shares;

            return (
              <button
                key={fraction.id}
                onClick={() => handleAdd(fraction.id)}
                disabled={!canAdd}
                className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 border border-slate-700 text-xs font-mono flex items-center gap-1.5 text-white shrink-0 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <span>{fraction.emoji}</span>
                <span className="font-bold">{fraction.numerator}/{fraction.denominator}</span>
                <span className="text-[10px] text-slate-400">({item.shares - inTray} left)</span>
                <Plus className="w-3 h-3 text-emerald-400" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
