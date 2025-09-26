import { useState } from 'react';

export default function useMarkerHover() {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

  const handleMarkerMouseOver = (markerId: string) => {
    setHoveredMarkerId(markerId);
  };

  const handleMarkerMouseLeave = () => {
    setHoveredMarkerId(null);
  };

  return {
    hoveredMarkerId,
    onHandleMarkerMouseOver: handleMarkerMouseOver,
    onHandleMarkerMouseLeave: handleMarkerMouseLeave,
  };
}
