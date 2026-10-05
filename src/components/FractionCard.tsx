import React from 'react';
import { FractionAsset, Position, DisplayNotation } from '../types/market';
import { formatCurrency, formatPercent } from '../utils/mathFractions';
import { FractionPie } from './FractionPie';
import { FractionBar } from './FractionBar';
import { Sparkline } from './Sparkline';
import { ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';

interface FractionCardProps {
  asset: FractionAsset;
  position?: Position;
  cash: number;
  notation: DisplayNotation;
  onBuy: (assetId: string, quantity: number) => void;
  onSell: (assetId: string, quantity: number) => void;
  onInspect: (asset: FractionAsset) => void;
}

export const FractionCard: React.FC<FractionCardProps> = ({
  asset,
  position,
  cash,
  notation,
  onBuy,
  onSell,
  onInspect,
}) => {
  const fairValue = asset.fairPrice;
  const currentPrice = asset.currentPrice;
  const priceSpread = currentPrice - fairValue;
  const spreadPercent = (priceSpread / fairValue) * 100;
  
  // Under fair value = Discount (Undervalued bargain)
  const isDiscount = spreadPercent < -0.5;
  const isPremium = spreadPercent > 0.5;

  const priceChange = asset.currentPrice - asset.previousPrice;
  const isPriceUp = priceChange >= 0;

  const ownedShares = position ? position.shares : 0;
  const unrealizedPnL = position ? (currentPrice - position.averageBuyPrice) * position.shares : 0;
  const pnlPercent = position && position.totalInvested > 0 ? (unrealizedPnL / position.totalInvested) * 100 : 0;

  const canBuy1 = cash >= currentPrice;
  const canBuy5 = cash >= currentPrice * 5;

  return (
    <div className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 rounded-xl p-4 transition-all duration-150 flex flex-col justify-between shadow-xs">
      {/* Top Row: Symbol, Notation & Valuation Delta */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <FractionPie
              numerator={asset.numerator}
              denominator={asset.denominator}
              size={42}
              color={asset.accentColor}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold text-white tracking-tight">
                  {asset.ticker}
                </span>
                <span className="text-xs text-slate-400 truncate max-w-[110px]">
                  {asset.name}
                </span>
              </div>

              {/* Mathematical Notations */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                {(notation === 'FRACTION' || notation === 'ALL') && (
                  <span className="text-slate-200 font-semibold">
                    {asset.numerator}/{asset.denominator}
                  </span>
                )}
                {notation === 'ALL' && <span className="text-slate-600">·</span>}
                {(notation === 'PERCENT' || notation === 'ALL') && (
                  <span>{asset.truePercent.toFixed(1)}%</span>
                )}
                {notation === 'ALL' && <span className="text-slate-600">·</span>}
                {(notation === 'DECIMAL' || notation === 'ALL') && (
                  <span className="text-slate-400">{asset.decimal.toFixed(3)}</span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onInspect(asset)}
            title="Inspect Fraction & Order Depth"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Fraction Bar */}
        <div className="my-2.5">
          <FractionBar
            numerator={asset.numerator}
            denominator={asset.denominator}
            color={asset.accentColor}
          />
        </div>

        {/* Market Pricing vs Intrinsic Parity */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/60 my-2">
          {/* Market Price & Ticker Movement */}
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Market Price</div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-base font-bold text-white tracking-tight">
                {formatCurrency(currentPrice)}
              </span>
              <span
                className={`text-[10px] flex items-center font-semibold ${
                  isPriceUp ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPriceUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {formatCurrency(Math.abs(priceChange))}
              </span>
            </div>
          </div>

          {/* Intrinsic Parity & Spread */}
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-medium">Fair Intrinsic Par</div>
            <div className="font-mono text-xs font-semibold text-slate-300">
              {formatCurrency(fairValue)}
            </div>
            <div
              className={`text-[10px] font-mono font-medium ${
                isDiscount
                  ? 'text-emerald-400'
                  : isPremium
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {isDiscount ? '▼ ' : isPremium ? '▲ ' : '• '}
              {formatPercent(spreadPercent, true)} {isDiscount ? 'Bargain' : isPremium ? 'Premium' : 'Par'}
            </div>
          </div>
        </div>

        {/* Sparkline Trend Row */}
        <div className="flex items-center justify-between py-1 px-0.5 text-[11px] font-mono text-slate-400">
          <span>Range: {formatCurrency(asset.lowPrice)} - {formatCurrency(asset.highPrice)}</span>
          <Sparkline data={asset.priceHistory} isPositive={isPriceUp} width={64} height={20} />
        </div>

        {/* Owned Position Status */}
        {ownedShares > 0 && (
          <div className="mt-2 py-1.5 px-2 bg-emerald-950/30 border border-emerald-800/40 rounded-lg flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-300">
              Holding: <strong className="text-white">{ownedShares}</strong>
            </span>
            <span
              className={`font-semibold ${
                unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(unrealizedPnL)} ({formatPercent(pnlPercent, true)})
            </span>
          </div>
        )}
      </div>

      {/* Action Controls: Instant Execution */}
      <div className="grid grid-cols-2 gap-1.5 pt-3 mt-1 border-t border-slate-800/80">
        {/* Buy Actions */}
        <div className="flex gap-1">
          <button
            onClick={() => onBuy(asset.id, 1)}
            disabled={!canBuy1}
            className="flex-1 py-1.5 px-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-35 disabled:hover:bg-emerald-600 text-white transition-colors cursor-pointer disabled:cursor-not-allowed text-center whitespace-nowrap"
          >
            Buy 1
          </button>
          <button
            onClick={() => onBuy(asset.id, 5)}
            disabled={!canBuy5}
            title="Buy 5 Shares"
            className="py-1.5 px-2 text-xs font-bold rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 disabled:opacity-35 text-emerald-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            +5
          </button>
        </div>

        {/* Sell Actions */}
        <div className="flex gap-1">
          <button
            onClick={() => onSell(asset.id, 1)}
            disabled={ownedShares < 1}
            className="flex-1 py-1.5 px-2 text-xs font-bold rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 disabled:opacity-35 text-rose-300 transition-colors cursor-pointer disabled:cursor-not-allowed text-center whitespace-nowrap"
          >
            Sell 1
          </button>
          <button
            onClick={() => onSell(asset.id, ownedShares)}
            disabled={ownedShares < 1}
            title="Sell All Owned Shares"
            className="py-1.5 px-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-35 disabled:hover:bg-rose-600 text-white transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
          >
            All
          </button>
        </div>
      </div>
    </div>
  );
};
