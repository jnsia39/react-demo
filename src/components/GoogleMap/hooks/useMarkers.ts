import { useState } from 'react';
import { MarkerData } from '../types';
import { VideoMetadata } from '@shared/types/video';

export default function useMarkers() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  const createMarker = (position: google.maps.LatLngLiteral) => {
    const newMarker: MarkerData = {
      id: Date.now().toString(),
      position,
      videos: [],
    };

    setMarkers((prev) => [...prev, newMarker]);
  };

  const deleteMarker = (id: string) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id));
    setSelectedMarker(null);
  };

  const selectMarker = (marker: MarkerData | null) => {
    setSelectedMarker(marker);
  };

  const addVideoToMarker = (markerId: string, newVideo: VideoMetadata) => {
    const targetMarker = markers.find((marker) => marker.id === markerId);
    if (!targetMarker) return;

    const existingVideo = targetMarker.videos.find(
      (video) => video.id === newVideo.id
    );
    if (!existingVideo) {
      targetMarker.videos.push(newVideo);
    }

    setMarkers((prev) => {
      return prev.map((marker) =>
        marker.id === markerId ? targetMarker : marker
      );
    });

    if (selectedMarker?.id === markerId) {
      setSelectedMarker(selectedMarker);
    }
  };

  const removeVideoFromMarker = (markerId: string, videoId: string) => {
    const targetMarker = markers.find((marker) => marker.id === markerId);
    if (!targetMarker) return;

    targetMarker.videos = targetMarker.videos.filter(
      (video) => video.id !== videoId
    );

    setMarkers((prev) => {
      return prev.map((marker) =>
        marker.id === markerId ? targetMarker : marker
      );
    });

    if (selectedMarker?.id === markerId) {
      setSelectedMarker(selectedMarker);
    }
  };

  return {
    markers,
    selectedMarker,
    createMarker,
    selectMarker,
    deleteMarker,
    removeVideoFromMarker,
    addVideoToMarker,
  };
}
