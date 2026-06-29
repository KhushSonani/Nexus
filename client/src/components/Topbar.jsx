import React from 'react';

const Topbar = ({ title, subtitle, children }) => {
  return (
    <header className="w-full bg-white border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </header>
  );
};

export default Topbar;
