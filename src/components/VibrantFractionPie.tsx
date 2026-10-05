import React from 'react';

interface VibrantFractionPieProps {
  numerator: number;
  denominator: number;
  size?: number;
  color?: string;
  className?: string;
  showCenterText?: boolean;
}

export const VibrantFractionPie: React.FC<VibrantFractionPieProps> = ({
  numerator,
  denominator,
  size = 64,
  color = '#06b6d4',
  className = '',
  showCenterText = true,
}) => {
  const radius = size / 2 - 3;
  const center = size / 2;
  const clampedNumerator = Math.min(numerator, denominator);
  const percent = Math.round((clampedNumerator / denominator) * 100);

  const anglePerSlice = 360 / denominator;
  const slices = [];

  for (let i = 0; i < denominator; i++) {
    const startAngle = (i * anglePerSlice - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * anglePerSlice - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const isFilled = i < clampedNumerator;
    const largeArcFlag = anglePerSlice > 180 ? 1 : 0;

    const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    slices.push(
      <path
        key={i}
        d={pathData}
        fill={isFilled ? color : '#1e293b'}
        fillOpacity={isFilled ? 0.95 : 0.4}
        stroke="#0f172a"
        strokeWidth={denominator > 6 ? 1.5 : 2}
        className="transition-all duration-300"
      />
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible drop-shadow-md">
        {slices}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#475569"
          strokeWidth="2"
        />
        {/* Inner glow circle */}
        <circle
          cx={center}
          cy={center}
          r={radius * 0.35}
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="1.5"
        />
      </svg>
      {showCenterText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-black font-mono text-white tracking-tighter">
            {percent}%
          </span>
        </div>
      )}
    </div>
  );
};
