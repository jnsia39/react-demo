import React, { useState } from 'react';

export default function useMarkerDragDrop() {
  const [dragOverMarkerId, setDragOverMarkerId] = useState<string | null>(null);

  const handleMarkerDragOver = (e: React.DragEvent, markerId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setDragOverMarkerId(markerId);
  };

  const handleMarkerDragLeave = () => {
    setDragOverMarkerId(null);
  };

  const handleMarkerDrop = (e: React.DragEvent, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();

    setDragOverMarkerId(null);
    callback();
  };

  return {
    dragOverMarkerId,
    onMarkerDragOver: handleMarkerDragOver,
    onMarkerDragLeave: handleMarkerDragLeave,
    onMarkerDrop: handleMarkerDrop,
  };
}
