import React from 'react';

interface FractionBarProps {
  numerator: number;
  denominator: number;
  color?: string;
  className?: string;
  showRuler?: boolean;
}

export const FractionBar: React.FC<FractionBarProps> = ({
  numerator,
  denominator,
  color = '#10b981',
  className = '',
  showRuler = false,
}) => {
  const clampedNumerator = Math.min(numerator, denominator);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex h-3 w-full overflow-hidden rounded bg-slate-800/80 border border-slate-700/60 p-0.5 gap-0.5">
        {Array.from({ length: denominator }).map((_, idx) => {
          const isFilled = idx < clampedNumerator;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: isFilled ? color : 'transparent',
              }}
              className={`flex-1 h-full rounded-sm transition-all duration-200 ${
                isFilled ? 'opacity-90 shadow-xs' : 'bg-slate-800/40 hover:bg-slate-700/50'
              }`}
              title={`Unit ${idx + 1}/${denominator}`}
            />
          );
        })}
      </div>
      {showRuler && (
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
          <span>0</span>
          <span>{clampedNumerator}/{denominator} ({(clampedNumerator / denominator * 100).toFixed(1)}%)</span>
          <span>1.0</span>
        </div>
      )}
    </div>
  );
};
