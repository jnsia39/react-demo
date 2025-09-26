import { Polyline } from '@react-google-maps/api';
import { MarkerData } from '../types';

interface RoutePolylinesProps {
  markers: MarkerData[];
  isTrackingMode: boolean;
  connectedMarkers: string[];
  editingRouteIndex: number | null;
  editingRoute: string[];
  markerRoutes: string[][];
}

export default function RoutePolylines({
  markers,
  isTrackingMode,
  connectedMarkers,
  editingRouteIndex,
  editingRoute,
  markerRoutes,
}: RoutePolylinesProps) {
  return (
    <>
      {/* 연결 중인 마커들의 임시 경로 표시 */}
      {isTrackingMode && connectedMarkers.length > 1 && (
        <Polyline
          path={
            connectedMarkers
              .map((markerId) => {
                const marker = markers.find((m) => m.id === markerId);
                return marker ? marker.position : null;
              })
              .filter(Boolean) as google.maps.LatLngLiteral[]
          }
          options={{
            strokeColor: '#10b981',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            icons: [
              {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 3,
                  strokeColor: '#10b981',
                },
                offset: '100%',
                repeat: '50px',
              },
            ],
          }}
        />
      )}

      {/* 편집 중인 경로 표시 */}
      {editingRouteIndex !== null && editingRoute.length > 1 && (
        <Polyline
          path={
            editingRoute
              .map((markerId) => {
                const marker = markers.find((m) => m.id === markerId);
                return marker ? marker.position : null;
              })
              .filter(Boolean) as google.maps.LatLngLiteral[]
          }
          options={{
            strokeColor: '#fbbf24',
            strokeOpacity: 0.9,
            strokeWeight: 4,
            icons: [
              {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 4,
                  strokeColor: '#fbbf24',
                },
                offset: '100%',
              },
            ],
          }}
        />
      )}

      {/* 저장된 마커 경로들 표시 */}
      {markerRoutes.map((route, index) => {
        const routePath = route
          .map((markerId) => {
            const marker = markers.find((m) => m.id === markerId);
            return marker ? marker.position : null;
          })
          .filter(Boolean) as google.maps.LatLngLiteral[];

        if (routePath.length < 2) return null;

        return (
          <Polyline
            key={`route-${index}`}
            path={routePath}
            options={{
              strokeColor: '#10b981', // 연결 중인 경로와 같은 색상
              strokeOpacity: 0.9,
              strokeWeight: 4,
              icons: [
                {
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 4,
                    strokeColor: '#10b981',
                    fillColor: 'white',
                    fillOpacity: 1,
                  },
                  offset: '0%',
                },
                {
                  icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 4,
                    strokeColor: '#10b981',
                  },
                  offset: '100%',
                },
              ],
            }}
          />
        );
      })}
    </>
  );
}
