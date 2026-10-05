import React from 'react';

interface FractionPieProps {
  numerator: number;
  denominator: number;
  size?: number;
  color?: string;
  className?: string;
  showLabels?: boolean;
}

export const FractionPie: React.FC<FractionPieProps> = ({
  numerator,
  denominator,
  size = 56,
  color = '#10b981',
  className = '',
  showLabels = false,
}) => {
  const radius = size / 2 - 4;
  const center = size / 2;
  const clampedNumerator = Math.min(numerator, denominator);
  const percentage = (clampedNumerator / denominator) * 100;

  // Render individual slices if denominator <= 16
  const slices = [];
  const anglePerSlice = 360 / denominator;

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
        fillOpacity={isFilled ? 0.9 : 0.4}
        stroke="#0f172a"
        strokeWidth={denominator > 8 ? 1 : 1.5}
        className="transition-colors duration-200"
      />
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {slices}
        {/* Outer border ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#334155"
          strokeWidth="1.5"
        />
      </svg>
      {showLabels && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold font-mono text-white bg-slate-900/80 px-1 rounded">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
};
