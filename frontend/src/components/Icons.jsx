import React from 'react';

const defaultProps = {
  width: "20",
  height: "20",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 2,
};

export const WalletIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export const UsersIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export const CalculatorIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export const PlusIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export const TrashIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const ArrowLeftIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export const ArrowRightIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export const CheckIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export const CopyIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const LogOutIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export const LogInIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
  </svg>
);

export const UserIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const LockIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export const ScaleIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

export const RefreshIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export const MenuIcon = ({ className = "w-6 h-6", style, ...props }) => (
  <svg {...defaultProps} width="24" height="24" className={`shrink-0 ${className}`} style={{ width: '1.5rem', height: '1.5rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CloseIcon = ({ className = "w-6 h-6", style, ...props }) => (
  <svg {...defaultProps} width="24" height="24" className={`shrink-0 ${className}`} style={{ width: '1.5rem', height: '1.5rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const EditIcon = ({ className = "w-4 h-4", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1rem', height: '1rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const DownloadIcon = ({ className = "w-4 h-4", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1rem', height: '1rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const CheckCircleIcon = ({ className = "w-4 h-4", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1rem', height: '1rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ChartBarIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const TrendingUpIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export const PieChartIcon = ({ className = "w-5 h-5", style, ...props }) => (
  <svg {...defaultProps} className={`shrink-0 ${className}`} style={{ width: '1.25rem', height: '1.25rem', ...style }} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);
