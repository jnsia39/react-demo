import { useCallback } from 'react';

interface UseVideoPanProps {
  zoom: number;
  panOffset: { x: number; y: number };
  setPanOffset: (o: { x: number; y: number }) => void;
  editMode: boolean;
  containerSize: { width: number; height: number };
}

export function useVideoPan({
  zoom,
  panOffset,
  setPanOffset,
  editMode,
  containerSize,
}: UseVideoPanProps) {
  // clamp 함수: 확대 비율에 따라 panOffset 제한
  const clampPan = useCallback(
    (offset: { x: number; y: number }) => {
      const baseW = containerSize.width || 640,
        baseH = containerSize.height || 360;
      const scaledW = baseW * zoom,
        scaledH = baseH * zoom;
      const maxX = Math.max(0, (scaledW - baseW) / 2);
      const maxY = Math.max(0, (scaledH - baseH) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, offset.x)),
        y: Math.max(-maxY, Math.min(maxY, offset.y)),
      };
    },
    [zoom, containerSize]
  );

  // 패닝용 onMouseDown 핸들러 반환
  const getPanMouseDown = useCallback(() => {
    if (editMode || zoom <= 1) return undefined;
    return (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      const startX = e.clientX;
      const startY = e.clientY;
      const origin = { ...panOffset };
      const onMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        const next = { x: origin.x + dx, y: origin.y + dy };
        setPanOffset(clampPan(next));
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };
  }, [editMode, zoom, panOffset, setPanOffset, clampPan]);

  return {
    getPanMouseDown,
    clampPan,
  };
}
