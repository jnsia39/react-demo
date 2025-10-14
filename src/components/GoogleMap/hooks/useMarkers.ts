import { useState } from 'react';
import { MarkerData } from '../types';
import { VideoMetadata } from '@shared/types/video';

export default function useMarkers() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  const createMarker = (
    position: google.maps.LatLngLiteral,
    initialVideo?: VideoMetadata
  ) => {
    const newMarker: MarkerData = {
      id: Date.now().toString(),
      position,
      videos: initialVideo ? [initialVideo] : [],
    };

    setMarkers((prev) => [...prev, newMarker]);
    return newMarker.id;
  };

  const deleteMarker = (id: string) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id));
    setSelectedMarker(null);
  };

  const selectMarker = (marker: MarkerData | null) => {
    setSelectedMarker(marker);
  };

  const addVideoToMarker = (markerId: string, newVideo: VideoMetadata) => {
    setMarkers((prev) =>
      prev.map((marker) => {
        if (marker.id !== markerId) return marker;

        const hasVideo = marker.videos.some(
          (video) => video.id === newVideo.id
        );
        if (hasVideo) return marker;

        return { ...marker, videos: [...marker.videos, newVideo] };
      })
    );

    if (selectedMarker?.id === markerId) {
      const hasVideo = selectedMarker.videos.some((v) => v.id === newVideo.id);
      if (!hasVideo) {
        setSelectedMarker({
          ...selectedMarker,
          videos: [...selectedMarker.videos, newVideo],
        });
      }
    }
  };

  const removeVideoFromMarker = (markerId: string, videoId: string) => {
    setMarkers((prev) =>
      prev.map((marker) => {
        if (marker.id !== markerId) return marker;

        return {
          ...marker,
          videos: marker.videos.filter((video) => video.id !== videoId),
        };
      })
    );

    if (selectedMarker?.id === markerId) {
      setSelectedMarker({
        ...selectedMarker,
        videos: selectedMarker.videos.filter((video) => video.id !== videoId),
      });
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
