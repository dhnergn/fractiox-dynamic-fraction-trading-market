import React from 'react';
import { ActiveTab, GameSpeed } from '../types/market';
import { formatCurrency } from '../utils/mathFractions';
import { 
  TrendingUp, 
  Wallet, 
  Zap, 
  Layers, 
  Target, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Settings2,
  Gauge
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cash: number;
  netWorth: number;
  unrealizedPnL: number;
  arbitrageCount: number;
  pendingChallengesCount: number;
  isMuted: boolean;
  toggleMute: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  gameSpeed: GameSpeed;
  cycleSpeed: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cash,
  netWorth,
  unrealizedPnL,
  arbitrageCount,
  pendingChallengesCount,
  isMuted,
  toggleMute,
  onOpenAchievements,
  onOpenSettings,
  gameSpeed,
  cycleSpeed,
}) => {
  const pnlIsPositive = unrealizedPnL >= 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single-Element Brand Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('MARKET');
            }}
            className="flex items-center gap-2 group text-xl font-extrabold tracking-tight text-white hover:text-emerald-400 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="font-mono text-xs font-black text-slate-950">½</span>
            </div>
            <span>FractioX</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links / Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('MARKET')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'MARKET'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Market Floor</span>
          </button>

          <button
            onClick={() => setActiveTab('PORTFOLIO')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'PORTFOLIO'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Portfolio</span>
          </button>

          <button
            onClick={() => setActiveTab('ARBITRAGE')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'ARBITRAGE'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Arbitrage Radar</span>
            {arbitrageCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('SYNTHESIZER')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'SYNTHESIZER'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Whole Synthesizer</span>
          </button>

          <button
            onClick={() => setActiveTab('CHALLENGES')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'CHALLENGES'
                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Client Desk</span>
            {pendingChallengesCount > 0 && (
              <span className="text-[10px] font-mono px-1 rounded bg-purple-500/30 text-purple-300 font-bold">
                {pendingChallengesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Portfolio Valuation & Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Net Worth Display */}
          <div className="flex flex-col items-end text-right">
            <div className="flex items-center gap-1.5 text-xs font-bold font-mono tracking-tight text-white">
              <span>{formatCurrency(netWorth)}</span>
              <span
                className={`text-[11px] ${
                  pnlIsPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ({pnlIsPositive ? '+' : ''}{formatCurrency(unrealizedPnL)})
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Cash: <span className="text-slate-200">{formatCurrency(cash)}</span>
            </div>
          </div>

          {/* Quick Speed Switcher */}
          <button
            onClick={cycleSpeed}
            title={`Market Speed: ${gameSpeed}`}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-xs font-mono"
          >
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-[11px] uppercase font-bold">{gameSpeed}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Career & Achievements */}
          <button
            onClick={onOpenAchievements}
            aria-label="Achievements and statistics"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Settings modal */}
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden items-center justify-between gap-1 pt-2.5 mt-2 border-t border-slate-900 overflow-x-auto">
        <button
          onClick={() => setActiveTab('MARKET')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'MARKET' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setActiveTab('PORTFOLIO')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'PORTFOLIO' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Portfolio
        </button>
        <button
          onClick={() => setActiveTab('ARBITRAGE')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'ARBITRAGE' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400'
          }`}
        >
          Arbitrage {arbitrageCount > 0 ? `(${arbitrageCount})` : ''}
        </button>
        <button
          onClick={() => setActiveTab('SYNTHESIZER')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'SYNTHESIZER' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'
          }`}
        >
          Synthesizer
        </button>
        <button
          onClick={() => setActiveTab('CHALLENGES')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeTab === 'CHALLENGES' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400'
          }`}
        >
          Client Desk {pendingChallengesCount > 0 ? `(${pendingChallengesCount})` : ''}
        </button>
      </div>
    </header>
  );
};
