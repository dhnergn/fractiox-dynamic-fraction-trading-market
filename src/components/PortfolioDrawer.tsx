import React from 'react';
import { FractionAsset, Position, TradeRecord } from '../types/market';
import { formatCurrency, formatPercent } from '../utils/mathFractions';
import { FractionPie } from './FractionPie';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface PortfolioDrawerProps {
  cash: number;
  netWorth: number;
  positions: Record<string, Position>;
  fractions: FractionAsset[];
  totalRealizedPnL: number;
  trades: TradeRecord[];
  onSell: (assetId: string, quantity: number) => void;
  onInspect: (asset: FractionAsset) => void;
}

export const PortfolioDrawer: React.FC<PortfolioDrawerProps> = ({
  cash,
  netWorth,
  positions,
  fractions,
  totalRealizedPnL,
  trades,
  onSell,
  onInspect,
}) => {
  const activePositions = Object.values(positions).filter((p) => p.shares > 0);

  let totalHoldingsValue = 0;
  let totalCostBasis = 0;

  activePositions.forEach((pos) => {
    const asset = fractions.find((f) => f.id === pos.fractionId);
    if (asset) {
      totalHoldingsValue += asset.currentPrice * pos.shares;
      totalCostBasis += pos.totalInvested;
    }
  });

  const totalUnrealizedPnL = totalHoldingsValue - totalCostBasis;
  const unrealizedPercent = totalCostBasis > 0 ? (totalUnrealizedPnL / totalCostBasis) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Portfolio Net Worth</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold font-mono text-white tracking-tight">
            {formatCurrency(netWorth)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Liquid Cash: {formatCurrency(cash)}
          </div>
        </div>

        {/* Holdings Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Fraction Positions</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-extrabold font-mono text-white tracking-tight">
            {formatCurrency(totalHoldingsValue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Across {activePositions.length} active assets
          </div>
        </div>

        {/* Unrealized P&L */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Unrealized P&L</span>
            {totalUnrealizedPnL >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div
            className={`text-xl font-extrabold font-mono tracking-tight ${
              totalUnrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalUnrealizedPnL >= 0 ? '+' : ''}{formatCurrency(totalUnrealizedPnL)}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Return: {formatPercent(unrealizedPercent, true)}
          </div>
        </div>

        {/* Realized Gains */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Realized Profits</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div
            className={`text-xl font-extrabold font-mono tracking-tight ${
              totalRealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalRealizedPnL >= 0 ? '+' : ''}{formatCurrency(totalRealizedPnL)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {trades.length} completed transactions
          </div>
        </div>
      </div>

      {/* Active Holdings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Active Fraction Positions</h3>
          <span className="text-xs text-slate-400 font-mono">
            {activePositions.length} positions held
          </span>
        </div>

        {activePositions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No active positions. Explore the Market Floor to buy undervalued fractions!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="px-4 py-3 font-semibold">Asset</th>
                  <th className="px-4 py-3 font-semibold">Shares</th>
                  <th className="px-4 py-3 font-semibold">Avg Cost</th>
                  <th className="px-4 py-3 font-semibold">Current Price</th>
                  <th className="px-4 py-3 font-semibold">Position Value</th>
                  <th className="px-4 py-3 font-semibold">Unrealized P&L</th>
                  <th className="px-4 py-3 font-semibold text-right">Quick Sell</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {activePositions.map((pos) => {
                  const asset = fractions.find((f) => f.id === pos.fractionId);
                  if (!asset) return null;

                  const currentValue = asset.currentPrice * pos.shares;
                  const pnl = currentValue - pos.totalInvested;
                  const pnlPct = (pnl / pos.totalInvested) * 100;
                  const isPositive = pnl >= 0;

                  return (
                    <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FractionPie
                            numerator={asset.numerator}
                            denominator={asset.denominator}
                            size={24}
                            color={asset.accentColor}
                          />
                          <div>
                            <span className="font-bold text-white">{asset.ticker}</span>
                            <span className="text-slate-400 text-[11px] block">
                              {asset.numerator}/{asset.denominator} ({asset.truePercent.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-200 font-bold">{pos.shares}</td>
                      <td className="px-4 py-3 text-slate-300">{formatCurrency(pos.averageBuyPrice)}</td>
                      <td className="px-4 py-3 text-slate-200 font-bold">
                        {formatCurrency(asset.currentPrice)}
                      </td>
                      <td className="px-4 py-3 text-slate-100">{formatCurrency(currentValue)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}{formatCurrency(pnl)} ({formatPercent(pnlPct, true)})
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => onSell(asset.id, 1)}
                            className="py-1 px-2 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Sell 1
                          </button>
                          <button
                            onClick={() => onSell(asset.id, pos.shares)}
                            className="py-1 px-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            All
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trade History Blotter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Execution Blotter (Last 10 Trades)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{trades.length} total executed</span>
        </div>

        {trades.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No executed trades recorded in this session.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Type</th>
                  <th className="px-4 py-2.5 font-semibold">Asset</th>
                  <th className="px-4 py-2.5 font-semibold">Quantity</th>
                  <th className="px-4 py-2.5 font-semibold">Executed Price</th>
                  <th className="px-4 py-2.5 font-semibold">Total Amount</th>
                  <th className="px-4 py-2.5 font-semibold">Realized Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {trades.slice(0, 10).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/20">
                    <td className="px-4 py-2">
                      <span
                        className={`font-bold ${
                          t.type === 'BUY'
                            ? 'text-emerald-400'
                            : t.type === 'SELL'
                            ? 'text-rose-400'
                            : t.type === 'ARBITRAGE'
                            ? 'text-amber-400'
                            : 'text-sky-400'
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-bold text-slate-200">{t.ticker}</td>
                    <td className="px-4 py-2 text-slate-300">{t.shares}</td>
                    <td className="px-4 py-2 text-slate-300">{formatCurrency(t.price)}</td>
                    <td className="px-4 py-2 text-slate-100 font-semibold">{formatCurrency(t.total)}</td>
                    <td className="px-4 py-2">
                      {t.pnl !== undefined ? (
                        <span className={t.pnl >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {t.pnl >= 0 ? '+' : ''}{formatCurrency(t.pnl)}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
