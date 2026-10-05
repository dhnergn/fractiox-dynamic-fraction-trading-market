import React from 'react';
import { GameLevel } from '../types/game';
import { X, Star, Lock, Play } from 'lucide-react';

interface LevelSelectModalProps {
  levels: GameLevel[];
  currentLevelIndex: number;
  highestUnlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (index: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  levels,
  currentLevelIndex,
  highestUnlockedLevel,
  levelStars,
  onSelectLevel,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="text-3xl mb-1">🗺️</div>
          <h2 className="text-2xl font-black text-white tracking-tight">Select Level</h2>
          <p className="text-xs text-slate-400 mt-1">
            Progress through the fraction markets and earn 3 stars on every stage!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {levels.map((lvl, idx) => {
            const isUnlocked = lvl.levelNumber <= highestUnlockedLevel;
            const isCurrent = idx === currentLevelIndex;
            const stars = levelStars[lvl.levelNumber] || 0;

            return (
              <button
                key={lvl.levelNumber}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLevel(idx);
                    onClose();
                  }
                }}
                disabled={!isUnlocked}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-slate-800 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : isUnlocked
                    ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900 cursor-pointer'
                    : 'bg-slate-950/30 border-slate-900 opacity-40 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Level {lvl.levelNumber}
                    </span>
                    {isUnlocked ? (
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= stars
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{lvl.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                    {lvl.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono mt-3 pt-2 border-t border-slate-800/80 text-slate-400">
                  <span>Target: <strong className="text-emerald-400">${lvl.targetProfit}</strong></span>
                  <span>⏱️ {lvl.durationSeconds}s</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
