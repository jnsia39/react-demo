import React from 'react';
import { MarkerData } from '../types';

interface MarkerIconProps {
  marker: MarkerData;
  isHovered: boolean;
  isConnected: boolean;
  connectOrder: number;
  isInEditingRoute: boolean;
  editOrder: number;
}

export const MarkerIcon: React.FC<MarkerIconProps> = ({
  marker,
  isHovered,
  isConnected,
  connectOrder,
  isInEditingRoute,
  editOrder,
}) => {
  const hasVideos = marker.videos && marker.videos.length > 0;

  // 더 생동감 있는 색상 팔레트
  let fillColor = '#E53E3E'; // 생생한 빨간색
  let strokeColor = '#C53030';
  let innerColor = '#FED7D7';
  let centerColor = '#E53E3E';

  if (isConnected) {
    fillColor = '#38A169'; // 생생한 초록색
    strokeColor = '#2F855A';
    innerColor = '#C6F6D5';
    centerColor = '#38A169';
  }
  if (isInEditingRoute) {
    fillColor = '#D69E2E'; // 생생한 노란색
    strokeColor = '#B7791F';
    innerColor = '#FAF089';
    centerColor = '#D69E2E';
  }
  if (hasVideos && !isConnected && !isInEditingRoute) {
    fillColor = '#E53E3E';
    strokeColor = '#C53030';
    innerColor = '#FED7D7';
    centerColor = '#E53E3E';
  }

  const size = isHovered ? 44 : 40;
  const strokeWidth = isHovered ? 4 : 3;
  const scale = isHovered ? 1.1 : 1;

  return (
    <svg
      width={size}
      height={size + 12}
      viewBox="0 0 48 60"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `scale(${scale})`, transition: 'all 0.2s ease' }}
    >
      <defs>
        <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="4" result="offset" />
          <feFlood floodColor="#000000" floodOpacity="0.3" />
          <feComposite in2="offset" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="markerGradient" cx="30%" cy="20%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="black" stopOpacity="0.1" />
        </radialGradient>
        <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fillColor} />
          <stop offset="50%" stopColor={strokeColor} />
          <stop offset="100%" stopColor={fillColor} />
        </linearGradient>
        <linearGradient id="innerGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor={innerColor} />
        </linearGradient>
      </defs>

      {/* 외부 핀 모양 */}
      <path
        d="M24 8C17.4 8 12 13.4 12 20c0 11.25 12 28 12 28s12-16.75 12-28c0-6.6-5.4-12-12-12z"
        fill="url(#pinGradient)"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        filter="url(#dropshadow)"
      />

      {/* 하이라이트 효과 */}
      <ellipse cx="20" cy="14" rx="5" ry="7" fill="url(#markerGradient)" />

      {/* 내부 원들 */}
      <circle
        cx="24"
        cy="20"
        r="9"
        fill="white"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <circle cx="24" cy="20" r="7" fill="url(#innerGradient)" />
      <circle cx="24" cy="20" r="5" fill={centerColor} />

      {/* 중앙 하이라이트 */}
      <circle cx="22" cy="18" r="2" fill="white" opacity="0.7" />
      <circle cx="21.5" cy="17.5" r="1" fill="white" opacity="0.9" />

      {/* 연결 순서 배지 */}
      {isConnected && connectOrder > 0 && (
        <g>
          <circle
            cx="40"
            cy="12"
            r="9"
            fill="#38A169"
            stroke="white"
            strokeWidth="3"
            filter="url(#dropshadow)"
          />
          <circle cx="40" cy="12" r="7" fill="#48BB78" />
          <circle cx="40" cy="12" r="5" fill="#68D391" />
          <text
            x="40"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            {connectOrder}
          </text>
        </g>
      )}

      {/* 편집 중 순서 배지 */}
      {isInEditingRoute && editOrder > 0 && (
        <g>
          <circle
            cx="40"
            cy="12"
            r="9"
            fill="#D69E2E"
            stroke="white"
            strokeWidth="3"
            filter="url(#dropshadow)"
          />
          <circle cx="40" cy="12" r="7" fill="#ECC94B" />
          <circle cx="40" cy="12" r="5" fill="#F6E05E" />
          <text
            x="40"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            {editOrder}
          </text>
        </g>
      )}

      {/* 비디오 개수 배지 */}
      {hasVideos && !isConnected && !isInEditingRoute && (
        <g>
          <circle
            cx="40"
            cy="12"
            r="9"
            fill="#E53E3E"
            stroke="white"
            strokeWidth="3"
            filter="url(#dropshadow)"
          />
          <circle cx="40" cy="12" r="7" fill="#F56565" />
          <circle cx="40" cy="12" r="5" fill="#FC8181" />
          <text
            x="40"
            y="15"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            🎥
          </text>
          <text
            x="40"
            y="21"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            {marker.videos.length}
          </text>
        </g>
      )}

      {/* 펄스 효과 (호버 시) */}
      {isHovered && (
        <circle
          cx="24"
          cy="20"
          r="15"
          fill="none"
          stroke={centerColor}
          strokeWidth="2"
          strokeOpacity="0.5"
        >
          <animate
            attributeName="r"
            values="15;20;15"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-opacity"
            values="0.5;0;0.5"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
};
