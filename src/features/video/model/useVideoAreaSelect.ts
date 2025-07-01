import { useEffect, useRef, useState } from 'react';

export function useVideoAreaSelect({
  videoRef,
  editMode,
  finalRect,
  setFinalRect,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  editMode: boolean;
  finalRect: any;
  setFinalRect: (r: any) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    x: 0,
    y: 0,
    width: 640,
    height: 360,
  });

  useEffect(() => {
    const updateSize = () => {
      if (videoRef.current && containerRef.current) {
        const rect = videoRef.current.getBoundingClientRect();
        setContainerSize({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [videoRef, editMode]);

  // editMode가 false로 바뀌면 사각형 상태 초기화
  useEffect(() => {
    if (!editMode) {
      setIsDrawing(false);
      setIsMoving(false);
      setResizeDir(null);
    }
  }, [editMode]);

  // rect & crop
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
  const [resizeDir, setResizeDir] = useState<null | 'nw' | 'ne' | 'sw' | 'se'>(
    null
  );

  const pxToPercent = (x: number, y: number) => ({
    x: (x / containerSize.width) * 100,
    y: (y / containerSize.height) * 100,
  });

  const percentToPx = (x: number, y: number) => ({
    x: (x / 100) * containerSize.width,
    y: (y / 100) * containerSize.height,
  });

  const getRelativePos = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleResizeMouseDown = (
    dir: 'nw' | 'ne' | 'sw' | 'se',
    e: React.MouseEvent
  ) => {
    if (!editMode) return; // editMode가 true일 때만 리사이즈 가능
    e.stopPropagation();
    setResizeDir(dir);
    setIsDrawing(false);
    setIsMoving(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!editMode) return;

    const posPx = getRelativePos(e);
    const pos = pxToPercent(posPx.x, posPx.y);

    if (resizeDir && finalRect) {
      let { x, y, w, h } = finalRect;
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

      setFinalRect({ x, y, w, h });
      return;
    }

    if (isMoving && finalRect) {
      setFinalRect({
        x: pos.x - moveOffset.x,
        y: pos.y - moveOffset.y,
        w: finalRect.w,
        h: finalRect.h,
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
      finalRect &&
      pos.x >= finalRect.x &&
      pos.x <= finalRect.x + finalRect.w &&
      pos.y >= finalRect.y &&
      pos.y <= finalRect.y + finalRect.h
    ) {
      setIsMoving(true);
      setMoveOffset({ x: pos.x - finalRect.x, y: pos.y - finalRect.y });
      return;
    }
    setStartPos(pos);
    setCurrentPos(pos);
    setIsDrawing(true);
    setFinalRect(null);
  };

  const dragRect = isDrawing
    ? {
        x: Math.min(startPos.x, currentPos.x),
        y: Math.min(startPos.y, currentPos.y),
        w: Math.abs(currentPos.x - startPos.x),
        h: Math.abs(currentPos.y - startPos.y),
      }
    : null;
  const rect = dragRect || finalRect;
  const renderRect = rect
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

      setFinalRect({ x, y, w, h });
    }
  };

  return {
    containerRef,
    videoRef,
    finalRect,
    resizeDir,
    containerSize,
    handleMouseDown,
    handleResizeMouseDown,
    handleMouseMove,
    handleMouseUp,
    renderRect,
  };
}
