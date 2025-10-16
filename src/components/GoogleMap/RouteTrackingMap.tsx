import React, { useState, useRef, useCallback } from 'react';
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  OverlayView,
  StandaloneSearchBox,
  Polyline,
  Libraries,
  Marker,
} from '@react-google-maps/api';
import MapControls from './components/MapControls';
import HelpPanel from './components/HelpPanel';
import { MarkerData } from './types';
import { createMarkerIcon } from './utils/markerIconHelper';
import MarkerDetails from './components/MarkerDetails';
import useMarkers from './hooks/useMarkers';
import { extractVideoMetadata } from '@shared/utils/video';
import useRoutes from './hooks/useRoutes';
import useMarkerDragDrop from './hooks/useMarkerDragDrop';
import useMarkerHover from './hooks/useMarkerHover';
import useUserLocation from './hooks/useUserLocation';
import RouteList from './components/RouteList';
import RoutePolylines from './components/RoutePolylines';
import * as overlayStyles from './styles/MarkerOverlay.css';
import * as styles from './styles/RouteTrackingMap.css';
import clsx from 'clsx';
import useDrawLines from './hooks/useDrawLines';
import { convertPixelToLatLng } from './utils/coordinateConverter';

const center = {
  lat: 37.402,
  lng: 127.108,
};

interface RouteTrackingMapProps {
  isDraggingVideo?: boolean;
}

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const libraries: Libraries = ['places'];

export default function RouteTrackingMap({
  isDraggingVideo = false,
}: RouteTrackingMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [previewMarkerPosition, setPreviewMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  const {
    markers,
    selectedMarker,
    createMarker,
    selectMarker,
    deleteMarker,
    addVideoToMarker,
    removeVideoFromMarker,
  } = useMarkers();

  const { userLocation } = useUserLocation();

  const { hoveredMarkerId, onHandleMarkerMouseOver, onHandleMarkerMouseLeave } =
    useMarkerHover();

  const {
    isTrackingMode,
    editingRouteIndex,
    editingRoute,
    startEditRoute,
    saveEditedRoute,
    cancelEditRoute,
    connectedMarkers,
    markerRoutes,
    toggleTrackingMode,
    createRoute,
    deleteRoute,
    deleteMarkerFromRoutes,
    toggleMarkerWhileTracking,
    cancelConnection,
  } = useRoutes();

  const {
    dragOverMarkerId,
    onMarkerDragOver,
    onMarkerDragLeave,
    onMarkerDrop,
  } = useMarkerDragDrop();

  const {
    isDrawingMode,
    currentDrawing,
    drawnLines,
    toggleDrawingMode,
    onDrawMouseDown,
    onDrawMouseMove,
    onDrawMouseUp,
    onDrawRightClick,
  } = useDrawLines();

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (selectedMarker) {
      selectMarker(null);
      return;
    }

    if (e.latLng && !isTrackingMode && !isDrawingMode) {
      createMarker({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  };

  const handleMarkerClick = (marker: MarkerData) => {
    if (isTrackingMode) {
      toggleMarkerWhileTracking(marker.id);
    } else {
      if (selectedMarker?.id === marker.id) {
        selectMarker(null);
      } else {
        selectMarker(marker);
      }
    }
  };

  const handleDropVideo = (e: React.DragEvent, markerId: string) => {
    const videoMetadata = extractVideoMetadata(e.dataTransfer);
    if (videoMetadata) {
      addVideoToMarker(markerId, videoMetadata);
    }
  };

  const getIcon = (marker: MarkerData) => {
    return createMarkerIcon(
      marker,
      hoveredMarkerId,
      connectedMarkers,
      editingRoute
    );
  };

  const handleDeleteMarker = (id: string) => {
    deleteMarker(id);
    deleteMarkerFromRoutes(id);
  };

  const handleMapDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      const videoMetadata = extractVideoMetadata(e.dataTransfer);
      if (!videoMetadata || !mapRef.current) return;

      const position = convertPixelToLatLng(
        mapRef.current,
        e.clientX,
        e.clientY
      );
      if (!position) return;

      createMarker(position, videoMetadata);

      setPreviewMarkerPosition(null);
    },
    [createMarker]
  );

  const handleMapDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      if (!isDraggingVideo || !mapRef.current) return;

      // 픽셀 좌표를 위경도로 변환
      const position = convertPixelToLatLng(
        mapRef.current,
        e.clientX,
        e.clientY
      );
      if (!position) return;

      setPreviewMarkerPosition(position);
    },
    [isDraggingVideo]
  );

  const handleMapDragLeave = () => {
    setPreviewMarkerPosition(null);
  };

  return (
    <div
      className={styles.container}
      onDrop={handleMapDrop}
      onDragOver={handleMapDragOver}
      onDragLeave={handleMapDragLeave}
    >
      <div className={styles.controlsContainer}>
        <MapControls
          isTrackingMode={isTrackingMode}
          isDrawingMode={isDrawingMode}
          connectedMarkersCount={connectedMarkers.length}
          onToggleTrackingMode={toggleTrackingMode}
          onToggleDrawingMode={toggleDrawingMode}
          onCreateRoute={createRoute}
          onCancelConnection={cancelConnection}
        />
        <RouteList
          markerRoutes={markerRoutes}
          editingRouteIndex={editingRouteIndex}
          onStartEditRoute={startEditRoute}
          onSaveEditedRoute={saveEditedRoute}
          onCancelEditRoute={cancelEditRoute}
          onDeleteRoute={deleteRoute}
        />
      </div>

      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <GoogleMap
          mapContainerClassName={styles.mapContainer}
          center={userLocation || center}
          zoom={17}
          onClick={handleMapClick}
          onRightClick={onDrawRightClick}
          onMouseDown={onDrawMouseDown}
          onMouseMove={onDrawMouseMove}
          onMouseUp={onDrawMouseUp}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          options={{
            zoomControl: true,
            clickableIcons: false,
            draggableCursor: isDrawingMode
              ? 'crosshair'
              : isTrackingMode
              ? 'default'
              : 'crosshair',
            draggingCursor: 'grabbing',
            gestureHandling: isDrawingMode ? 'none' : 'greedy',
          }}
        >
          <StandaloneSearchBox>
            <input
              type="text"
              placeholder="장소 검색..."
              className={styles.searchBox}
            />
          </StandaloneSearchBox>

          {previewMarkerPosition && isDraggingVideo && (
            <Marker
              position={previewMarkerPosition}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4285F4',
                strokeColor: '#4285F4',
                strokeWeight: 2,
              }}
              zIndex={9999}
            />
          )}

          {markers.map((marker) => (
            <div key={marker.id}>
              <Marker
                position={marker.position}
                onClick={() => handleMarkerClick(marker)}
                onMouseOver={() => onHandleMarkerMouseOver(marker.id)}
                onMouseOut={onHandleMarkerMouseLeave}
                onRightClick={() => handleDeleteMarker(marker.id)}
                zIndex={hoveredMarkerId === marker.id ? 1000 : 100}
                icon={getIcon(marker)}
              />

              {/* 드래그 앤 드롭 영역 */}
              <OverlayView
                position={marker.position}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  onDragOver={(e) => onMarkerDragOver(e, marker.id)}
                  onDragLeave={onMarkerDragLeave}
                  onDrop={(e) =>
                    onMarkerDrop(e, () => handleDropVideo(e, marker.id))
                  }
                  className={clsx(
                    overlayStyles.overlayBase,
                    dragOverMarkerId === marker.id
                      ? overlayStyles.dragOver
                      : overlayStyles.normal
                  )}
                  style={{
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
              onCloseClick={() => selectMarker(null)}
              options={{
                pixelOffset: new google.maps.Size(0, -50),
                headerDisabled: true,
              }}
            >
              <MarkerDetails
                marker={selectedMarker}
                deleteMarker={handleDeleteMarker}
                removeVideoFromMarker={removeVideoFromMarker}
              />
            </InfoWindow>
          )}

          <RoutePolylines
            markers={markers}
            markerRoutes={markerRoutes}
            editingRouteIndex={editingRouteIndex}
            editingRoute={editingRoute}
            connectedMarkers={connectedMarkers}
            isTrackingMode={isTrackingMode}
          />

          {drawnLines.map((line) => (
            <Polyline
              key={line.id}
              path={line.path}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                clickable: false,
              }}
            />
          ))}

          {currentDrawing.length > 0 && (
            <Polyline
              path={currentDrawing}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 0.6,
                strokeWeight: 3,
                clickable: false,
              }}
            />
          )}
        </GoogleMap>

        {/* 도움말 패널 */}
        <HelpPanel />
      </LoadScript>
    </div>
  );
}
