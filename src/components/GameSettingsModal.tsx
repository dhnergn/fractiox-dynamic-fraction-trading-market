import React from 'react';
import { GameSpeed, DisplayNotation } from '../types/market';
import { X, Volume2, VolumeX, Gauge, BookOpen, RotateCcw, Sliders } from 'lucide-react';

interface GameSettingsModalProps {
  onClose: () => void;
  speed: GameSpeed;
  setSpeed: (speed: GameSpeed) => void;
  notation: DisplayNotation;
  setNotation: (notation: DisplayNotation) => void;
  isMuted: boolean;
  toggleMute: () => void;
  onResetGame: () => void;
}

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  onClose,
  speed,
  setSpeed,
  notation,
  setNotation,
  isMuted,
  toggleMute,
  onResetGame,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Trading Floor Configuration</h2>
        </div>

        <div className="space-y-6">
          {/* Market Clock Speed */}
          <div>
            <label className="text-xs font-mono text-slate-300 font-bold mb-2 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>Tick Speed (Market Order Flow)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['SLOW', 'NORMAL', 'FAST', 'FRENZY'] as GameSpeed[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`py-2 px-3 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                    speed === s
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-xs'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Controls the rate at which market prices drift, news events break, and order books update.
            </p>
          </div>

          {/* Notation Display Style */}
          <div>
            <label className="text-xs font-mono text-slate-300 font-bold mb-2 block">
              Mathematical Notation Display
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ALL', label: 'All Formats (3/4 · 75% · 0.75)' },
                { id: 'FRACTION', label: 'Fraction Focus (3/4)' },
                { id: 'PERCENT', label: 'Percent Focus (75%)' },
                { id: 'DECIMAL', label: 'Decimal Focus (0.750)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setNotation(opt.id as DisplayNotation)}
                  className={`py-2 px-3 text-xs font-mono text-left rounded-lg border transition-all cursor-pointer ${
                    notation === opt.id
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-xs'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Audio FX */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-slate-300">Synthesized Audio FX</div>
                <div className="text-[11px] text-slate-400">Crisp Web Audio API feedback for trade execution</div>
              </div>
              <button
                onClick={toggleMute}
                className={`py-1.5 px-3 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
                  !isMuted
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                }`}
              >
                {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{!isMuted ? 'ENABLED' : 'MUTED'}</span>
              </button>
            </div>
          </div>

          {/* Rules Guide Accordion */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white font-mono mb-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Trader Field Manual: The Rules</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-white">Intrinsic Value:</strong> A fraction&apos;s true baseline par is its percentage (e.g. 3/4 = 75.0% = $75.00).
              </li>
              <li>
                <strong className="text-emerald-400">Discount Bargains:</strong> When market price is below fair par (e.g. $67.50 vs $75.00), it is undervalued. Buy low!
              </li>
              <li>
                <strong className="text-rose-400">Premium Bubbles:</strong> When market price is above fair par, sell owned shares for a gain.
              </li>
              <li>
                <strong className="text-amber-400">Equivalence Arbitrage:</strong> Equivalent fractions (e.g. 1/2 and 2/4) have identical mathematical value. Buy the cheaper and pocket instant risk-free profit!
              </li>
              <li>
                <strong className="text-sky-400">Synthesis to 1.0 Whole:</strong> Combine owned fractions to assemble exactly 1.0 (100%). Liquidate for $100.00 par + $25.00 cash bonus!
              </li>
            </ul>
          </div>

          {/* Reset Action */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={() => {
                if (window.confirm('Reset your portfolio and start a fresh session with $1,000.00 cash?')) {
                  onResetGame();
                  onClose();
                }
              }}
              className="py-2 px-3 text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Portfolio ($1,000.00)</span>
            </button>

            <button
              onClick={onClose}
              className="py-2 px-5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
