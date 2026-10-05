import React from 'react';
import { FractionItem, InventoryItem } from '../types/game';
import { VibrantFractionPie } from './VibrantFractionPie';
import { ArrowUp, ArrowDown, ShoppingCart, DollarSign, Sparkles } from 'lucide-react';

interface TradeCardProps {
  fraction: FractionItem;
  inventory?: InventoryItem;
  coins: number;
  onBuy: (fractionId: string) => void;
  onSell: (fractionId: string) => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({
  fraction,
  inventory,
  coins,
  onBuy,
  onSell,
}) => {
  const fair = fraction.fairValue;
  const current = fraction.currentPrice;
  const priceDiff = current - fair;
  const percentDiff = Math.round((priceDiff / fair) * 100);

  // Status conditions
  const isBargain = percentDiff <= -10; // >10% discount
  const isSuperBargain = percentDiff <= -20; // >20% discount
  const isOverpriced = percentDiff >= 10; // >10% premium

  const ownedShares = inventory ? inventory.shares : 0;
  const avgCost = inventory ? inventory.boughtAt : current;
  const profitPerShare = current - avgCost;
  const hasProfit = ownedShares > 0 && profitPerShare > 0;

  const canAfford = coins >= current;

  return (
    <div
      className={`relative rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between shadow-lg ${
        isSuperBargain
          ? 'bg-gradient-to-b from-slate-900 to-emerald-950/40 border-emerald-500 shadow-emerald-500/10'
          : isBargain
          ? 'bg-slate-900 border-emerald-500/60'
          : isOverpriced
          ? 'bg-gradient-to-b from-slate-900 to-rose-950/30 border-rose-500/60'
          : 'bg-slate-900 border-slate-800'
      }`}
    >
      {/* Top Banner Badge: Instant Understanding */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {isSuperBargain ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 animate-pulse">
            <Sparkles className="w-3 h-3 fill-slate-950" />
            MEGA SALE! {Math.abs(percentDiff)}% OFF
          </span>
        ) : isBargain ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            🏷️ SALE: {Math.abs(percentDiff)}% OFF
          </span>
        ) : isOverpriced ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
            🔥 HOT PRICE: +{percentDiff}% OVER
          </span>
        ) : (
          <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
            ⚖️ FAIR PRICE
          </span>
        )}

        {ownedShares > 0 && (
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            Bag: {ownedShares}
          </span>
        )}
      </div>

      {/* Main Visual & Fraction Info */}
      <div className="flex items-center gap-3.5 mb-3">
        <VibrantFractionPie
          numerator={fraction.numerator}
          denominator={fraction.denominator}
          size={56}
          color={fraction.color}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white font-mono tracking-tight">
              {fraction.numerator}/{fraction.denominator}
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">
              ({fraction.percentage.toFixed(0)}%)
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-300 truncate">
            {fraction.emoji} {fraction.name}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Real Value: <strong className="text-slate-200">${fair}</strong>
          </div>
        </div>
      </div>

      {/* Current Live Price Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-mono font-bold text-slate-400">
            Market Price
          </div>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-black text-white">
              ${current}
            </span>
            <span
              className={`text-xs font-bold flex items-center ${
                fraction.currentPrice >= fraction.prevPrice
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {fraction.currentPrice >= fraction.prevPrice ? (
                <ArrowUp className="w-3.5 h-3.5" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5" />
              )}
              ${Math.abs(fraction.currentPrice - fraction.prevPrice)}
            </span>
          </div>
        </div>

        {/* Profit indicator if owned */}
        {ownedShares > 0 && (
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400">Your Gain</div>
            <div
              className={`text-xs font-bold font-mono ${
                hasProfit ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {hasProfit ? `+$${profitPerShare} / slice` : `$${profitPerShare} / slice`}
            </div>
          </div>
        )}
      </div>

      {/* Two Big Fat Juicy Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <button
          onClick={() => onBuy(fraction.id)}
          disabled={!canAfford}
          className={`py-2.5 px-3 rounded-xl font-black text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition-all transform active:scale-95 ${
            isBargain
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:hover:bg-emerald-600'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>BUY ${current}</span>
        </button>

        <button
          onClick={() => onSell(fraction.id)}
          disabled={ownedShares <= 0}
          className={`py-2.5 px-3 rounded-xl font-black text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition-all transform active:scale-95 ${
            isOverpriced && ownedShares > 0
              ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-md shadow-rose-500/20 animate-pulse'
              : 'bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-30 disabled:hover:bg-rose-600'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>SELL ${current}</span>
        </button>
      </div>
    </div>
  );
};
