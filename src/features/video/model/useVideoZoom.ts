import { useVideoStore } from '@pages/playback/store/videoStore';
import { useCallback, useEffect } from 'react';

interface useVideoZoomProps {
  editMode: boolean;
  videoRect: { width: number; height: number };
  overlaySize: { width: number; height: number; top?: number; left?: number };
}

export function useVideoZoom({
  editMode,
  videoRect,
  overlaySize,
}: useVideoZoomProps) {
  const { zoom, panOffset, setPanOffset } = useVideoStore();

  // clamp 함수: 확대 비율에 따라 panOffset 제한
  const clampPan = useCallback(
    (offset: { x: number; y: number }) => {
      const { width, height } = videoRect;
      const [scaledW, scaledH] = [width * zoom, height * zoom];

      const maxX = Math.max(0, (scaledW - width) / 2);
      const maxY = Math.max(0, (scaledH - height) / 2);

      return {
        x: Math.max(-maxX, Math.min(maxX, offset.x)),
        y: Math.max(-maxY, Math.min(maxY, offset.y)),
      };
    },
    [zoom, videoRect]
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
  }, [editMode, zoom, panOffset]);

  useEffect(() => {
    const { width, height } = overlaySize;
    const maxX = Math.max(0, (width * zoom - width) / 2);
    const maxY = Math.max(0, (height * zoom - height) / 2);

    if (panOffset) {
      const clamped = {
        x: Math.max(-maxX, Math.min(maxX, panOffset.x)),
        y: Math.max(-maxY, Math.min(maxY, panOffset.y)),
      };

      if (clamped.x !== panOffset.x || clamped.y !== panOffset.y) {
        setPanOffset(clamped);
      }
    }
  }, [zoom, panOffset, overlaySize]);

  return {
    getPanMouseDown,
  };
}
