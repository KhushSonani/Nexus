import React from 'react';

const HourProgressBar = ({ used, target, heightClass = "h-1.5" }) => {
  const safeUsed = Number(used) || 0;
  const safeTarget = Number(target) || 1;
  const ratio = safeUsed / safeTarget;
  const percentage = Math.min(Math.round(ratio * 100), 100);

  let fillColor = 'bg-orange-400';
  if (ratio > 0.9) {
    fillColor = 'bg-green-500';
  } else if (ratio < 0.4) {
    fillColor = 'bg-orange-500';
  }

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{safeUsed} / {safeTarget} hrs</span>
        <span>{percentage}%</span>
      </div>
      <div className={`w-full ${heightClass} bg-gray-100 rounded-full overflow-hidden`}>
        <div 
          className={`${heightClass} rounded-full transition-all duration-300 ${fillColor}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default HourProgressBar;
