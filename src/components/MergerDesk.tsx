import React, { useState } from 'react';
import { FractionAsset, Position } from '../types/market';
import { formatCurrency, formatPercent } from '../utils/mathFractions';
import { FractionPie } from './FractionPie';
import { FractionBar } from './FractionBar';
import { Layers, Plus, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MergerDeskProps {
  fractions: FractionAsset[];
  positions: Record<string, Position>;
  onLiquidateWhole: (usedFractionQuantities: Record<string, number>, bonusReward: number) => void;
  onQuickBuy: (fractionId: string) => void;
}

export const MergerDesk: React.FC<MergerDeskProps> = ({
  fractions,
  positions,
  onLiquidateWhole,
  onQuickBuy,
}) => {
  // Selected counts of fractions to combine
  const [selectedTokens, setSelectedTokens] = useState<Record<string, number>>({});

  const availablePositions = Object.values(positions).filter((p) => p.shares > 0);

  const handleAddToken = (id: string) => {
    const currentOwned = positions[id]?.shares || 0;
    const currentSelected = selectedTokens[id] || 0;
    if (currentSelected < currentOwned) {
      setSelectedTokens((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    }
  };

  const handleRemoveToken = (id: string) => {
    const currentSelected = selectedTokens[id] || 0;
    if (currentSelected > 1) {
      setSelectedTokens((prev) => ({
        ...prev,
        [id]: prev[id] - 1,
      }));
    } else {
      setSelectedTokens((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleReset = () => {
    setSelectedTokens({});
  };

  // Calculate total combined decimal sum
  let totalDecimal = 0;
  Object.entries(selectedTokens).forEach(([id, count]) => {
    const asset = fractions.find((f) => f.id === id);
    if (asset) {
      totalDecimal += asset.decimal * count;
    }
  });

  const isExactWhole = Math.abs(totalDecimal - 1.0) < 0.0001;
  const isOverWhole = totalDecimal > 1.0001;
  const percentageSum = totalDecimal * 100;

  const handleExecuteLiquidate = () => {
    if (!isExactWhole) return;

    // Trigger visual confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#38bdf8', '#fbbf24', '#a855f7'],
      });
    } catch {
      // ignore
    }

    const bonusReward = 25.0;
    onLiquidateWhole(selectedTokens, bonusReward);
    setSelectedTokens({});
  };

  return (
    <div className="space-y-6">
      {/* Synthesizer Desk Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 font-mono">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Synthetic Fractions Laboratory</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          Synthesize 1.0 Whole Fraction
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Combine fractional components from your inventory (e.g.{' '}
          <strong className="text-sky-400">1/4 + 3/4 = 1.0</strong>, or{' '}
          <strong className="text-sky-400">1/3 + 2/3 = 1.0</strong>, or{' '}
          <strong className="text-sky-400">3/8 + 5/8 = 1.0</strong>) to assemble exactly{' '}
          <strong className="text-emerald-400">1 Whole (100%)</strong>. Liquidate a completed whole to receive the full $100.00 par plus an algorithmic <strong>+$25.00 cash synthesis bonus</strong>!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Crucible / Mixing Reactor */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Reaction Chamber</span>
                <span className="text-xs font-mono text-slate-400">
                  ({Object.keys(selectedTokens).length} assets in synthesis)
                </span>
              </div>
              <button
                onClick={handleReset}
                disabled={Object.keys(selectedTokens).length === 0}
                className="text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Sum Visualizer Meter */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Current Assembled Value:</span>
                <span
                  className={`text-base font-bold ${
                    isExactWhole
                      ? 'text-emerald-400'
                      : isOverWhole
                      ? 'text-rose-400'
                      : 'text-sky-400'
                  }`}
                >
                  {totalDecimal.toFixed(3)} ({formatPercent(percentageSum)}) / 1.000 Whole
                </span>
              </div>

              {/* Progress visual */}
              <div className="h-4 bg-slate-800 rounded-lg overflow-hidden relative">
                <div
                  style={{ width: `${Math.min(percentageSum, 100)}%` }}
                  className={`h-full transition-all duration-300 ${
                    isExactWhole
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/30'
                      : isOverWhole
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                  }`}
                />
                {/* Target Marker at 100% */}
                <div className="absolute top-0 bottom-0 right-0 w-1 bg-amber-400" />
              </div>

              {/* State feedback text */}
              <div className="mt-2 text-xs font-mono text-center">
                {isExactWhole && (
                  <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Exact 1.0 Parity Achieved! Ready to Liquidate at +$25.00 Bonus!
                  </span>
                )}
                {isOverWhole && (
                  <span className="text-rose-400 font-bold">
                    Exceeded 1.0! Remove some tokens to achieve exact 1.0 parity.
                  </span>
                )}
                {!isExactWhole && !isOverWhole && (
                  <span className="text-slate-400">
                    Remaining to 1.0 Whole: {((1.0 - totalDecimal) * 100).toFixed(1)}% ({((1.0 - totalDecimal)).toFixed(3)})
                  </span>
                )}
              </div>
            </div>

            {/* Chamber Selected Tokens */}
            <div className="min-h-[140px] bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 mb-4">
              <div className="text-xs text-slate-400 mb-2 font-mono">Tokens in Chamber:</div>
              {Object.keys(selectedTokens).length === 0 ? (
                <div className="text-xs text-slate-400 italic py-6 text-center">
                  Select owned fractions from your inventory on the right to load into the synthesis chamber.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedTokens).map(([id, count]) => {
                    const asset = fractions.find((f) => f.id === id);
                    if (!asset) return null;
                    return (
                      <div
                        key={id}
                        className="bg-slate-900 border border-slate-700/70 rounded-lg py-1.5 px-3 flex items-center gap-2 text-xs"
                      >
                        <FractionPie
                          numerator={asset.numerator}
                          denominator={asset.denominator}
                          size={24}
                          color={asset.accentColor}
                        />
                        <span className="font-mono font-bold text-white">{asset.ticker}</span>
                        <span className="text-slate-400 font-mono">
                          {asset.numerator}/{asset.denominator}
                        </span>
                        <span className="font-mono text-emerald-400 font-semibold">×{count}</span>
                        <button
                          onClick={() => handleRemoveToken(id)}
                          className="ml-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Liquidate Action Button */}
          <button
            onClick={handleExecuteLiquidate}
            disabled={!isExactWhole}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-30 disabled:hover:from-emerald-500 cursor-pointer disabled:cursor-not-allowed transition-all"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Liquidate Assembled Whole (Par $100.00 + $25.00 Bonus)</span>
          </button>
        </div>

        {/* Right Col: Owned Inventory Available to Load */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-sm font-bold text-white mb-3">
            Available Inventory
          </div>

          {availablePositions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-xs text-slate-400 mb-3">
                You currently hold no fractions in your portfolio.
              </div>
              <p className="text-[11px] text-slate-400 mb-4">
                Visit the Market Floor to buy fractions, or quick buy common building blocks below!
              </p>
              <div className="space-y-2">
                {fractions.slice(0, 3).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => onQuickBuy(f.id)}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-mono flex items-center justify-between transition-colors"
                  >
                    <span>{f.ticker} ({f.numerator}/{f.denominator})</span>
                    <span className="text-emerald-400">{formatCurrency(f.currentPrice)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {availablePositions.map((pos) => {
                const asset = fractions.find((f) => f.id === pos.fractionId);
                if (!asset) return null;
                const loaded = selectedTokens[asset.id] || 0;
                const remaining = pos.shares - loaded;

                return (
                  <div
                    key={asset.id}
                    className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FractionPie
                        numerator={asset.numerator}
                        denominator={asset.denominator}
                        size={30}
                        color={asset.accentColor}
                      />
                      <div>
                        <div className="font-mono font-bold text-white">{asset.ticker}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {asset.numerator}/{asset.denominator} · Available: {remaining}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToken(asset.id)}
                      disabled={remaining <= 0}
                      className="py-1 px-2.5 rounded bg-sky-950 hover:bg-sky-900 border border-sky-800/60 disabled:opacity-30 text-sky-300 font-bold font-mono text-xs flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
