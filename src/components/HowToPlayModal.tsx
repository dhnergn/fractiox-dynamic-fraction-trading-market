import React from 'react';
import { X, Sparkles, ShoppingCart, DollarSign, Layers } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🍕</div>
          <h2 className="text-2xl font-black text-white tracking-tight">How to Play Fraction Frenzy</h2>
          <p className="text-xs text-slate-400 mt-1">
            Master the fraction slice market in 3 simple rules!
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {/* Rule 1 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 text-xl font-bold font-mono">
              ½
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>1. Every Fraction is a Percentage!</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                A half pie <strong className="text-cyan-400">1/2 = 50% = $50</strong> real value.
                A quarter <strong className="text-blue-400">1/4 = 25% = $25</strong>.
                Three quarters <strong className="text-purple-400">3/4 = 75% = $75</strong>!
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>2. Buy on Sale 🟢, Sell at Peak 🔴!</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Market prices change constantly! If a $50 slice drops to <strong className="text-emerald-400">$35 (SALE!)</strong>, buy it! When it surges to <strong className="text-rose-400">$65 (HOT!)</strong>, sell it for <strong className="text-emerald-400">+$30 instant profit</strong>!
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>3. Whole Pie Fusion (+ $50 Bonus!)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Combine slices into a complete 100% pie! <strong className="text-amber-400">1/4 + 3/4 = 1 Whole Pie</strong>! Or serve hungry customer orders at the top for <strong className="text-amber-400">1.4x bonus tips</strong>!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transform hover:scale-[1.02] transition-all"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>I&apos;M READY TO TRADE! 🚀</span>
        </button>
      </div>
    </div>
  );
};
