import React from 'react';
import { MarketNews } from '../types/market';
import { Radio, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface MarketTickerProps {
  currentNews: MarketNews | null;
  overallSentiment: 'BULLISH' | 'BEARISH' | 'BALANCED';
  discountOpportunityCount: number;
  arbitragePairsCount: number;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({
  currentNews,
  overallSentiment,
  discountOpportunityCount,
  arbitragePairsCount,
}) => {
  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* Breaking News Feed */}
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider shrink-0 text-[11px]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
            <span>WIRE</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="truncate text-slate-200">
            {currentNews ? (
              <span className="inline-flex items-center gap-2">
                <span className="font-semibold text-slate-100">{currentNews.headline}</span>
                <span className="text-slate-400 hidden lg:inline">— {currentNews.description}</span>
              </span>
            ) : (
              <span className="text-slate-400 italic">Listening to trading floor order flow...</span>
            )}
          </div>
        </div>

        {/* Macro Statistics with clean unboxed typographic separators */}
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] shrink-0 self-end md:self-center">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-slate-500" />
            <span>Sentiment:</span>
            <span
              className={`font-semibold ${
                overallSentiment === 'BULLISH'
                  ? 'text-emerald-400'
                  : overallSentiment === 'BEARISH'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {overallSentiment}
            </span>
          </div>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <div className="flex items-center gap-1">
            {discountOpportunityCount > 0 ? (
              <ArrowDownRight className="w-3 h-3 text-emerald-400" />
            ) : (
              <ArrowUpRight className="w-3 h-3 text-slate-500" />
            )}
            <span>Discounts:</span>
            <span className="font-semibold text-emerald-400">{discountOpportunityCount}</span>
          </div>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <div className="flex items-center gap-1">
            <span>Arbitrage Spreads:</span>
            <span className="font-semibold text-amber-400">{arbitragePairsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
