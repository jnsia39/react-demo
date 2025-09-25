import { MarkerData } from '../types';

export const createMarkerIcon = (
  marker: MarkerData,
  hoveredMarkerId: string | null,
  connectedMarkers: string[],
  editingRoute: string[]
) => {
  const isHovered = hoveredMarkerId === marker.id;
  const isConnected = connectedMarkers.includes(marker.id);
  const connectOrder = connectedMarkers.indexOf(marker.id) + 1;
  const isInEditingRoute = editingRoute.includes(marker.id);
  const editOrder = editingRoute.indexOf(marker.id) + 1;
  const hasVideos = marker.videos && marker.videos.length > 0;

  // 하늘색 계열 색상 설정
  let fillColor = '#4FC3F7'; // 하늘색
  let strokeColor = '#29B6F6';

  if (isConnected) {
    fillColor = '#2ED573'; // 밝은 초록색
    strokeColor = '#26C65B';
  }
  if (isInEditingRoute) {
    fillColor = '#FFA726'; // 밝은 주황색
    strokeColor = '#FF9800';
  }

  const size = isHovered ? 48 : 42;
  const strokeWidth = isHovered ? 3 : 2;

  // SVG 문자열 직접 생성 (단순한 디자인)
  const svgString = `
    <svg width="${size}" height="${
    size + 8
  }" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-opacity="0.3"/>
        </filter>
      </defs>

      <!-- 단순한 핀 모양 -->
      <path d="M16 4C11.6 4 8 7.6 8 12c0 6 8 20 8 20s8-14 8-20c0-4.4-3.6-8-8-8z"
            fill="${fillColor}"
            stroke="white"
            stroke-width="${strokeWidth}"
            filter="url(#shadow)"/>

      <!-- 중앙 원 -->
      <circle cx="16" cy="12" r="4" fill="white"/>
      <circle cx="16" cy="12" r="2.5" fill="${strokeColor}"/>

      ${
        isConnected && connectOrder > 0
          ? `
        <circle cx="26" cy="6" r="5" fill="#2ED573" stroke="white" stroke-width="2" filter="url(#shadow)"/>
        <text x="26" y="9" text-anchor="middle" fill="white" font-size="9" font-weight="bold">${connectOrder}</text>
      `
          : ''
      }

      ${
        isInEditingRoute && editOrder > 0
          ? `
        <circle cx="26" cy="6" r="5" fill="#FFA726" stroke="white" stroke-width="2" filter="url(#shadow)"/>
        <text x="26" y="9" text-anchor="middle" fill="white" font-size="9" font-weight="bold">${editOrder}</text>
      `
          : ''
      }

      ${
        hasVideos && !isConnected && !isInEditingRoute
          ? `
        <circle cx="26" cy="6" r="5" fill="#4FC3F7" stroke="white" stroke-width="2" filter="url(#shadow)"/>
        <text x="26" y="9" text-anchor="middle" fill="white" font-size="7">${marker.videos.length}</text>
      `
          : ''
      }
    </svg>
  `;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString),
    scaledSize: new google.maps.Size(size, size + 8),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(size / 2, size + 6),
  };
};
