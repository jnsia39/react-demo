import { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PATH = `${BASE_URL}/stream.m3u8`; // HLS 경로

export default function InteractiveVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const requestIdRef = useRef<number | null>(null);
  // 오프스크린 캔버스/컨텍스트 재사용
  const offCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // 사각형 상태
  const [rect, setRect] = useState({ x: 100, y: 80, width: 160, height: 120 });
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // HLS.js 초기화
    const hls = new Hls();
    hls.loadSource(PATH);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
    hlsRef.current = hls;

    return () => {
      hlsRef.current?.destroy();
      if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  // 마우스 이벤트 핸들링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 640;
    canvas.height = 360;

    // 오프스크린 캔버스/컨텍스트 미리 생성 및 재사용
    if (!offCanvasRef.current) {
      offCanvasRef.current = document.createElement('canvas');
      offCanvasRef.current.width = rect.width;
      offCanvasRef.current.height = rect.height;
      offCtxRef.current = offCanvasRef.current.getContext('2d');
    }

    const handleMouseDown = (e: MouseEvent) => {
      const rectCanvas = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rectCanvas.left;
      const mouseY = e.clientY - rectCanvas.top;

      if (
        mouseX >= rect.x &&
        mouseX <= rect.x + rect.width &&
        mouseY >= rect.y &&
        mouseY <= rect.y + rect.height
      ) {
        draggingRef.current = true;
        offsetRef.current = { x: mouseX - rect.x, y: mouseY - rect.y };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const rectCanvas = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rectCanvas.left;
      const mouseY = e.clientY - rectCanvas.top;

      setRect((prev) => ({
        ...prev,
        x: mouseX - offsetRef.current.x,
        y: mouseY - offsetRef.current.y,
      }));
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
    };

    const video = videoRef.current;
    const ctx = canvasRef.current?.getContext('2d');

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    function renderFrame() {
      if (video!.readyState >= 2) {
        if (!ctx) return;
        ctx.drawImage(video!, 0, 0, canvas!.width, canvas!.height);
        const { x, y, width, height } = rect;

        // dragging이 끝난 시점에만 blur 처리
        if (!draggingRef.current) {
          // 오프스크린 캔버스 크기 갱신
          if (offCanvasRef.current) {
            if (
              offCanvasRef.current.width !== width ||
              offCanvasRef.current.height !== height
            ) {
              offCanvasRef.current.width = width;
              offCanvasRef.current.height = height;
            }
            const offCtx = offCtxRef.current;
            if (offCtx) {
              // 원본에서 해당 영역 복사
              offCtx.clearRect(0, 0, width, height);
              offCtx.drawImage(
                canvas!,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height
              );
              // 블러 필터 적용
              offCtx.filter = 'blur(8px)';
              offCtx.drawImage(offCanvasRef.current, 0, 0);
              offCtx.filter = 'none';
              // 블러 처리된 영역을 원래 캔버스에 다시 그림
              ctx.drawImage(offCanvasRef.current, x, y);
            }
          }
        }

        // 사각형 테두리 그리기
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      }
      requestIdRef.current = requestAnimationFrame(renderFrame);
    }

    renderFrame();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [rect]);

  return (
    <div style={{ position: 'relative', width: '640px', height: '360px' }}>
      <video
        ref={videoRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        controls
        muted
        playsInline
      />
      {/* <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'auto', // 마우스 이벤트 가능
        }}
      /> */}
    </div>
  );
}
