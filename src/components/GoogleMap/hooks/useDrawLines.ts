import { useEffect, useState } from 'react';

export default function useDrawLines() {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawnLines, setDrawnLines] = useState<
    Array<{ id: string; path: Array<{ lat: number; lng: number }> }>
  >([]);
  const [currentDrawing, setCurrentDrawing] = useState<
    Array<{ lat: number; lng: number }>
  >([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  const handleMouseDown = (e: google.maps.MapMouseEvent) => {
    if (isDrawingMode && e.latLng) {
      setIsDrawing(true);
      setCurrentDrawing([
        {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      ]);
    }
  };

  const handleMouseMove = (e: google.maps.MapMouseEvent) => {
    if (isDrawing && e.latLng) {
      setCurrentDrawing((prev) => [
        ...prev,
        {
          lat: e.latLng!.lat(),
          lng: e.latLng!.lng(),
        },
      ]);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentDrawing.length > 1) {
      setDrawnLines((prev) => [
        ...prev,
        {
          id: `line_${Date.now()}`,
          path: currentDrawing,
        },
      ]);
      setCurrentDrawing([]);
    }
    setIsDrawing(false);
  };

  const handleRightClick = (e: google.maps.MapMouseEvent) => {
    e.stop?.();
    setDrawnLines([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsDrawingMode(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsDrawingMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return {
    isDrawing,
    isDrawingMode,
    currentDrawing,
    drawnLines,
    toggleDrawingMode,
    onDrawMouseDown: handleMouseDown,
    onDrawMouseMove: handleMouseMove,
    onDrawMouseUp: handleMouseUp,
    onDrawRightClick: handleRightClick,
  };
}
