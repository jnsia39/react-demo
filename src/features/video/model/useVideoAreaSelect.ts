import { useEffect, useRef, useState } from 'react';

export function useVideoAreaSelect({
  editMode,
  selectedArea,
  setSelectedArea,
}: {
  video: HTMLVideoElement | null;
  editMode: boolean;
  selectedArea: any;
  setSelectedArea: (r: any) => void;
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
  const [resizeDir, setResizeDir] = useState<null | 'nw' | 'ne' | 'sw' | 'se'>(
    null
  );

  const pxToPercent = (x: number, y: number) => {
    if (!overlayRef.current) return { x: 0, y: 0 };
    return {
      x: (x / overlayRef.current.clientWidth) * 100,
      y: (y / overlayRef.current.clientHeight) * 100,
    };
  };

  const percentToPx = (x: number, y: number) => {
    if (!overlayRef.current) return { x: 0, y: 0 };
    return {
      x: (x / 100) * overlayRef.current.clientWidth,
      y: (y / 100) * overlayRef.current.clientHeight,
    };
  };

  const getRelativePos = (e: React.MouseEvent) => {
    if (!overlayRef.current) return { x: 0, y: 0 };
    const rect = overlayRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleResizeMouseDown = (
    dir: 'nw' | 'ne' | 'sw' | 'se',
    e: React.MouseEvent
  ) => {
    if (!editMode) return;
    e.stopPropagation();
    setResizeDir(dir);
    setIsDrawing(false);
    setIsMoving(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!editMode) return;

    const posPx = getRelativePos(e);
    const pos = pxToPercent(posPx.x, posPx.y);

    if (resizeDir && selectedArea) {
      let { x, y, w, h } = selectedArea;
      const minSize = 2;
      if (resizeDir === 'nw') {
        const nx = Math.min(x + w - minSize, pos.x);
        const ny = Math.min(y + h - minSize, pos.y);
        w = w + (x - nx);
        h = h + (y - ny);
        x = nx;
        y = ny;
      } else if (resizeDir === 'ne') {
        const nx = Math.max(x + minSize, pos.x);
        const ny = Math.min(y + h - minSize, pos.y);
        w = nx - x;
        h = h + (y - ny);
        y = ny;
      } else if (resizeDir === 'sw') {
        const nx = Math.min(x + w - minSize, pos.x);
        const ny = Math.max(y + minSize, pos.y);
        w = w + (x - nx);
        h = ny - y;
        x = nx;
      } else if (resizeDir === 'se') {
        const nx = Math.max(x + minSize, pos.x);
        const ny = Math.max(y + minSize, pos.y);
        w = nx - x;
        h = ny - y;
      }

      setSelectedArea({ x, y, w, h });
      return;
    }

    if (isMoving && selectedArea) {
      setSelectedArea({
        x: pos.x - moveOffset.x,
        y: pos.y - moveOffset.y,
        w: selectedArea.w,
        h: selectedArea.h,
      });
      return;
    }
    if (!isDrawing) return;
    setCurrentPos(pos);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editMode) return;

    const posPx = getRelativePos(e);
    const pos = pxToPercent(posPx.x, posPx.y);

    if (
      selectedArea &&
      pos.x >= selectedArea.x &&
      pos.x <= selectedArea.x + selectedArea.w &&
      pos.y >= selectedArea.y &&
      pos.y <= selectedArea.y + selectedArea.h
    ) {
      setIsMoving(true);
      setMoveOffset({ x: pos.x - selectedArea.x, y: pos.y - selectedArea.y });
      return;
    }
    setStartPos(pos);
    setCurrentPos(pos);
    setIsDrawing(true);
    setSelectedArea(null);
  };

  const dragRect = isDrawing
    ? {
        x: Math.min(startPos.x, currentPos.x),
        y: Math.min(startPos.y, currentPos.y),
        w: Math.abs(currentPos.x - startPos.x),
        h: Math.abs(currentPos.y - startPos.y),
      }
    : null;
  const rect = dragRect || selectedArea;

  const renderRect =
    rect && editMode
      ? (() => {
          const { x, y } = percentToPx(rect.x, rect.y);
          const { x: w, y: h } = percentToPx(rect.w, rect.h);
          return { x, y, w, h };
        })()
      : null;

  const handleMouseUp = () => {
    if (!editMode) return; // editMode가 true일 때만 마무리 가능
    setIsDrawing(false);
    setIsMoving(false);
    setResizeDir(null);
    if (isDrawing && rect) {
      const x = Math.min(startPos.x, currentPos.x);
      const y = Math.min(startPos.y, currentPos.y);
      const w = Math.abs(currentPos.x - startPos.x);
      const h = Math.abs(currentPos.y - startPos.y);

      setSelectedArea({ x, y, w, h });
    }
  };

  const stopSelecting = () => {
    setIsDrawing(false);
    setIsMoving(false);
    setResizeDir(null);
  };

  useEffect(() => {
    if (!editMode) {
      stopSelecting();
    }
  }, [editMode]);

  return {
    overlayRef,
    selectedArea,
    resizeDir,
    stopSelecting,
    handleMouseDown,
    handleResizeMouseDown,
    handleMouseMove,
    handleMouseUp,
    renderRect,
  };
}
