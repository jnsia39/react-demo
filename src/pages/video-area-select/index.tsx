import HlsVideoController from '@widgets/video-player/HlsVideoController';
import VideoPlayerController from '@widgets/video-player/VideoPlayerController';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PATH = `${BASE_URL}/stream.m3u8`;

export default function VideoAreaSelector() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  // 반응형: 사각형 상태를 % 단위로 저장
  const [finalRect, setFinalRect] = useState<{
    x: number; // %
    y: number; // %
    w: number; // %
    h: number; // %
  } | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });

  // 프레임별 선택 영역 저장
  const [rectsByFrame, setRectsByFrame] = useState<
    Record<number, { x: number; y: number; w: number; h: number }>
  >({});

  // 리사이즈 상태
  const [resizeDir, setResizeDir] = useState<null | 'nw' | 'ne' | 'sw' | 'se'>(
    null
  );

  // 리사이즈 핸들 크기
  const HANDLE_SIZE = 12;

  // 비디오 줌 상태
  const [zoom, setZoom] = useState(1);

  // 패닝 상태
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // 마우스 편집 모드 상태
  const [editMode, setEditMode] = useState(true); // 편집 모드 상태

  // 컨테이너 크기 측정
  const [containerSize, setContainerSize] = useState({
    width: 640,
    height: 360,
  });
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 좌표 변환: px → %
  const pxToPercent = (x: number, y: number) => ({
    x: (x / containerSize.width) * 100,
    y: (y / containerSize.height) * 100,
  });
  // 좌표 변환: % → px
  const percentToPx = (x: number, y: number) => ({
    x: (x * containerSize.width) / 100,
    y: (y * containerSize.height) / 100,
  });

  // 마우스 좌표를 컨테이너 기준으로 변환
  const getRelativePos = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // 편집 모드일 때만 동작하도록 수정
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editMode) return;
    const posPx = getRelativePos(e);
    const pos = pxToPercent(posPx.x, posPx.y);
    // 사각형 내부 클릭 시 이동 모드
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
    // 아니면 새로 그리기
    setStartPos(pos);
    setCurrentPos(pos);
    setIsDrawing(true);
    setFinalRect(null);
    setCroppedUrl(null);
  };

  // 리사이즈 핸들 클릭
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

  // 마우스 이동
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!editMode && !isPanning) return;
    const posPx = getRelativePos(e);
    const pos = pxToPercent(posPx.x, posPx.y);
    if (resizeDir && finalRect) {
      let { x, y, w, h } = finalRect;
      const minSize = 2; // %
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
      // 이동 중이면 사각형 위치 갱신
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

  // 마우스 업
  const handleMouseUp = () => {
    if (!editMode && !isPanning) return;
    setIsDrawing(false);
    setIsMoving(false);
    setResizeDir(null);
    if (isDrawing) {
      const x = Math.min(startPos.x, currentPos.x);
      const y = Math.min(startPos.y, currentPos.y);
      const w = Math.abs(currentPos.x - startPos.x);
      const h = Math.abs(currentPos.y - startPos.y);
      setFinalRect({ x, y, w, h });
    }
  };

  // 현재 드래그 중인 사각형
  const dragRect = isDrawing
    ? {
        x: Math.min(startPos.x, currentPos.x),
        y: Math.min(startPos.y, currentPos.y),
        w: Math.abs(currentPos.x - startPos.x),
        h: Math.abs(currentPos.y - startPos.y),
      }
    : null;

  // 표시할 사각형(드래그 중이면 dragRect, 아니면 마지막 finalRect)
  const rect = dragRect || finalRect;

  // 렌더링 시 px로 변환
  const renderRect = rect
    ? (() => {
        const { x, y } = percentToPx(rect.x, rect.y);
        const { x: w, y: h } = percentToPx(rect.w, rect.h);
        return { x, y, w, h };
      })()
    : null;

  // 비디오 프레임에서 선택 영역 추출: px 변환 후 기존대로
  const handleExtract = () => {
    if (!finalRect || !videoRef.current) return;
    const video = videoRef.current;
    const fps = 30;
    const frameNumber = Math.round(video.currentTime * fps);
    setRectsByFrame((prev) => ({ ...prev, [frameNumber]: { ...finalRect } }));
    const videoRect = video.getBoundingClientRect();
    const containerRect = containerRef.current!.getBoundingClientRect();
    const scaleX = video.videoWidth / videoRect.width;
    const scaleY = video.videoHeight / videoRect.height;
    // % → px 변환
    const { x, y } = percentToPx(finalRect.x, finalRect.y);
    const { x: w, y: h } = percentToPx(finalRect.w, finalRect.h);
    const sx = (x - (videoRect.left - containerRect.left)) * scaleX;
    const sy = (y - (videoRect.top - containerRect.top)) * scaleY;
    const sw = w * scaleX;
    const sh = h * scaleY;
    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);
    setCroppedUrl(canvas.toDataURL('image/png'));
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (Hls.isSupported() && videoElement) {
      const hls = new Hls({
        startLevel: 0,
        startPosition: -1,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
        lowLatencyMode: false, // VOD일 경우 false
        abrEwmaFastLive: 3.0,
        abrEwmaSlowLive: 9.0,
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.8,
      });
      hls.loadSource(PATH);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play();
      });
      videoElement.removeAttribute('controls');

      setIsLoaded(true);
    } else if (!playerRef.current && videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: false, // video.js 기본 컨트롤러 비활성화
        autoplay: 'play',
        preload: 'auto',
        playbackRates: [0.25, 0.5, 1, 1.25, 1.5, 2, 3, 4],
        sources: [
          {
            src: PATH,
            type: 'application/x-mpegURL',
          },
        ],
        vhs: {
          maxBufferLength: 600,
        },
      });
      setIsLoaded(true);
    }
  }, []);

  // 비디오 재생 중 프레임별로 선택 영역 자동 수집
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const fps = 30; // 필요시 실제 fps로 변경
    let lastFrame = -1;
    const onTimeUpdate = () => {
      if (!finalRect) return;
      const frameNumber = Math.round(video.currentTime * fps);
      if (frameNumber !== lastFrame) {
        console.log('Saving rect for frame:', frameNumber, finalRect);
        setRectsByFrame((prev) => {
          // 이미 저장된 프레임이면 덮어쓰기, 아니면 추가
          if (
            prev[frameNumber] &&
            prev[frameNumber].x === finalRect.x &&
            prev[frameNumber].y === finalRect.y &&
            prev[frameNumber].w === finalRect.w &&
            prev[frameNumber].h === finalRect.h
          ) {
            return prev;
          }
          return { ...prev, [frameNumber]: { ...finalRect } };
        });
        lastFrame = frameNumber;
      }
    };
    video.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [finalRect]);

  // 패닝 제한 함수
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

  // 패닝 핸들러 (수정: clamp 적용)
  const handlePanMouseDown = (e: React.MouseEvent) => {
    if (zoom === 1) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
    document.body.style.cursor = 'grab';
  };
  const handlePanMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    setPanOffset((prev) => clampPan({ x: prev.x + dx, y: prev.y + dy }, zoom));
    setPanStart({ x: e.clientX, y: e.clientY });
  };
  const handlePanMouseUp = () => {
    setIsPanning(false);
    document.body.style.cursor = '';
  };

  // 패닝 이벤트 연결
  useEffect(() => {
    if (!isPanning) return;
    const move = (e: MouseEvent) => handlePanMouseMove(e as any);
    const up = () => handlePanMouseUp();
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [isPanning, panStart]);

  // --- 추가 고급 기능 상태 ---
  // 휠로 줌 (수정: ctrl 없이 휠만으로 동작)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => {
      let next = +(z + (e.deltaY < 0 ? 0.1 : -0.1)).toFixed(2);
      next = Math.max(1, Math.min(3, next));
      return next;
    });
  };
  // 더블클릭으로 줌 리셋
  const handleDoubleClick = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };
  // 키보드 단축키: +, -로 줌, 0으로 리셋
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === '+') setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)));
      if (e.key === '-') setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)));
      if (e.key === '0') {
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  // 줌/패닝이 바뀔 때마다 panOffset clamp
  useEffect(() => {
    setPanOffset((prev) => clampPan(prev, zoom));
  }, [zoom]);
  // --- 고급 기능 끝 ---

  return (
    <div className="flex items-center justify-center min-h-screen w-full gap-4">
      <div className="bg-black w-full max-w-5xl">
        {/* max-w-3xl → max-w-5xl로 확대 */}
        {/* 편집 모드 토글 */}
        <div className="flex gap-2 items-center mb-2 justify-center">
          <button
            className={`px-3 py-1 rounded font-bold border transition-colors ${
              editMode
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-gray-200 text-gray-700 border-gray-300'
            }`}
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? '편집 모드: ON' : '편집 모드: OFF'}
          </button>
          {/* 기존 줌 컨트롤 */}
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)))}
            disabled={zoom <= 1}
          >
            -
          </button>
          <span className="text-white">Zoom: {zoom.toFixed(1)}x</span>
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
            disabled={zoom >= 3}
          >
            +
          </button>
        </div>
        <div
          ref={containerRef}
          className="relative select-none w-full aspect-video"
          onMouseDown={(e) => {
            if (zoom > 1 && !isDrawing && !isMoving && !resizeDir && !editMode)
              handlePanMouseDown(e);
            else handleMouseDown(e);
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
          style={{
            overflow: 'hidden',
            width: '100%',
            aspectRatio: '16/9',
            cursor: isPanning ? 'grab' : undefined,
            background: '#111',
            maxWidth: 1280, // 기존 960 → 1280px로 확대
            minWidth: 320, // 기존 240 → 320px로 확대
          }}
        >
          <video
            className="aspect-video cursor-pointer w-full h-full"
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${
                panOffset.y / zoom
              }px)`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.2s',
              userSelect: 'none',
              pointerEvents: 'auto',
            }}
            draggable={false}
          />
          {renderRect && renderRect.w > 0 && renderRect.h > 0 && (
            <div
              className={`absolute border-2 border-red-500 ${
                editMode ? '' : 'pointer-events-none'
              }`}
              style={{
                left: renderRect.x,
                top: renderRect.y,
                width: renderRect.w,
                height: renderRect.h,
                zIndex: 10,
                opacity: 1,
                background: 'none',
                backdropFilter: 'none',
                pointerEvents: editMode ? 'auto' : 'none',
              }}
            >
              {/* 리사이즈 핸들 */}
              {editMode &&
                ['nw', 'ne', 'sw', 'se'].map((dir) => {
                  const style: React.CSSProperties = {
                    position: 'absolute',
                    width: 12,
                    height: 12,
                    background: '#fff',
                    border: '2px solid #f00',
                    borderRadius: 4,
                    zIndex: 20,
                    cursor:
                      dir === 'nw'
                        ? 'nwse-resize'
                        : dir === 'ne'
                        ? 'nesw-resize'
                        : dir === 'sw'
                        ? 'nesw-resize'
                        : 'nwse-resize',
                  };
                  if (dir === 'nw') {
                    style.left = -6;
                    style.top = -6;
                  } else if (dir === 'ne') {
                    style.right = -6;
                    style.top = -6;
                  } else if (dir === 'sw') {
                    style.left = -6;
                    style.bottom = -6;
                  } else if (dir === 'se') {
                    style.right = -6;
                    style.bottom = -6;
                  }
                  return (
                    <div
                      key={dir}
                      style={style}
                      onMouseDown={(e) => handleResizeMouseDown(dir as any, e)}
                    />
                  );
                })}
            </div>
          )}
        </div>
        {isLoaded &&
          (Hls.isSupported() ? (
            <HlsVideoController video={videoRef.current} />
          ) : (
            <VideoPlayerController player={playerRef.current} />
          ))}
      </div>
      {/* 추출 버튼 및 미리보기 */}
      <div className="mt-4 flex flex-col items-center gap-2 min-w-[220px]">
        {/* 선택 영역 정보 비디오 밖에 표시 */}
        <div className="flex flex-col mb-2 text-sm text-gray-700 bg-gray-100 rounded px-3 py-2 border">
          <span>
            X: {Math.round(((rect?.x || 0) * containerSize.width) / 100)}px
          </span>
          <span>
            Y: {Math.round(((rect?.y || 0) * containerSize.height) / 100)}px
          </span>
          <span>
            Width: {Math.round(((rect?.w || 0) * containerSize.width) / 100)}px
          </span>
          <span>
            Height: {Math.round(((rect?.h || 0) * containerSize.height) / 100)}
            px
          </span>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={handleExtract}
          disabled={!finalRect || finalRect.w === 0 || finalRect.h === 0}
        >
          선택 영역 이미지로 추출
        </button>
        <div
          className="border rounded shadow flex items-center justify-center bg-white"
          style={{ width: 480, height: 360 }}
        >
          {croppedUrl ? (
            <img
              src={croppedUrl}
              alt="추출된 영역 미리보기"
              style={{
                objectFit: 'contain',
              }}
            />
          ) : (
            <span className="text-gray-400">미리보기 없음</span>
          )}
        </div>
        {croppedUrl && (
          <a
            href={croppedUrl}
            download={
              finalRect
                ? `cropped_${Math.round(finalRect.x)}_${Math.round(
                    finalRect.y
                  )}_${Math.round(finalRect.w)}x${Math.round(finalRect.h)}.png`
                : 'cropped.png'
            }
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            이미지 다운로드
          </a>
        )}
        {/* 줌 리셋 버튼 */}
        {zoom > 1 && (
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 mb-2"
            onClick={() => {
              setZoom(1);
              setPanOffset({ x: 0, y: 0 });
            }}
          >
            Zoom/Pan 리셋 (더블클릭/0키)
          </button>
        )}
        {/* 도움말 */}
        <div className="text-xs text-gray-400 mt-1 text-center">
          {editMode ? (
            <>편집 모드: 사각형 그리기/이동/리사이즈 가능</>
          ) : (
            <>뷰 모드: 사각형 조작 불가, 영상 탐색만 가능</>
          )}
          <br />
          휠: 줌 | 더블클릭/0키: 리셋 | +, - 키: 줌 | 드래그: 패닝
        </div>
      </div>
    </div>
  );
}
