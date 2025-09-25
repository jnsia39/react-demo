import { useCallback, useEffect, useState, useRef } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Polyline,
  DrawingManager,
  OverlayView,
} from '@react-google-maps/api';
import MapControls from './components/MapControls';
import { MarkerData, VideoInfo, RoutePoint } from './types';
import { createMarkerIcon } from './utils/markerIconHelper';

const libraries: ('drawing' | 'places' | 'geometry')[] = ['drawing'];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 37.5665,
  lng: 126.978,
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  clickableIcons: false,
  disableDoubleClickZoom: false,
  streetViewControl: false,
};

interface GoogleMapComponentProps {
  isDraggingVideo?: boolean;
}

export default function GoogleMapComponent({
  isDraggingVideo = false,
}: GoogleMapComponentProps) {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isMarkerMode, setIsMarkerMode] = useState(false);
  const [dragOverMarkerId, setDragOverMarkerId] = useState<string | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const markerRefs = useRef<{ [key: string]: google.maps.Marker }>({});

  // 마커 연결 모드 관련 상태
  const [isConnectMode, setIsConnectMode] = useState(false);
  const [connectedMarkers, setConnectedMarkers] = useState<string[]>([]);
  const [markerRoutes, setMarkerRoutes] = useState<string[][]>([]);

  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMarker, setEditingMarker] = useState<MarkerData | null>(null);

  // 경로 편집 모드 상태
  const [editingRouteIndex, setEditingRouteIndex] = useState<number | null>(
    null
  );
  const [editingRoute, setEditingRoute] = useState<string[]>([]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getAddressFromCoordinates = async (
    lat: number,
    lng: number
  ): Promise<string> => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng },
      });

      if (response.results && response.results[0]) {
        return response.results[0].formatted_address;
      }
      return '주소를 찾을 수 없습니다';
    } catch (error) {
      console.error('Geocoding error:', error);
      return '주소를 찾을 수 없습니다';
    }
  };

  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      // 정보창이 열려있으면 닫기만 하고 리턴
      if (selectedMarker) {
        setSelectedMarker(null);
        return;
      }

      // 마커 모드일 때만 새 마커 생성
      if (e.latLng && isMarkerMode && !isDrawingMode) {
        const position = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };

        const markerTitles = {
          default: '일반 핀',
          important: '중요 위치',
          warning: '주의 구역',
          info: '정보 지점',
        };

        // 주소 가져오기
        const address = await getAddressFromCoordinates(
          position.lat,
          position.lng
        );

        const newMarker: MarkerData = {
          id: Date.now().toString(),
          position,
          title: `${markers.length + 1}`,
          description: `좌표: ${position.lat.toFixed(
            6
          )}, ${position.lng.toFixed(6)}`,
          address: address,
          timestamp: new Date(),
          videos: [],
        };

        setMarkers((prev) => [...prev, newMarker]);
      }
    },
    [markers, isDrawingMode, isMarkerMode, selectedMarker]
  );

  const handleMarkerClick = (marker: MarkerData) => {
    // 경로 편집 모드일 때
    if (editingRouteIndex !== null) {
      toggleMarkerInEditRoute(marker.id);
    }
    // 연결 모드일 때
    else if (isConnectMode) {
      const markerId = marker.id;

      // 이미 연결된 마커면 제거
      if (connectedMarkers.includes(markerId)) {
        setConnectedMarkers((prev) => prev.filter((id) => id !== markerId));
      } else {
        // 새로 연결
        setConnectedMarkers((prev) => [...prev, markerId]);
      }
    } else {
      // 일반 모드일 때는 편집 모드로 전환
      setSelectedMarker(marker);
      setEditingMarker({ ...marker });
      setIsEditMode(true);
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
    setIsEditMode(false);
    setEditingMarker(null);
  };

  const saveMarkerEdits = () => {
    if (editingMarker && selectedMarker) {
      updateMarkerInfo(
        editingMarker.id,
        editingMarker.title,
        editingMarker.description
      );
      setIsEditMode(false);
    }
  };

  const cancelMarkerEdits = () => {
    if (selectedMarker) {
      setEditingMarker({ ...selectedMarker });
      setIsEditMode(false);
    }
  };

  const updateMarkerInfo = async (
    id: string,
    title: string,
    description: string
  ) => {
    const marker = markers.find((m) => m.id === id);
    if (marker) {
      // 위치 기반으로 주소 업데이트
      const address = await getAddressFromCoordinates(
        marker.position.lat,
        marker.position.lng
      );

      setMarkers((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, title, description, address } : m
        )
      );
      if (selectedMarker?.id === id) {
        setSelectedMarker((prev) =>
          prev ? { ...prev, title, description, address } : null
        );
      }
    }
  };

  const deleteMarker = (id: string) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id));
    setSelectedMarker(null);
    // 연결된 마커 목록에서도 제거
    setConnectedMarkers((prev) => prev.filter((markerId) => markerId !== id));
    // 저장된 경로에서도 제거
    setMarkerRoutes((prev) =>
      prev
        .map((route) => route.filter((markerId) => markerId !== id))
        .filter((route) => route.length > 1)
    );
  };

  // 연결된 마커들로 경로 생성
  const createRouteFromConnectedMarkers = () => {
    if (connectedMarkers.length > 1) {
      setMarkerRoutes((prev) => [...prev, [...connectedMarkers]]);
      setConnectedMarkers([]);
      setIsConnectMode(false);
    }
  };

  // 경로 삭제
  const deleteRoute = (index: number) => {
    setMarkerRoutes((prev) => prev.filter((_, i) => i !== index));
    if (editingRouteIndex === index) {
      setEditingRouteIndex(null);
      setEditingRoute([]);
    }
  };

  // 경로 편집 시작
  const startEditRoute = (index: number) => {
    setEditingRouteIndex(index);
    setEditingRoute([...markerRoutes[index]]);
    setIsConnectMode(false);
    setConnectedMarkers([]);
  };

  // 경로 편집 저장
  const saveEditedRoute = () => {
    if (editingRouteIndex !== null && editingRoute.length > 1) {
      const newRoutes = [...markerRoutes];
      newRoutes[editingRouteIndex] = [...editingRoute];
      setMarkerRoutes(newRoutes);
      setEditingRouteIndex(null);
      setEditingRoute([]);
    }
  };

  // 경로 편집 취소
  const cancelEditRoute = () => {
    setEditingRouteIndex(null);
    setEditingRoute([]);
  };

  // 편집 중인 경로에서 마커 토글
  const toggleMarkerInEditRoute = (markerId: string) => {
    if (editingRoute.includes(markerId)) {
      setEditingRoute((prev) => prev.filter((id) => id !== markerId));
    } else {
      setEditingRoute((prev) => [...prev, markerId]);
    }
  };

  const removeVideoFromMarker = (markerId: string, videoId: string) => {
    setMarkers((prev) =>
      prev.map((marker) =>
        marker.id === markerId
          ? { ...marker, videos: marker.videos.filter((v) => v.id !== videoId) }
          : marker
      )
    );

    if (selectedMarker?.id === markerId) {
      setSelectedMarker((prev) =>
        prev
          ? { ...prev, videos: prev.videos.filter((v) => v.id !== videoId) }
          : null
      );
    }
  };

  const handleMarkerDragOver = (e: React.DragEvent, markerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverMarkerId(markerId);
  };

  const handleMarkerDragLeave = () => {
    setDragOverMarkerId(null);
  };

  const handleMarkerDrop = (e: React.DragEvent, markerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverMarkerId(null);

    const videoData = e.dataTransfer.getData('video');
    if (videoData) {
      try {
        const video: VideoInfo = JSON.parse(videoData);

        setMarkers((prev) =>
          prev.map((marker) => {
            if (marker.id === markerId) {
              const existingVideo = marker.videos.find(
                (v) => v.id === video.id
              );
              if (!existingVideo) {
                return { ...marker, videos: [...marker.videos, video] };
              }
            }
            return marker;
          })
        );

        const updatedMarker = markers.find((m) => m.id === markerId);
        if (updatedMarker && selectedMarker?.id === markerId) {
          const existingVideo = updatedMarker.videos.find(
            (v) => v.id === video.id
          );
          if (!existingVideo) {
            setSelectedMarker({
              ...updatedMarker,
              videos: [...updatedMarker.videos, video],
            });
          }
        }
      } catch (error) {
        console.error('Failed to parse video data:', error);
      }
    }
  };

  const onMarkerLoad = (marker: google.maps.Marker, markerId: string) => {
    markerRefs.current[markerId] = marker;
  };

  const clearRoute = () => {
    setRoutePoints([]);
  };

  const toggleMarkerMode = () => {
    if (isDrawingMode) setIsDrawingMode(false);
    if (isConnectMode) setIsConnectMode(false);
    setIsMarkerMode(!isMarkerMode);
  };

  const toggleConnectMode = () => {
    if (isDrawingMode) setIsDrawingMode(false);
    if (isMarkerMode) setIsMarkerMode(false);
    setIsConnectMode(!isConnectMode);
    if (isConnectMode) {
      // 연결 모드를 끌 때 선택된 마커들 초기화
      setConnectedMarkers([]);
    }
  };

  // Use imported createMarkerIcon function with current state
  const getIcon = (marker: MarkerData) => {
    return createMarkerIcon(
      marker,
      hoveredMarkerId,
      connectedMarkers,
      editingRoute
    );
  };

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath();
    const coordinates = [];
    for (let i = 0; i < path.getLength(); i++) {
      const latLng = path.getAt(i);
      coordinates.push({
        lat: latLng.lat(),
        lng: latLng.lng(),
      });
    }
    console.log('Polygon coordinates:', coordinates);
  };

  const onPolylineComplete = (polyline: google.maps.Polyline) => {
    const path = polyline.getPath();
    const coordinates = [];
    for (let i = 0; i < path.getLength(); i++) {
      const latLng = path.getAt(i);
      coordinates.push({
        lat: latLng.lat(),
        lng: latLng.lng(),
      });
    }
    console.log('Polyline coordinates:', coordinates);
  };

  const onRectangleComplete = (rectangle: google.maps.Rectangle) => {
    const bounds = rectangle.getBounds();
    if (bounds) {
      console.log('Rectangle bounds:', {
        north: bounds.getNorthEast().lat(),
        south: bounds.getSouthWest().lat(),
        east: bounds.getNorthEast().lng(),
        west: bounds.getSouthWest().lng(),
      });
    }
  };

  const onCircleComplete = (circle: google.maps.Circle) => {
    const center = circle.getCenter();
    if (center) {
      console.log('Circle:', {
        center: { lat: center.lat(), lng: center.lng() },
        radius: circle.getRadius(),
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapControls
        isMarkerMode={isMarkerMode}
        isConnectMode={isConnectMode}
        isConnectingMarkers={isConnectMode}
        connectedMarkersCount={connectedMarkers.length}
        editingRouteIndex={editingRouteIndex}
        markersCount={markers.length}
        routePointsCount={routePoints.length}
        markerRoutesCount={markerRoutes.length}
        markerRoutes={markerRoutes}
        editingRoute={editingRoute}
        onToggleMarkerMode={toggleMarkerMode}
        onToggleConnectMode={toggleConnectMode}
        onCreateRoute={createRouteFromConnectedMarkers}
        onCancelConnection={() => setConnectedMarkers([])}
        onClearRoute={clearRoute}
        onStartEditRoute={startEditRoute}
        onSaveEditedRoute={saveEditedRoute}
        onCancelEditRoute={cancelEditRoute}
        onDeleteRoute={deleteRoute}
        onClearAllRoutes={() => setMarkerRoutes([])}
      />

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          onClick={handleMapClick}
          options={{
            ...options,
            draggableCursor: isMarkerMode ? 'crosshair' : undefined,
            draggingCursor: 'grabbing',
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
        >
          {markers.map((marker) => (
            <div key={marker.id}>
              <Marker
                position={marker.position}
                onClick={() => handleMarkerClick(marker)}
                onLoad={(m) => onMarkerLoad(m, marker.id)}
                onMouseOver={() => setHoveredMarkerId(marker.id)}
                onMouseOut={() => setHoveredMarkerId(null)}
                icon={getIcon(marker)}
                zIndex={hoveredMarkerId === marker.id ? 1000 : 100}
              />

              <OverlayView
                position={marker.position}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  onDragOver={(e) => handleMarkerDragOver(e, marker.id)}
                  onDragLeave={handleMarkerDragLeave}
                  onDrop={(e) => handleMarkerDrop(e, marker.id)}
                  style={{
                    position: 'absolute',
                    transform: 'translate(-50%, -70%)',
                    width: '80px',
                    height: '80px',
                    cursor: 'grab',
                    backgroundColor:
                      dragOverMarkerId === marker.id
                        ? 'rgba(66, 165, 245, 0.2)'
                        : 'transparent',
                    border:
                      dragOverMarkerId === marker.id
                        ? '3px solid #2196F3'
                        : 'none',
                    borderRadius: '50%',
                    transition: 'all 0.2s',
                    animation:
                      dragOverMarkerId === marker.id
                        ? 'pulse 1s infinite'
                        : 'none',
                    pointerEvents: isDraggingVideo ? 'auto' : 'none',
                    zIndex: 10000,
                  }}
                />
              </OverlayView>
            </div>
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={handleInfoWindowClose}
            >
              <div
                style={{
                  padding: '15px',
                  minWidth: '280px',
                  maxWidth: '400px',
                }}
              >
                {isEditMode ? (
                  <>
                    <div
                      style={{
                        marginBottom: '8px',
                        padding: '6px 10px',
                        backgroundColor: '#fef3c7',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#92400e',
                        fontWeight: '500',
                      }}
                    >
                      ✏️ 편집 모드
                    </div>
                    <input
                      type="text"
                      value={editingMarker?.title || ''}
                      onChange={(e) =>
                        setEditingMarker((prev) =>
                          prev ? { ...prev, title: e.target.value } : null
                        )
                      }
                      style={{
                        width: '100%',
                        marginBottom: '10px',
                        padding: '10px',
                        border: '2px solid #fbbf24',
                        backgroundColor: '#fffbeb',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        outline: 'none',
                      }}
                      placeholder="제목을 입력하세요"
                    />
                    <textarea
                      value={editingMarker?.description || ''}
                      onChange={(e) =>
                        setEditingMarker((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                      rows={3}
                      style={{
                        width: '100%',
                        marginBottom: '10px',
                        padding: '10px',
                        border: '2px solid #fbbf24',
                        backgroundColor: '#fffbeb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        outline: 'none',
                        resize: 'none',
                      }}
                      placeholder="설명을 입력하세요"
                    />
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '10px',
                      }}
                    >
                      <button
                        onClick={saveMarkerEdits}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                      >
                        ✅ 저장
                      </button>
                      <button
                        onClick={cancelMarkerEdits}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                      >
                        ❌ 취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#333',
                        }}
                      >
                        {selectedMarker.title}
                      </h3>
                      <button
                        onClick={() => {
                          setIsEditMode(true);
                          setEditingMarker({ ...selectedMarker });
                        }}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        ✏️ 편집
                      </button>
                    </div>
                    <div
                      style={{
                        marginBottom: '10px',
                        padding: '8px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#4b5563',
                        lineHeight: '1.5',
                      }}
                    >
                      {selectedMarker.description}
                    </div>
                  </>
                )}

                {selectedMarker.address && (
                  <div
                    style={{
                      padding: '8px',
                      backgroundColor: '#e3f2fd',
                      borderRadius: '4px',
                      marginBottom: '10px',
                      fontSize: '12px',
                      color: '#1976d2',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      📍 주소
                    </div>
                    <div>{selectedMarker.address}</div>
                  </div>
                )}

                {selectedMarker.videos.length > 0 && (
                  <div
                    style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      padding: '10px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '5px',
                    }}
                  >
                    <h4
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '13px',
                        color: '#333',
                      }}
                    >
                      📹 연결된 비디오 ({selectedMarker.videos.length})
                    </h4>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {selectedMarker.videos.map((video) => (
                        <div
                          key={video.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px',
                            padding: '5px',
                            backgroundColor: 'white',
                            borderRadius: '3px',
                            border: '1px solid #ddd',
                          }}
                        >
                          {video.thumbnail && (
                            <img
                              src={video.thumbnail}
                              alt={video.name}
                              style={{
                                width: '40px',
                                height: '30px',
                                objectFit: 'cover',
                                borderRadius: '2px',
                                marginRight: '8px',
                              }}
                            />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: '11px',
                                fontWeight: '500',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {video.name}
                            </div>
                            <div style={{ fontSize: '10px', color: '#666' }}>
                              {formatDuration(video.duration)} •{' '}
                              {formatFileSize(video.size)}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              removeVideoFromMarker(selectedMarker.id, video.id)
                            }
                            style={{
                              padding: '2px 6px',
                              backgroundColor: '#ff6b6b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '2px',
                              cursor: 'pointer',
                              fontSize: '10px',
                              marginLeft: '5px',
                            }}
                          >
                            제거
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isEditMode && (
                  <>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#666',
                        marginBottom: '5px',
                      }}
                    >
                      {selectedMarker.timestamp?.toLocaleString()}
                    </div>
                    <button
                      onClick={() => deleteMarker(selectedMarker.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      마커 삭제
                    </button>
                  </>
                )}
              </div>
            </InfoWindow>
          )}

          {routePoints.length > 1 && (
            <Polyline
              path={routePoints}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 3,
              }}
            />
          )}

          {/* 연결 중인 마커들의 임시 경로 표시 */}
          {isConnectMode && connectedMarkers.length > 1 && (
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

          {isDrawingMode && (
            <DrawingManager
              drawingMode={google.maps.drawing.OverlayType.POLYGON}
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [
                    google.maps.drawing.OverlayType.POLYGON,
                    google.maps.drawing.OverlayType.POLYLINE,
                    google.maps.drawing.OverlayType.RECTANGLE,
                    google.maps.drawing.OverlayType.CIRCLE,
                  ],
                },
                polygonOptions: {
                  fillColor: '#ffff00',
                  fillOpacity: 0.3,
                  strokeWeight: 2,
                  clickable: true,
                  editable: true,
                  zIndex: 1,
                },
                polylineOptions: {
                  strokeColor: '#00ff00',
                  strokeWeight: 3,
                  clickable: true,
                  editable: true,
                },
                rectangleOptions: {
                  fillColor: '#00ffff',
                  fillOpacity: 0.3,
                  strokeWeight: 2,
                  clickable: true,
                  editable: true,
                },
                circleOptions: {
                  fillColor: '#ff00ff',
                  fillOpacity: 0.3,
                  strokeWeight: 2,
                  clickable: true,
                  editable: true,
                },
              }}
              onPolygonComplete={onPolygonComplete}
              onPolylineComplete={onPolylineComplete}
              onRectangleComplete={onRectangleComplete}
              onCircleComplete={onCircleComplete}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
