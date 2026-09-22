import React from 'react';

interface CuidaMeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const CuidaMeLogo: React.FC<CuidaMeLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = ''
}) => {
  const iconSizeClass = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16'
  }[size];

  const titleSizeClass = {
    sm: 'text-xl',
    md: 'text-2.5xl',
    lg: 'text-4xl'
  }[size];

  const taglineSizeClass = {
    sm: 'text-[9px]',
    md: 'text-xs',
    lg: 'text-sm'
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon SVG: Official Cuida-me House with Caring Figures and Negative Space Heart */}
      <div className={`${iconSizeClass} shrink-0 flex items-center justify-center relative`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Chimney on right roof slope */}
          <rect x="68" y="20" width="6.5" height="12" rx="1.8" fill="#7027DF" />

          {/* Outer House Frame (Rounded peak, rounded corners, thick stroke, bottom gap) */}
          <path
            d="M 37 84 H 25 C 18 84 12.5 78.5 12.5 71.5 V 40 C 12.5 36.5 14.3 33.3 17.3 31.4 L 44.3 14.2 C 47.8 12 52.2 12 55.7 14.2 L 82.7 31.4 C 85.7 33.3 87.5 36.5 87.5 40 V 71.5 C 87.5 78.5 82 84 75 84 H 63"
            stroke="#7027DF"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 4-Pane Attic Window */}
          <g fill="#7027DF">
            <rect x="42" y="26" width="6.2" height="6.2" rx="1.8" />
            <rect x="51.8" y="26" width="6.2" height="6.2" rx="1.8" />
            <rect x="42" y="35.8" width="6.2" height="6.2" rx="1.8" />
            <rect x="51.8" y="35.8" width="6.2" height="6.2" rx="1.8" />
          </g>

          {/* Left Figure (Purple #7027DF) - Head */}
          <circle cx="35" cy="44" r="9" fill="#7027DF" />

          {/* Left Figure (Purple #7027DF) - Body */}
          <path
            d="M 35 53 C 21 57.5 20 76 32.5 85.5 C 38 89.8 45 94 50 98.5 C 49.8 82 42.5 73.5 35 66 C 30.5 61.5 30.5 56 35 53 Z"
            fill="#7027DF"
          />

          {/* Right Figure (Teal #00C4B4) - Head */}
          <circle cx="65" cy="44" r="9" fill="#00C4B4" />

          {/* Right Figure (Teal #00C4B4) - Body */}
          <path
            d="M 65 53 C 79 57.5 80 76 67.5 85.5 C 62 89.8 55 94 50 98.5 C 50.2 82 57.5 73.5 65 66 C 69.5 61.5 69.5 56 65 53 Z"
            fill="#00C4B4"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className={`font-display font-black tracking-tight ${titleSizeClass} leading-none flex items-center`}>
          <span className="text-[#652BDB] dark:text-purple-400">Cuida</span>
          <span className="text-[#00BBA7] dark:text-teal-400">-me</span>
        </div>
        {showTagline && (
          <p className={`${taglineSizeClass} text-indigo-900/80 dark:text-indigo-300 font-semibold mt-0.5 tracking-tight`}>
            Cuidado que faz bem
          </p>
        )}
      </div>
    </div>
  );
};


