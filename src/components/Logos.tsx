import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * High-fidelity SVG Component of the "Asambleas de Dios" (Assemblies of God) Logo
 * Consists of the yellow-orange-red flame, banner text, and "AD - Evangelio Pleno" shield.
 */
export const AsambleasDeDiosLogo: React.FC<LogoProps> = ({ size = 64, className, ...props }) => {
  return (
    <svg
      id="logo-asambleas-de-dios"
      width={size}
      height={size * 1.4}
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        {/* Flame Gradients */}
        <linearGradient id="flame-grad-ad" x1="50" y1="5" x2="50" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffea00" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        
        {/* Simple drop shadows for depth */}
        <filter id="shadow-ad" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Main Flame */}
      <g filter="url(#shadow-ad)">
        {/* Back Flame (Left Accent) */}
        <path
          d="M 40,40 C 25,25 25,12 33,26 C 38,34 39,45 42,50 C 44,53 47,48 48,45 C 49,42 45,34 43,30 C 40,24 45,21 47,24 C 50,28 50,38 52,43 C 53,46 55,42 55,38 C 55,25 43,18 42,10 C 41,5 47,15 50,18 C 54,22 57,30 59,38 C 61,42 63,38 63,35 C 63,22 55,16 54,8 C 58,15 63,21 66,28 C 73,43 73,56 68,66 C 60,82 40,82 32,68 C 28,62 28,50 34,40 C 36,37 38,40 37,42 C 34,48 35,56 39,60 C 42,63 45,58 45,55 C 45,49 43,45 40,40 Z"
          fill="url(#flame-grad-ad)"
        />
        
        {/* Inner Heart/Flame Core with glowing hot center */}
        <path
          d="M 48,12 C 48,12 55,24 55,34 C 55,42 51,48 48,52 C 45,48 41,42 41,34 C 41,24 48,12 48,12 Z"
          fill="#ffea00"
          opacity="0.8"
        />
      </g>

      {/* Blue Banner with "ASAMBLEAS de DIOS" */}
      <g id="ad-banner" filter="url(#shadow-ad)">
        {/* Outer Banner Border/Background */}
        <rect x="18" y="82" width="64" height="12" rx="1.5" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2" />
        <line x1="18" y1="92" x2="82" y2="92" stroke="#1e3a8a" strokeWidth="1" />
        
        {/* Text */}
        <text
          x="50"
          y="90.5"
          fill="#1e3a8a"
          fontSize="7"
          fontWeight="bold"
          fontFamily="sans-serif"
          textAnchor="middle"
          letterSpacing="0.4"
        >
          ASAMBLEAS de DIOS
        </text>
      </g>

      {/* Bottom Shield */}
      <g id="ad-shield">
        {/* Shield outline */}
        <path
          d="M 18,94 L 18,105 C 18,125 50,136 50,136 C 50,136 82,125 82,105 L 82,94 Z"
          fill="#ffffff"
          stroke="#1e3a8a"
          strokeWidth="2.5"
        />

        {/* Double Inner Line for crest appearance */}
        <path
          d="M 21,97 L 21,104 C 21,121 50,132 50,132 C 50,132 79,121 79,104 L 79,97"
          stroke="#1e3a8a"
          strokeWidth="0.75"
          fill="none"
        />

        {/* Combined AD Monogram letters */}
        {/* Drawing stylized letters using clean math paths */}
        <path
          d="M 37,121 C 32,121 30,116 32,112 C 34,107 41,104 46,104 C 46,104 44,110 42,114 C 40,119 44,121 47,121"
          stroke="#1e3a8a"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Capital A path */}
        <path
          d="M 35,119 L 43,103 L 48,118"
          stroke="#1e3a8a"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <line x1="37" y1="113" x2="45" y2="113" stroke="#1e3a8a" strokeWidth="3" />

        {/* Capital D path (Interlocking on right) */}
        <path
          d="M 48,101 L 48,119 C 48,119 55,121 61,118 C 67,115 71,109 68,104 C 65,99 53,101 48,101 Z"
          stroke="#1e3a8a"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#ffffff"
        />
        {/* Draw inner D hole */}
        <path
          d="M 52,105 C 56,105 59,106 60,110 C 60,113 56,115 52,115 Z"
          fill="#1e3a8a"
        />

        {/* Mini Book (Evangelio Pleno) on Left Shield Flank */}
        <g transform="translate(23, 102) scale(0.65)" id="mini-book">
          <rect x="1" y="2" width="13" height="10" rx="1" fill="#ffffff" stroke="#1e3a8a" strokeWidth="1" />
          <line x1="7.5" y1="2" x2="7.5" y2="12" stroke="#1e3a8a" strokeWidth="1" />
          <text x="4" y="6.5" fill="#1e3a8a" fontSize="3.2" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">EVAN</text>
          <text x="4" y="10.5" fill="#1e3a8a" fontSize="3.2" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">GELIO</text>
          <text x="11" y="8.5" fill="#1e3a8a" fontSize="3.8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">PLENO</text>
        </g>
      </g>
    </svg>
  );
};

/**
 * High-fidelity SVG Component of the "ITA - HUÁNUCO" Circular Logo
 * Displays a circle badge outlining a church home with a Christian family inside, and an open Bible.
 */
export const ItaHuanucoLogo: React.FC<LogoProps> = ({ size = 64, className, ...props }) => {
  return (
    <svg
      id="logo-ita-huanuco"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        {/* Subtle drop shadows for organic circles */}
        <filter id="shadow-ita" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Circular border casing */}
      <circle cx="50" cy="50" r="47.5" stroke="#1d4ed8" strokeWidth="1.8" fill="#ffffff" />
      <circle cx="50" cy="50" r="45.5" stroke="#1e3a8a" strokeWidth="0.5" fill="none" />

      {/* Church outline house shape in dark blue */}
      <path
        d="M 18.5,60.5 L 12,60.5 L 12,62 L 28,62 L 28,38 L 50,21 L 72,38 L 72,62 L 86,62 L 86,60.5 L 79.5,60.5 L 79.5,36.5 L 50,14 L 20.5,36.5 Z"
        fill="#1e40af"
      />
      <path
        d="M 28,38 L 28,62 M 72,38 L 72,62"
        stroke="#1d4ed8"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Red cross with flame sitting on top roof */}
      <g transform="translate(0, -1)" id="ita-roof-flame">
        {/* Core flame shape in brilliant orange-red */}
        <path
          d="M 50,5 C 44,11 40,17 40,24 C 40,29 44,32 50,32 C 56,32 60,29 60,24 C 60,17 56,11 50,5 Z"
          fill="#f97316"
        />
        <path
          d="M 50,7 C 46,12 43,17 43,23 C 43,27 46,29 50,29 C 54,29 57,27 57,23 C 57,17 54,12 50,7 Z"
          fill="#ef4444"
        />
        {/* White Christian Cross superimposed over the flame */}
        <path
          d="M 48.5,13 L 51.5,13 L 51.5,18.5 L 55,18.5 L 55,21.5 L 51.5,21.5 L 51.5,28 L 48.5,28 L 48.5,21.5 L 45,21.5 L 45,18.5 L 48.5,18.5 Z"
          fill="#ffffff"
        />
      </g>

      {/* Stylized Happy Family inside the house */}
      <g id="family-group" filter="url(#shadow-ita)">
        {/* 1. Parent Father (Dark Blue, Center) */}
        {/* Head */}
        <circle cx="51" cy="42" r="4.5" fill="#1e3a8a" />
        {/* Body waving layout arm */}
        <path
          d="M 51,46.5 C 46,47.5 40,49.5 40,49.5 L 44,52 C 45.5,50.5 48.5,50 51.5,50 C 53.5,50.5 54.5,52 56,53 C 57.5,51.5 60.5,45.5 61,43.5 C 57,45 54,46.5 51,46.5 Z"
          fill="#1e3a8a"
        />
        <path
          d="M 47,50 L 48.5,64 L 54.5,64 L 56,50.5 Z"
          fill="#1e3a8a"
        />

        {/* 2. Parent Mother (Bright Pink/Red, Left) */}
        {/* Head */}
        <circle cx="39" cy="46" r="4" fill="#dc2626" />
        {/* Body with waving layout arm */}
        <path
          d="M 39,50 C 35,49 32,41 31.5,39.5 C 31,41.5 33,48 35,51 C 36,49.5 38.5,50 40,51 L 43,50 C 42,48.5 40.5,49.5 39,50 Z"
          fill="#dc2626"
        />
        <path
          d="M 37.5,50 L 33,60.5 C 34.5,62.5 37,63 38.5,63 L 41.5,63 C 43,63 43.5,59.5 45.5,51 L 37.5,50 Z"
          fill="#dc2626"
        />

        {/* 3. Teenager / Child (Warm Orange, Right) */}
        {/* Head */}
        <circle cx="61" cy="48" r="3.5" fill="#f97316" />
        {/* Body raised arm */}
        <path
          d="M 61,51.5 C 59,51.5 54,54 52.5,54 C 54.5,55.5 56.5,56 59,55.5 C 61,54.5 64,50 64.5,48.5 C 64,49 63,51 61,51.5 Z"
          fill="#f97316"
        />
        <path
          d="M 57.5,54.5 L 57.5,61 C 58.5,62.5 59.5,62.5 61,62.5 L 62.5,62.5 L 63.5,55 L 57.5,54.5 Z"
          fill="#f97316"
        />

        {/* 4. Toddler / Child (Vibrant Green, Front-Center) */}
        {/* Head */}
        <circle cx="49" cy="53" r="3" fill="#22c55e" />
        {/* Body with tiny raised hands */}
        <path
          d="M 49,56 C 46.5,56 44,57 43,56 C 44,58 46.5,59 48,59 L 50,59 C 51.5,59 54,58 55,56 C 54,57 51.5,56 49,56 Z"
          fill="#22c55e"
        />
        <path
          d="M 46.5,58 L 47.5,65 L 51,65 L 51.5,58 Z"
          fill="#22c55e"
        />
      </g>

      {/* Styled Open Bible at the bottom with layered blue base and green page flares */}
      <g id="bottom-bible" transform="translate(0, 1)">
        {/* Green flares representing pages */}
        <path
          d="M 18,65.5 C 26,63.5 38,65 48.5,70.5 C 38.5,67 26,66 18,67.5 Z"
          fill="#22c55e"
        />
        <path
          d="M 82,65.5 C 74,63.5 62,65 51.5,70.5 C 61.5,67 74,66 82,67.5 Z"
          fill="#22c55e"
        />
        
        {/* Thick Blue Base / Scripture Cover */}
        <path
          d="M 17.5,72 C 26.5,69.5 39,71 49.5,75 C 50.5,75 51,75 51.5,75 C 62,71 74.5,69.5 83.5,72 L 80.5,78 C 73.5,75.5 61.5,77 50.5,80.5 C 39.5,77 27.5,75.5 20.5,78 Z"
          fill="#1e3a8a"
        />
      </g>

      {/* Bottom text badge arc or block: "ITA - HUÁNUCO" */}
      <text
        id="ita-text font-semibold mr-1"
        x="50"
        y="89"
        fill="#1e3a8a"
        fontSize="5.8"
        fontWeight="bold"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="0.4"
      >
        ITA - HUÁNUCO
      </text>
    </svg>
  );
};
