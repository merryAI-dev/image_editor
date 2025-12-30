import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5 pointer-events-none" />

      <div className="flex items-center space-x-4 relative z-10">
        <div className="flex items-center space-x-3">
          {/* Glass banana icon */}
          <div className="relative">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center shadow-lg">
              <span className="text-xl">🍌</span>
            </div>
            {/* Subtle glow */}
            <div className="absolute -inset-1 bg-yellow-400/20 rounded-xl blur-md -z-10" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-white tracking-tight">
              바나나 에디터
            </h1>
            <span className="text-[10px] text-white/50 tracking-wide">
              AI Image Editor
            </span>
          </div>
        </div>
      </div>

    </header>
  );
};
