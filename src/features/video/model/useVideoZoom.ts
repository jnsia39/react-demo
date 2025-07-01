import React, { useEffect, useState } from 'react';

export default function useVideoZoom({ editMode }: { editMode: boolean }) {
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const clampPan = (offset: { x: number; y: number }, zoom: number) => {
    const baseW = 640,
      baseH = 360;
    const scaledW = baseW * zoom,
      scaledH = baseH * zoom;
    const maxX = Math.max(0, (scaledW - baseW) / 2);
    const maxY = Math.max(0, (scaledH - baseH) / 2);

    return {
      x: Math.max(-maxX, Math.min(maxX, offset.x)),
      y: Math.max(-maxY, Math.min(maxY, offset.y)),
    };
  };

  const handlePanMouseDown = (e: React.MouseEvent) => {
    if (zoom === 1 || editMode) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
    document.body.style.cursor = 'grab';
  };

  const handlePanMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isPanning || editMode) return;
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    setPanOffset((prev) => clampPan({ x: prev.x + dx, y: prev.y + dy }, zoom));
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handlePanMouseUp = () => {
    setIsPanning(false);
    document.body.style.cursor = '';
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => {
      let next = +(z + (e.deltaY < 0 ? 0.1 : -0.1)).toFixed(2);
      next = Math.max(1, Math.min(3, next));
      return next;
    });
  };

  useEffect(() => {
    if (!isPanning || editMode) return;

    const move = (e: MouseEvent) => handlePanMouseMove(e as any);
    const up = () => handlePanMouseUp();

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [isPanning, panStart, editMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === ']') setZoom((z) => Math.min(10, +(z + 0.1).toFixed(2)));
      if (e.key === '[') setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)));
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setPanOffset((prev) => clampPan(prev, zoom));
  }, [zoom]);

  return {
    zoom,
    setZoom,
    isPanning,
    handlePanMouseDown,
    handleWheel,
    panOffset,
    setPanOffset,
  };
}
