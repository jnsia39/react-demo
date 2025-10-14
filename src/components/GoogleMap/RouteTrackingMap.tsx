import React, { useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  OverlayView,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import MapControls from './components/MapControls';
import { MarkerData } from './types';
import { createMarkerIcon } from './utils/markerIconHelper';
import MarkerDetails from './components/MarkerDetails';
import useMarkers from './hooks/useMarkers';
import { extractVideoMetadata } from '@shared/utils/video';
import useRoutes from './hooks/useRoutes';
import useMarkerDragDrop from './hooks/useMarkerDragDrop';
import useMarkerHover from './hooks/useMarkerHover';
import RouteList from './components/RouteList';
import RoutePolylines from './components/RoutePolylines';
import * as overlayStyles from './styles/MarkerOverlay.css';
import clsx from 'clsx';

const center = {
  lat: 37.402,
  lng: 127.108,
};

interface RouteTrackingMapProps {
  isDraggingVideo?: boolean;
}

export default function RouteTrackingMap({
  isDraggingVideo = false,
}: RouteTrackingMapProps) {
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const {
    markers,
    selectedMarker,
    createMarker,
    selectMarker,
    deleteMarker,
    addVideoToMarker,
    removeVideoFromMarker,
  } = useMarkers();

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

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (selectedMarker) {
      selectMarker(null);
      return;
    }

    if (e.latLng && !isTrackingMode) {
      const position = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      createMarker(position);
    }
  };

  const handleMarkerClick = (marker: MarkerData) => {
    if (isTrackingMode) {
      toggleMarkerWhileTracking(marker.id);
    } else {
      selectMarker(marker);
    }
  };

  const handleInfoWindowClose = () => {
    selectMarker(null);
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

  const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry?.location && map) {
          map.panTo(place.geometry.location);
          map.setZoom(17);
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <MapControls
          isTrackingMode={isTrackingMode}
          connectedMarkersCount={connectedMarkers.length}
          onToggleTrackingMode={toggleTrackingMode}
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

      <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '100%',
          }}
          center={center}
          zoom={17}
          onClick={handleMapClick}
          onLoad={(map) => setMap(map)}
          options={{
            zoomControl: true,
            clickableIcons: false,
            draggableCursor: isTrackingMode ? 'default' : 'crosshair',
            draggingCursor: 'grabbing',
          }}
        >
          <StandaloneSearchBox
            onLoad={onSearchBoxLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="장소 검색..."
              style={{
                boxSizing: 'border-box',
                border: '1px solid transparent',
                width: '300px',
                height: '40px',
                padding: '0 12px',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                fontSize: '14px',
                outline: 'none',
                textOverflow: 'ellipsis',
                position: 'absolute',
                right: '60px',
                top: '10px',
              }}
            />
          </StandaloneSearchBox>
          {markers.map((marker) => (
            <div key={marker.id}>
              <Marker
                position={marker.position}
                onClick={() => handleMarkerClick(marker)}
                onMouseOver={() => onHandleMarkerMouseOver(marker.id)}
                onMouseOut={onHandleMarkerMouseLeave}
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
              onCloseClick={handleInfoWindowClose}
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
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
