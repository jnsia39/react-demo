import React from 'react';

interface MarkerIconProps {
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  isConnected?: boolean;
  connectOrder?: number;
  isInEditingRoute?: boolean;
  editOrder?: number;
  hasVideos?: boolean;
  videoCount?: number;
}

const MarkerIcon: React.FC<MarkerIconProps> = ({
  size = 42,
  fillColor = '#4FC3F7',
  strokeColor = '#29B6F6',
  strokeWidth = 2,
  isConnected = false,
  connectOrder = 0,
  isInEditingRoute = false,
  editOrder = 0,
  hasVideos = false,
  videoCount = 0,
}) => (
  <svg
    width={size}
    height={size + 8}
    viewBox="0 0 32 40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity="0.3" />
      </filter>
    </defs>
    {/* 단순한 핀 모양 */}
    <path
      d="M16 4C11.6 4 8 7.6 8 12c0 6 8 20 8 20s8-14 8-20c0-4.4-3.6-8-8-8z"
      fill={fillColor}
      stroke="white"
      strokeWidth={strokeWidth}
      filter="url(#shadow)"
    />
    {/* 중앙 원 */}
    <circle cx="16" cy="12" r="4" fill="white" />
    <circle cx="16" cy="12" r="2.5" fill={strokeColor} />
    {/* 연결 순서 */}
    {isConnected && connectOrder > 0 && (
      <>
        <circle
          cx="26"
          cy="6"
          r="5"
          fill="#2ED573"
          stroke="white"
          strokeWidth={2}
          filter="url(#shadow)"
        />
        <text
          x="26"
          y="9"
          textAnchor="middle"
          fill="white"
          fontSize={9}
          fontWeight="bold"
        >
          {connectOrder}
        </text>
      </>
    )}
    {/* 편집 경로 순서 */}
    {isInEditingRoute && editOrder > 0 && (
      <>
        <circle
          cx="26"
          cy="6"
          r="5"
          fill="#FFA726"
          stroke="white"
          strokeWidth={2}
          filter="url(#shadow)"
        />
        <text
          x="26"
          y="9"
          textAnchor="middle"
          fill="white"
          fontSize={9}
          fontWeight="bold"
        >
          {editOrder}
        </text>
      </>
    )}
    {/* 비디오 개수 */}
    {hasVideos && !isConnected && !isInEditingRoute && (
      <>
        <circle
          cx="26"
          cy="6"
          r="5"
          fill="#4FC3F7"
          stroke="white"
          strokeWidth={2}
          filter="url(#shadow)"
        />
        <text x="26" y="9" textAnchor="middle" fill="white" fontSize={7}>
          {videoCount}
        </text>
      </>
    )}
  </svg>
);

export default MarkerIcon;
