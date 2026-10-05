import React, { useState } from 'react';
import { FractionAsset, Position } from '../types/market';
import { formatCurrency, formatPercent } from '../utils/mathFractions';
import { FractionPie } from './FractionPie';
import { FractionBar } from './FractionBar';
import { Sparkline } from './Sparkline';
import { X, ArrowUpRight, ArrowDownRight, Layers, Calculator, ShieldCheck } from 'lucide-react';

interface FractionDetailModalProps {
  asset: FractionAsset;
  position?: Position;
  cash: number;
  onClose: () => void;
  onBuy: (assetId: string, quantity: number) => void;
  onSell: (assetId: string, quantity: number) => void;
}

export const FractionDetailModal: React.FC<FractionDetailModalProps> = ({
  asset,
  position,
  cash,
  onClose,
  onBuy,
  onSell,
}) => {
  const [tradeQuantity, setTradeQuantity] = useState<number>(1);

  const fairValue = asset.fairPrice;
  const currentPrice = asset.currentPrice;
  const spreadPercent = ((currentPrice - fairValue) / fairValue) * 100;
  const isDiscount = spreadPercent < 0;

  const totalCost = currentPrice * tradeQuantity;
  const canAfford = cash >= totalCost;
  const ownedShares = position ? position.shares : 0;
  const canSell = ownedShares >= tradeQuantity;

  // Math complements
  const complementNum = asset.denominator - asset.numerator;
  const complementPercent = (complementNum / asset.denominator) * 100;

  // Mock order book depth around current price
  const bids = [
    { price: currentPrice - 0.15, size: 45 },
    { price: currentPrice - 0.35, size: 80 },
    { price: currentPrice - 0.60, size: 120 },
  ];
  const asks = [
    { price: currentPrice + 0.15, size: 40 },
    { price: currentPrice + 0.40, size: 95 },
    { price: currentPrice + 0.70, size: 150 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6 pr-8">
          <FractionPie
            numerator={asset.numerator}
            denominator={asset.denominator}
            size={68}
            color={asset.accentColor}
            showLabels
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white font-mono">{asset.ticker}</h2>
              <span className="text-xs text-slate-400 font-mono">· {asset.category}</span>
            </div>
            <div className="text-sm font-semibold text-slate-200">{asset.name}</div>
            <p className="text-xs text-slate-400 mt-1">{asset.description}</p>
          </div>
        </div>

        {/* Fraction Visual Bar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-5">
          <div className="text-xs font-mono text-slate-400 mb-2">Geometric Fraction Bar Subdivision</div>
          <FractionBar
            numerator={asset.numerator}
            denominator={asset.denominator}
            color={asset.accentColor}
            showRuler
          />
        </div>

        {/* Math Anatomy & Valuation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
              <Calculator className="w-3.5 h-3.5 text-sky-400" />
              <span>Decimal Parity</span>
            </div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {asset.decimal.toFixed(4)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              = {asset.truePercent.toFixed(2)}% of Unity
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Intrinsic Fair Par</span>
            </div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {formatCurrency(fairValue)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Benchmark Parity Ratio
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Complement to 1.0</span>
            </div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {complementNum}/{asset.denominator}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              ({complementPercent.toFixed(1)}% needed for Whole)
            </div>
          </div>
        </div>

        {/* Price Trend & Order Depth Ladder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Price & Volatility */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>Market Pricing</span>
              <span
                className={`font-semibold ${
                  isDiscount ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatPercent(spreadPercent, true)} vs Par
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-white mb-2">
              {formatCurrency(currentPrice)}
            </div>
            <div className="h-12 flex items-center">
              <Sparkline data={asset.priceHistory} isPositive={!isDiscount} width={240} height={40} />
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-2">
              24h Range: {formatCurrency(asset.lowPrice)} - {formatCurrency(asset.highPrice)}
            </div>
          </div>

          {/* Quant Order Depth */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
            <div className="text-xs font-mono text-slate-400 mb-2">Order Book Depth</div>
            <div className="space-y-1.5 font-mono text-[11px]">
              {asks.slice(0, 2).reverse().map((a, i) => (
                <div key={i} className="flex justify-between text-rose-400">
                  <span>Ask: {formatCurrency(a.price)}</span>
                  <span>{a.size} shs</span>
                </div>
              ))}
              <div className="py-1 my-1 border-y border-slate-800 text-center font-bold text-slate-200">
                Spread: $0.30
              </div>
              {bids.slice(0, 2).map((b, i) => (
                <div key={i} className="flex justify-between text-emerald-400">
                  <span>Bid: {formatCurrency(b.price)}</span>
                  <span>{b.size} shs</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Execution Form */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-white font-mono">Order Ticket</div>
            <div className="text-xs text-slate-400 font-mono">
              Cash: <strong className="text-white">{formatCurrency(cash)}</strong> · Holding: <strong className="text-white">{ownedShares}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Quantity:</span>
              <div className="flex items-center border border-slate-750 rounded-lg bg-slate-900">
                <button
                  onClick={() => setTradeQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-slate-400 hover:text-white font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tradeQuantity}
                  onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center font-mono font-bold text-white bg-transparent outline-hidden text-xs"
                />
                <button
                  onClick={() => setTradeQuantity((q) => q + 1)}
                  className="px-2.5 py-1 text-slate-400 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick quantity presets */}
            <div className="flex gap-1">
              {[1, 5, 10].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setTradeQuantity(qty)}
                  className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                    tradeQuantity === qty
                      ? 'bg-slate-800 text-white border-slate-600'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {qty}x
                </button>
              ))}
            </div>

            <div className="ml-auto text-right font-mono">
              <div className="text-[10px] text-slate-400">Total Order Value</div>
              <div className="text-sm font-bold text-white">{formatCurrency(totalCost)}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onBuy(asset.id, tradeQuantity);
                onClose();
              }}
              disabled={!canAfford}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-colors shadow-md shadow-emerald-600/10"
            >
              <span>Buy {tradeQuantity} {asset.ticker}</span>
              <span>({formatCurrency(totalCost)})</span>
            </button>

            <button
              onClick={() => {
                onSell(asset.id, tradeQuantity);
                onClose();
              }}
              disabled={!canSell}
              className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:hover:bg-rose-600 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-colors shadow-md shadow-rose-600/10"
            >
              <span>Sell {tradeQuantity} {asset.ticker}</span>
              <span>({formatCurrency(totalCost)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
