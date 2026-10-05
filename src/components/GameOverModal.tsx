import React from 'react';
import { Trophy, Star, ArrowRight, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  isVictory: boolean;
  profitEarned: number;
  targetProfit: number;
  stars: number;
  levelNumber: number;
  totalCustomersServed: number;
  jackpotsClaimed: number;
  onNextLevel?: () => void;
  onRestartLevel: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVictory,
  profitEarned,
  targetProfit,
  stars,
  levelNumber,
  totalCustomersServed,
  jackpotsClaimed,
  onNextLevel,
  onRestartLevel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-md p-6 text-center shadow-2xl relative">
        {/* Animated Banner Badge */}
        <div className="text-5xl mb-3 animate-bounce">
          {isVictory ? '🏆' : '⏰'}
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          {isVictory ? 'LEVEL COMPLETE!' : "TIME'S UP!"}
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          {isVictory
            ? `You smashed Level ${levelNumber} profit target!`
            : `Needed $${targetProfit} profit. Don't worry, try again!`}
        </p>

        {/* Star Rating */}
        {isVictory && (
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((starNum) => (
              <Star
                key={starNum}
                className={`w-9 h-9 ${
                  starNum <= stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                    : 'text-slate-700'
                } transition-all duration-300`}
              />
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 mb-6 text-center font-mono">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Profit Made</div>
            <div className="text-sm font-black text-emerald-400 mt-0.5">
              ${profitEarned}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Customers</div>
            <div className="text-sm font-black text-amber-400 mt-0.5">
              {totalCustomersServed} served
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Whole Pies</div>
            <div className="text-sm font-black text-cyan-400 mt-0.5">
              {jackpotsClaimed} baked
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          {isVictory && onNextLevel && (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transform hover:scale-[1.02] transition-all"
            >
              <span>NEXT LEVEL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onRestartLevel}
            className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isVictory
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
