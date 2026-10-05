import React from 'react';
import { CustomerOrder, FractionItem, InventoryItem } from '../types/game';
import { VibrantFractionPie } from './VibrantFractionPie';
import { Clock, Sparkles } from 'lucide-react';

interface CustomerCounterProps {
  orders: CustomerOrder[];
  fractions: FractionItem[];
  inventory: Record<string, InventoryItem>;
  onServeCustomer: (orderId: string, fractionId: string) => void;
}

export const CustomerCounter: React.FC<CustomerCounterProps> = ({
  orders,
  fractions,
  inventory,
  onServeCustomer,
}) => {
  if (orders.length === 0) return null;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏪</span>
          <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
            Hungry Customer Orders (1.4x Bonus Payout!)
          </h3>
        </div>
        <span className="text-xs text-amber-400 font-mono font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Instant Bonus Tips
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {orders.map((order) => {
          const fraction = fractions.find((f) => f.id === order.requestedFractionId);
          if (!fraction) return null;

          const owned = inventory[fraction.id]?.shares || 0;
          const payout = Math.round(fraction.fairValue * order.bonusMultiplier);
          const canServe = owned > 0;
          const timePercent = (order.timeLeft / order.maxTime) * 100;
          const isUrgent = order.timeLeft <= 8;

          return (
            <div
              key={order.id}
              className={`relative rounded-xl p-3.5 border transition-all ${
                canServe
                  ? 'bg-gradient-to-b from-slate-900 to-amber-950/30 border-amber-500/60 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              {/* Customer Avatar & Name */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{order.avatar}</span>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">
                      {order.customerName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Wants: <strong className="text-white">{fraction.numerator}/{fraction.denominator}</strong> ({fraction.percentage.toFixed(0)}%)
                    </div>
                  </div>
                </div>

                <VibrantFractionPie
                  numerator={fraction.numerator}
                  denominator={fraction.denominator}
                  size={36}
                  color={fraction.color}
                />
              </div>

              {/* Timer Bar */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mb-3">
                <Clock className={`w-3 h-3 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${timePercent}%` }}
                    className={`h-full transition-all duration-300 ${
                      isUrgent ? 'bg-rose-500' : 'bg-amber-400'
                    }`}
                  />
                </div>
                <span className={isUrgent ? 'text-rose-400 font-bold' : ''}>{order.timeLeft}s</span>
              </div>

              {/* Action Button */}
              {canServe ? (
                <button
                  onClick={() => onServeCustomer(order.id, fraction.id)}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all transform hover:scale-[1.02]"
                >
                  <span>SERVE & GET ${payout}!</span>
                  <span className="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded font-mono">
                    (Have {owned})
                  </span>
                </button>
              ) : (
                <div className="w-full py-2 px-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 font-semibold text-xs text-center">
                  Buy {fraction.numerator}/{fraction.denominator} below to serve for ${payout}!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
