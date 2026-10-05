import React from 'react';
import { FractionAsset } from '../types/market';
import { formatCurrency, formatPercent } from '../utils/mathFractions';
import { FractionPie } from './FractionPie';
import { Zap, ArrowRight, TrendingUp } from 'lucide-react';

interface ArbitrageDeskProps {
  fractions: FractionAsset[];
  cash: number;
  onExecuteArbitrage: (buyAssetId: string, sellAssetId: string, spreadProfit: number) => void;
}

interface ArbitragePair {
  decimal: number;
  cheaperAsset: FractionAsset;
  expensiveAsset: FractionAsset;
  spreadPerShare: number;
  spreadPercent: number;
}

export const ArbitrageDesk: React.FC<ArbitrageDeskProps> = ({
  fractions,
  cash,
  onExecuteArbitrage,
}) => {
  // Group fractions by their mathematical decimal value to 4 decimal places
  const decimalGroups: Record<string, FractionAsset[]> = {};

  fractions.forEach((asset) => {
    const key = asset.decimal.toFixed(4);
    if (!decimalGroups[key]) {
      decimalGroups[key] = [];
    }
    decimalGroups[key].push(asset);
  });

  const pairs: ArbitragePair[] = [];

  Object.entries(decimalGroups).forEach(([, assets]) => {
    if (assets.length > 1) {
      // Find pairs with price differences
      for (let i = 0; i < assets.length; i++) {
        for (let j = i + 1; j < assets.length; j++) {
          const a = assets[i];
          const b = assets[j];
          const diff = Math.abs(a.currentPrice - b.currentPrice);

          if (diff >= 0.25) { // meaningful spread
            const cheaper = a.currentPrice < b.currentPrice ? a : b;
            const expensive = a.currentPrice < b.currentPrice ? b : a;
            pairs.push({
              decimal: cheaper.decimal,
              cheaperAsset: cheaper,
              expensiveAsset: expensive,
              spreadPerShare: diff,
              spreadPercent: (diff / cheaper.currentPrice) * 100,
            });
          }
        }
      }
    }
  });

  // Sort by highest spread profit first
  pairs.sort((a, b) => b.spreadPerShare - a.spreadPerShare);

  return (
    <div className="space-y-6">
      {/* Educational Banner & Quant Desk Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 font-mono">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Mathematical Equivalence Arbitrage Desk</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
            Exploit Parity Mispricings
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            When two fractions represent the exact same mathematical quantity (e.g.{' '}
            <strong className="text-emerald-400">1/2 = 2/4</strong> or{' '}
            <strong className="text-emerald-400">2/5 = 4/10</strong>), their fundamental value is identical.
            Whenever market irrationality creates a pricing spread, execute instant arbitrage: buy the undervalued fraction and pocket the difference!
          </p>
        </div>
      </div>

      {/* Active Arbitrage Spreads */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span>Live Radar Scans</span>
            <span className="text-xs font-mono text-slate-400">
              ({pairs.length} {pairs.length === 1 ? 'spread detected' : 'spreads detected'})
            </span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Available Capital: <strong className="text-white">{formatCurrency(cash)}</strong>
          </span>
        </div>

        {pairs.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-8 text-center">
            <TrendingUp className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-300">Efficient Market Equilibrium</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Currently all mathematically equivalent fractions are trading within tight fair-value tolerance. As market volatility ticks, new mispriced spreads will emerge!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pairs.map((pair, idx) => {
              const canAfford = cash >= pair.cheaperAsset.currentPrice;
              return (
                <div
                  key={`${pair.cheaperAsset.id}_${pair.expensiveAsset.id}_${idx}`}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors"
                >
                  <div>
                    {/* Math Equivalence Indicator */}
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-2 mb-3 border-b border-slate-800">
                      <span>Equivalence: {(pair.decimal * 100).toFixed(1)}% Par</span>
                      <span className="text-amber-400 font-bold">
                        +{formatCurrency(pair.spreadPerShare)} Spread / Share
                      </span>
                    </div>

                    {/* Spread Comparison Visual */}
                    <div className="grid grid-cols-5 items-center gap-2 mb-4">
                      {/* Undervalued / Buy Target */}
                      <div className="col-span-2 bg-emerald-950/40 border border-emerald-800/40 rounded-lg p-2.5 flex items-center gap-2">
                        <FractionPie
                          numerator={pair.cheaperAsset.numerator}
                          denominator={pair.cheaperAsset.denominator}
                          size={36}
                          color="#10b981"
                        />
                        <div>
                          <div className="font-mono text-xs font-bold text-white">
                            {pair.cheaperAsset.ticker}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {pair.cheaperAsset.numerator}/{pair.cheaperAsset.denominator}
                          </div>
                          <div className="font-mono text-xs font-semibold text-emerald-400 mt-0.5">
                            {formatCurrency(pair.cheaperAsset.currentPrice)}
                          </div>
                        </div>
                      </div>

                      {/* Arrow Divider */}
                      <div className="col-span-1 flex flex-col items-center justify-center text-slate-500">
                        <ArrowRight className="w-4 h-4 text-amber-400" />
                        <span className="text-[10px] font-mono text-amber-400">
                          {formatPercent(pair.spreadPercent)}
                        </span>
                      </div>

                      {/* Overvalued / Sell Target */}
                      <div className="col-span-2 bg-rose-950/40 border border-rose-800/40 rounded-lg p-2.5 flex items-center gap-2">
                        <FractionPie
                          numerator={pair.expensiveAsset.numerator}
                          denominator={pair.expensiveAsset.denominator}
                          size={36}
                          color="#f43f5e"
                        />
                        <div>
                          <div className="font-mono text-xs font-bold text-white">
                            {pair.expensiveAsset.ticker}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {pair.expensiveAsset.numerator}/{pair.expensiveAsset.denominator}
                          </div>
                          <div className="font-mono text-xs font-semibold text-rose-400 mt-0.5">
                            {formatCurrency(pair.expensiveAsset.currentPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Execution Button */}
                  <button
                    onClick={() =>
                      onExecuteArbitrage(
                        pair.cheaperAsset.id,
                        pair.expensiveAsset.id,
                        pair.spreadPerShare
                      )
                    }
                    disabled={!canAfford}
                    className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 disabled:opacity-40 disabled:hover:from-amber-500 cursor-pointer disabled:cursor-not-allowed transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    <span>
                      Execute Arbitrage (Instant Net Profit: +{formatCurrency(pair.spreadPerShare)})
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
