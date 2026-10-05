import React from 'react';
import { GameAchievement } from '../types/market';
import { formatCurrency } from '../utils/mathFractions';
import { X, Trophy, Award, TrendingUp, Zap, Target, Tag, CheckCircle2 } from 'lucide-react';

interface QuantCareerModalProps {
  onClose: () => void;
  level: number;
  xp: number;
  rank: string;
  netWorth: number;
  tradesCount: number;
  arbitragesCount: number;
  wholesMerged: number;
  totalRealizedPnL: number;
  achievements: GameAchievement[];
}

export const QuantCareerModal: React.FC<QuantCareerModalProps> = ({
  onClose,
  level,
  xp,
  rank,
  netWorth,
  tradesCount,
  arbitragesCount,
  wholesMerged,
  totalRealizedPnL,
  achievements,
}) => {
  const nextLevelXp = level * 300;
  const xpInCurrentLevel = xp % 300;
  const progressPercent = (xpInCurrentLevel / 300) * 100;

  const getIcon = (name: string) => {
    switch (name) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Target':
        return <Target className="w-5 h-5 text-sky-400" />;
      case 'Tag':
        return <Tag className="w-5 h-5 text-purple-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-yellow-400" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Level {level}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">Floor License #{level * 1042}</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">{rank}</h2>

            {/* Level XP Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Experience: {xpInCurrentLevel} / 300 XP</span>
                <span>Level {level + 1}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Net Worth</div>
            <div className="text-sm font-bold font-mono text-white mt-0.5">
              {formatCurrency(netWorth)}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Total Trades</div>
            <div className="text-sm font-bold font-mono text-slate-200 mt-0.5">
              {tradesCount}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Arbitrage Wins</div>
            <div className="text-sm font-bold font-mono text-amber-400 mt-0.5">
              {arbitragesCount}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Wholes Merged</div>
            <div className="text-sm font-bold font-mono text-sky-400 mt-0.5">
              {wholesMerged}
            </div>
          </div>
        </div>

        {/* Quant Achievements Showcase */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
            <span>Trading Badges & Milestones</span>
            <span className="text-xs font-mono text-slate-400">
              {achievements.filter((a) => a.unlocked).length} of {achievements.length} unlocked
            </span>
          </h3>

          <div className="space-y-2.5">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  ach.unlocked
                    ? 'bg-slate-950/80 border-slate-700/80 text-white'
                    : 'bg-slate-950/30 border-slate-800/50 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    ach.unlocked ? 'bg-slate-800 border border-slate-700' : 'bg-slate-900'
                  }`}
                >
                  {getIcon(ach.iconName)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-mono">{ach.title}</span>
                    {ach.unlocked && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
