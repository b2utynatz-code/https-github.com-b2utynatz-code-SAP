import React, { useState } from 'react';

interface McuLogoProps {
  className?: string;
  size?: number | string;
}

export const McuLogo: React.FC<McuLogoProps> = ({ className = 'w-12 h-12', size }) => {
  const [imgError, setImgError] = useState(false);

  // If the uploaded image exists, render it. If it fails to load or 404s, fall back to the vector SVG of the exact MCU seal.
  if (!imgError) {
    return (
      <img
        src="/20190423145557_242F6AF6-93CB-4957-8DD9-BF307081EA37.png"
        alt="ตราสัญลักษณ์ มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย (มจร)"
        className={`object-contain ${className} rounded-full bg-white p-0.5 shadow-sm`}
        style={size ? { width: size, height: size } : undefined}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  return <McuVectorSeal className={className} size={size} />;
};

/**
 * High-fidelity Vector SVG Reproduction of the MCU (มจร) Official Seal
 * Color: Official MCU Magenta/Deep Pink (#E4007F)
 */
export const McuVectorSeal: React.FC<McuLogoProps> = ({ className = 'w-12 h-12', size }) => {
  const pink = '#E4007F';
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 500 500"
      className={`${className} shrink-0`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ตราสัญลักษณ์ มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย"
    >
      <defs>
        {/* Top Text Path for "ปญฺญา โลกสฺมิ ปชฺโชโต" */}
        <path
          id="topTextPath"
          d="M 68,250 A 182,182 0 0,1 432,250"
          fill="none"
        />
        {/* Bottom Text Path for "มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย" */}
        <path
          id="bottomTextPath"
          d="M 432,250 A 182,182 0 0,1 68,250"
          fill="none"
        />
      </defs>

      {/* White circular background for contrast */}
      <circle cx="250" cy="250" r="248" fill="#ffffff" />

      {/* Outer borders */}
      <circle cx="250" cy="250" r="244" fill="none" stroke={pink} strokeWidth="5" />
      <circle cx="250" cy="250" r="236" fill="none" stroke={pink} strokeWidth="2.5" />
      <circle cx="250" cy="250" r="218" fill="none" stroke={pink} strokeWidth="3" />

      {/* Kanok / Floral scroll outer ring tick marks */}
      {Array.from({ length: 48 }).map((_, i) => {
        const angle = (i * 360) / 48;
        return (
          <path
            key={`flame-${i}`}
            d="M 250,14 C 253,20 256,26 250,32"
            transform={`rotate(${angle} 250 250)`}
            fill="none"
            stroke={pink}
            strokeWidth="1.5"
          />
        );
      })}

      {/* Middle borders enclosing text */}
      <circle cx="250" cy="250" r="148" fill="none" stroke={pink} strokeWidth="3" />
      <circle cx="250" cy="250" r="142" fill="none" stroke={pink} strokeWidth="1.5" />

      {/* Circular Text: Top - Wisdom is the light of the world */}
      <text
        fill={pink}
        fontSize="34"
        fontWeight="bold"
        fontFamily="'Sarabun', 'Prompt', sans-serif"
        letterSpacing="3"
      >
        <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
          ปญฺญา  โลกสฺมิ  ปชฺโชโต
        </textPath>
      </text>

      {/* Circular Text: Bottom - Mahachulalongkornrajavidyalaya University */}
      <text
        fill={pink}
        fontSize="24"
        fontWeight="bold"
        fontFamily="'Sarabun', 'Prompt', sans-serif"
        letterSpacing="1.5"
      >
        <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">
          มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย
        </textPath>
      </text>

      {/* Star ornaments separating top & bottom text */}
      <g transform="translate(62, 250)">
        <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill={pink} />
      </g>
      <g transform="translate(438, 250)">
        <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill={pink} />
      </g>

      {/* 8 Lotus Petals Ring (Dhamma Wheel Spoke Flowers) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = i * 45;
        return (
          <g key={`petal-${i}`} transform={`rotate(${angle} 250 250)`}>
            {/* Outer lotus cup */}
            <path
              d="M 235,142 C 238,125 245,115 250,112 C 255,115 262,125 265,142 Z"
              fill="none"
              stroke={pink}
              strokeWidth="2.5"
            />
            <path
              d="M 226,142 C 234,130 242,122 250,120 C 258,122 266,130 274,142"
              fill="none"
              stroke={pink}
              strokeWidth="1.5"
            />
          </g>
        );
      })}

      {/* Pearl Ring (Solid Pink background with White Dots) */}
      <circle cx="250" cy="250" r="108" fill={pink} />
      <circle cx="250" cy="250" r="88" fill="#ffffff" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const cx = 250 + 98 * Math.cos(rad);
        const cy = 250 + 98 * Math.sin(rad);
        return <circle key={`dot-${i}`} cx={cx} cy={cy} r="4.5" fill="#ffffff" />;
      })}

      {/* Inner Wheel Border */}
      <circle cx="250" cy="250" r="88" fill="none" stroke={pink} strokeWidth="3" />

      {/* 12 Radiant Rays bursting from the Sacred Center */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30;
        return (
          <g key={`ray-${i}`} transform={`rotate(${angle} 250 235)`}>
            <polygon
              points="248,225 250,165 252,225"
              fill="none"
              stroke={pink}
              strokeWidth="1.5"
            />
          </g>
        );
      })}

      {/* Central Sacred Stupa / Phra Kiao (พระเกี้ยว / มณฑปเจดีย์) */}
      <g transform="translate(250, 235)">
        {/* Crown spire tip */}
        <circle cx="0" cy="-60" r="3.5" fill={pink} />
        <line x1="0" y1="-60" x2="0" y2="-45" stroke={pink} strokeWidth="2.5" />
        
        {/* Spire rings */}
        <polygon points="-5,-45 0,-52 5,-45" fill={pink} />
        <ellipse cx="0" cy="-40" rx="6" ry="2.5" fill={pink} />
        <ellipse cx="0" cy="-35" rx="8" ry="3" fill="none" stroke={pink} strokeWidth="2" />
        
        {/* Central Lotus Bell Tower */}
        <path
          d="M -11,-30 C -9,-35 9,-35 11,-30 L 14,-15 C 14,-5 -14,-5 -14,-15 Z"
          fill="none"
          stroke={pink}
          strokeWidth="2"
        />
        {/* Hatching details */}
        <line x1="-8" y1="-25" x2="8" y2="-25" stroke={pink} strokeWidth="1.2" />
        <line x1="-10" y1="-20" x2="10" y2="-20" stroke={pink} strokeWidth="1.2" />
        <line x1="-12" y1="-15" x2="12" y2="-15" stroke={pink} strokeWidth="1.2" />

        {/* Base Lotus Tier */}
        <path
          d="M -18,-10 C -18,-2 18,-2 18,-10 Z"
          fill="none"
          stroke={pink}
          strokeWidth="2"
        />

        {/* Oval Base Cushion with "ม จ ร" */}
        <ellipse cx="0" cy="18" rx="42" ry="16" fill="#ffffff" stroke={pink} strokeWidth="2.5" />
        
        {/* Tassels */}
        <path d="M -41,18 C -43,24 -40,32 -42,36" stroke={pink} strokeWidth="1.5" fill="none" />
        <circle cx="-42" cy="36" r="2" fill={pink} />
        <path d="M 41,18 C 43,24 40,32 42,36" stroke={pink} strokeWidth="1.5" fill="none" />
        <circle cx="42" cy="36" r="2" fill={pink} />

        {/* Thai Script: "ม จ ร" */}
        <text
          x="0"
          y="23"
          textAnchor="middle"
          fill={pink}
          fontSize="14"
          fontWeight="bold"
          fontFamily="'Sarabun', 'Prompt', sans-serif"
          letterSpacing="4"
        >
          ม  จ  ร
        </text>
      </g>
    </svg>
  );
};
