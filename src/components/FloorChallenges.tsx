import React from 'react';
import { ClientOrderChallenge, FractionAsset } from '../types/market';
import { formatCurrency } from '../utils/mathFractions';
import { FractionPie } from './FractionPie';
import { Target, Clock, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

interface FloorChallengesProps {
  challenges: ClientOrderChallenge[];
  fractions: FractionAsset[];
  onCompleteChallenge: (challengeId: string, selectedFractionId: string) => void;
}

export const FloorChallenges: React.FC<FloorChallengesProps> = ({
  challenges,
  fractions,
  onCompleteChallenge,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 font-mono">
          <Target className="w-4 h-4 text-purple-400" />
          <span>High-Frequency Client Order Pit</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          Institutional Math Desk Orders
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Prominent algorithmic funds and market makers place urgent math allocation requests. Analyze the order criteria, select matching fraction assets from the exchange, and deliver before the countdown expires to collect institutional commissions!
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {challenges.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-8 text-center">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-300">Order Book Cleared</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              All pending client orders have been fulfilled or settled. New institutional orders arrive every few moments!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((order) => {
              const isUrgent = order.remainingSeconds <= 15;

              return (
                <div
                  key={order.id}
                  className={`bg-slate-900 border rounded-xl p-5 flex flex-col justify-between transition-all ${
                    order.completed
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : order.failed
                      ? 'border-rose-500/30 bg-rose-950/20 opacity-60'
                      : isUrgent
                      ? 'border-rose-500/50 shadow-md shadow-rose-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Top Bar: Client & Timer */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
                      <div className="font-bold text-slate-200 font-mono flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        <span>{order.clientName}</span>
                      </div>

                      {order.completed ? (
                        <span className="text-emerald-400 font-bold font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Fulfilled
                        </span>
                      ) : order.failed ? (
                        <span className="text-rose-400 font-bold font-mono flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Expired
                        </span>
                      ) : (
                        <div
                          className={`flex items-center gap-1 font-mono font-bold ${
                            isUrgent ? 'text-rose-400 animate-pulse' : 'text-slate-400'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{order.remainingSeconds}s remaining</span>
                        </div>
                      )}
                    </div>

                    {/* Order Directive */}
                    <div className="text-sm font-semibold text-white mb-2 leading-snug">
                      {order.orderPrompt}
                    </div>

                    {/* Reward details */}
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-4">
                      <span>
                        Payout:{' '}
                        <strong className="text-emerald-400">
                          +{formatCurrency(order.rewardCash)}
                        </strong>
                      </span>
                      <span>·</span>
                      <span>
                        Reputation: <strong className="text-purple-300">+{order.rewardXp} XP</strong>
                      </span>
                    </div>
                  </div>

                  {/* Submission Selection */}
                  {!order.completed && !order.failed && (
                    <div className="pt-3 border-t border-slate-800/80">
                      <div className="text-xs text-slate-400 mb-2 font-mono">
                        Select an exchange fraction to fulfill:
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                        {fractions.map((f) => {
                          // Quick check if this fraction qualifies
                          let qualifies = false;
                          if (order.type === 'RANGE_TARGET' && order.targetMinPercent && order.targetMaxPercent) {
                            qualifies = f.truePercent >= order.targetMinPercent && f.truePercent <= order.targetMaxPercent;
                          } else if (order.type === 'COMPARISON' && order.comparisonTargetId) {
                            const targetAsset = fractions.find((item) => item.id === order.comparisonTargetId);
                            if (targetAsset) {
                              qualifies = order.comparisonOperator === '>' 
                                ? f.decimal > targetAsset.decimal
                                : f.decimal < targetAsset.decimal;
                            }
                          } else if (order.type === 'EQUIVALENCE') {
                            qualifies = f.decimal === 0.5; // common equivalence test
                          } else {
                            qualifies = true;
                          }

                          return (
                            <button
                              key={f.id}
                              onClick={() => onCompleteChallenge(order.id, f.id)}
                              className={`py-1.5 px-2 rounded-lg text-xs font-mono flex items-center justify-between border transition-all cursor-pointer ${
                                qualifies
                                  ? 'bg-slate-800/90 border-slate-700 hover:border-purple-500 text-white'
                                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <FractionPie
                                  numerator={f.numerator}
                                  denominator={f.denominator}
                                  size={16}
                                  color={f.accentColor}
                                />
                                <span className="font-bold">{f.ticker}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {f.numerator}/{f.denominator}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
