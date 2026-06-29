import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;
  
  const normalizedStatus = status.toLowerCase();
  
  let colorClass = 'bg-gray-100 text-gray-500'; // paused, pending, on-hold
  
  if (['active', 'completed'].includes(normalizedStatus)) {
    colorClass = 'bg-green-100 text-green-700';
  } else if (['trial', 'in-progress', 'scoping'].includes(normalizedStatus)) {
    colorClass = 'bg-orange-100 text-orange-600';
  } else if (['delayed', 'ended'].includes(normalizedStatus)) {
    colorClass = 'bg-red-100 text-red-600';
  }
  
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {displayStatus}
    </span>
  );
};

export default StatusBadge;
