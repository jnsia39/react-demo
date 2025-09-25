import { useCallback, useState, useRef } from 'react';
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
import { MarkerData, VideoInfo } from './types';
import { createMarkerIcon } from './utils/markerIconHelper';

const libraries: ('places' | 'geometry')[] = ['places', 'geometry'];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 37.402,
  lng: 127.108,
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
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [dragOverMarkerId, setDragOverMarkerId] = useState<string | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const markerRefs = useRef<{ [key: string]: google.maps.Marker }>({});

  // 마커 연결 모드 관련 상태
  const [isConnectMode, setIsConnectMode] = useState(false);
  const [connectedMarkers, setConnectedMarkers] = useState<string[]>([]);
  const [markerRoutes, setMarkerRoutes] = useState<string[][]>([]);

  // 경로 편집 모드 상태
  const [editingRouteIndex, setEditingRouteIndex] = useState<number | null>(
    null
  );
  const [editingRoute, setEditingRoute] = useState<string[]>([]);

  // 메모 편집 상태
  const [editingMemo, setEditingMemo] = useState<string>('');
  const [isEditingMemo, setIsEditingMemo] = useState(false);

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

      // 마커 모드일 때만 새 마커 생성 (연결 모드가 아닐 때)
      if (e.latLng && !isDrawingMode && !isConnectMode) {
        const position = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
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
    [markers, isDrawingMode, selectedMarker, isConnectMode]
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
      setEditingMemo(marker.memo || '');
      setIsEditingMemo(false);
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
    setIsEditingMemo(false);
  };

  const saveMemo = () => {
    if (selectedMarker) {
      setMarkers((prev) =>
        prev.map((marker) =>
          marker.id === selectedMarker.id
            ? { ...marker, memo: editingMemo }
            : marker
        )
      );
      setSelectedMarker((prev) =>
        prev ? { ...prev, memo: editingMemo } : prev
      );
      setIsEditingMemo(false);
    }
  };

  const cancelMemoEdit = () => {
    if (selectedMarker) {
      setEditingMemo(selectedMarker.memo || '');
      setIsEditingMemo(false);
    }
  };

  const startMemoEdit = () => {
    setIsEditingMemo(true);
  };

  const updateMarkerMemo = (id: string, memo: string) => {
    setMarkers((prev) =>
      prev.map((marker) => (marker.id === id ? { ...marker, memo } : marker))
    );
    setSelectedMarker((prev) =>
      prev && prev.id === id ? { ...prev, memo } : prev
    );
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

  const toggleConnectMode = () => {
    if (isDrawingMode) setIsDrawingMode(false);
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
        isConnectMode={isConnectMode}
        connectedMarkersCount={connectedMarkers.length}
        editingRouteIndex={editingRouteIndex}
        markerRoutesCount={markerRoutes.length}
        markerRoutes={markerRoutes}
        onToggleConnectMode={toggleConnectMode}
        onCreateRoute={createRouteFromConnectedMarkers}
        onCancelConnection={() => setConnectedMarkers([])}
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
          zoom={17}
          onClick={handleMapClick}
          options={{
            ...options,
            draggableCursor: 'crosshair',
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
              options={{
                headerDisabled: true,
              }}
            >
              <div
                style={{
                  minWidth: '280px',
                  maxWidth: '400px',
                }}
              >
                <div
                  style={{
                    marginBottom: '10px',
                    padding: '8px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px',
                  }}
                >
                  {selectedMarker.description}
                </div>

                {/* 메모 입력 필드 */}
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#fffbeb',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    border: '2px solid #fbbf24',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '6px',
                      color: '#374151',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>📝 메모</span>
                    {!isEditingMemo && (
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>
                        (클릭하여 편집)
                      </span>
                    )}
                  </div>
                  {isEditingMemo ? (
                    <>
                      <textarea
                        value={editingMemo}
                        onChange={(e) => setEditingMemo(e.target.value)}
                        placeholder="메모를 입력하세요..."
                        style={{
                          width: '100%',
                          minHeight: '80px',
                          padding: '8px',
                          border: '2px solid #3b82f6',
                          borderRadius: '4px',
                          fontSize: '14px',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          outline: 'none',
                        }}
                        autoFocus
                      />
                      <div
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        <button
                          onClick={saveMemo}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          저장
                        </button>
                        <button
                          onClick={cancelMemoEdit}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          취소
                        </button>
                      </div>
                    </>
                  ) : (
                    <div
                      onClick={() => startMemoEdit()}
                      style={{
                        minHeight: '40px',
                        padding: '8px',
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '14px',
                        color: selectedMarker.memo ? '#111827' : '#9ca3af',
                        cursor: 'pointer',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                      title="클릭하여 편집"
                    >
                      {selectedMarker.memo || '클릭하여 메모를 추가하세요...'}
                    </div>
                  )}
                </div>

                {selectedMarker.address && (
                  <div
                    style={{
                      padding: '8px',
                      backgroundColor: '#e3f2fd',
                      borderRadius: '4px',
                      marginBottom: '10px',
                      color: '#1976d2',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      주소
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
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {video.name}
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
              </div>
            </InfoWindow>
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
