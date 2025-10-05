import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Nouana Planner Logo"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" /> 
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    <path
      d="M10 42V6H17.5C21.0899 6 24 8.91015 24 12.5V12.5C24 16.0899 21.0899 19 17.5 19H10"
      stroke="url(#logoGradient)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M38 6V42H30.5C26.9101 42 24 39.0899 24 35.5V35.5C24 31.9101 26.9101 29 30.5 29H38"
      stroke="url(#logoGradient)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 19L24 29"
      stroke="url(#logoGradient)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);