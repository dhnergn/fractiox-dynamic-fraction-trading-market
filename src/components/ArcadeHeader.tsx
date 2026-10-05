import React from 'react';
import { Volume2, VolumeX, HelpCircle, Trophy, Flame } from 'lucide-react';

interface ArcadeHeaderProps {
  coins: number;
  profitEarned: number;
  targetProfit: number;
  timeLeft: number;
  levelNumber: number;
  levelTitle: string;
  comboStreak: number;
  isMuted: boolean;
  toggleMute: () => void;
  onOpenHowToPlay: () => void;
  onOpenLevelSelect: () => void;
}

export const ArcadeHeader: React.FC<ArcadeHeaderProps> = ({
  coins,
  profitEarned,
  targetProfit,
  timeLeft,
  levelNumber,
  levelTitle,
  comboStreak,
  isMuted,
  toggleMute,
  onOpenHowToPlay,
  onOpenLevelSelect,
}) => {
  const progressPercent = Math.min((profitEarned / targetProfit) * 100, 100);
  const isUrgent = timeLeft <= 15;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Level Select */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-xl shadow-md shadow-cyan-500/20">
              🍕
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white tracking-tight">Fraction Frenzy</span>
              </div>
              <button
                onClick={onOpenLevelSelect}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Level {levelNumber}: {levelTitle}</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1 rounded">change</span>
              </button>
            </div>
          </div>

          {/* Mobile Coins Display */}
          <div className="flex md:hidden items-center gap-2 font-mono">
            <span className="text-base font-black text-emerald-400">
              💰 ${coins}
            </span>
          </div>
        </div>

        {/* Center Game HUD: Goal Progress & Timer */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-center">
          {/* Profit Goal Meter */}
          <div className="flex-1 md:w-48 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-slate-400">Profit Target:</span>
              <span className="font-bold text-white">${profitEarned} / ${targetProfit}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              />
            </div>
          </div>

          {/* Countdown Clock */}
          <div
            className={`px-3 py-1.5 rounded-xl border font-mono font-black text-sm flex items-center gap-1.5 ${
              isUrgent
                ? 'bg-rose-950/50 border-rose-500 text-rose-400 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}
          >
            <span>⏱️</span>
            <span>{timeLeft}s</span>
          </div>

          {/* Combo Streak */}
          {comboStreak > 1 && (
            <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono font-black text-xs flex items-center gap-1 animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{comboStreak}x STREAK!</span>
            </div>
          )}
        </div>

        {/* Right Actions: Coins Wallet & Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-right">
            <div className="text-[10px] text-slate-400">Your Wallet</div>
            <div className="text-sm font-black text-emerald-400">
              💰 ${coins}
            </div>
          </div>

          <button
            onClick={onOpenHowToPlay}
            title="How to Play"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
          </button>

          <button
            onClick={onOpenLevelSelect}
            title="Level Select"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
