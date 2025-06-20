import VideoPlayerController from '@widgets/video-player/VideoPlayerController';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';

const BASE_URL = import.meta.env.VITE_API_URL;
const PATH = `${BASE_URL}/stream.m3u8`;

export default function VideoAreaSelector() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [finalRect, setFinalRect] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);

  // 마우스 좌표를 컨테이너 기준으로 변환
  const getRelativePos = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getRelativePos(e);
    setStartPos(pos);
    setCurrentPos(pos);
    setIsDrawing(true);
    setFinalRect(null);
    setCroppedUrl(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    setCurrentPos(getRelativePos(e));
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const w = Math.abs(currentPos.x - startPos.x);
    const h = Math.abs(currentPos.y - startPos.y);
    setFinalRect({ x, y, w, h });
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

  // 비디오 프레임에서 선택 영역 추출
  const handleExtract = () => {
    if (!finalRect || !videoRef.current) return;
    const video = videoRef.current;
    // 비디오의 실제 렌더링 크기와 선택 영역의 비율 계산
    const videoRect = video.getBoundingClientRect();
    const containerRect = containerRef.current!.getBoundingClientRect();
    const scaleX = video.videoWidth / videoRect.width;
    const scaleY = video.videoHeight / videoRect.height;
    // 실제 비디오 픽셀 기준 좌표
    const sx = (finalRect.x - (videoRect.left - containerRect.left)) * scaleX;
    const sy = (finalRect.y - (videoRect.top - containerRect.top)) * scaleY;
    const sw = finalRect.w * scaleX;
    const sh = finalRect.h * scaleY;
    // 캔버스에 그리기
    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);
    setCroppedUrl(canvas.toDataURL('image/png'));
  };

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: false,
        autoplay: 'play',
        preload: 'auto',
        playbackRates: [0.25, 0.5, 1, 1.25, 1.5, 2, 3, 4, 10],
        sources: [
          {
            src: PATH,
            type: 'application/x-mpegURL',
          },
        ],
      });

      setIsLoaded(true);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen w-full gap-4">
      <div className=" p-4 bg-black rounded-lg">
        <div
          ref={containerRef}
          className="relative inline-block select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <video
            ref={videoRef}
            className="rounded-lg cursor-pointer"
            controls
          />
          {rect && rect.w > 0 && rect.h > 0 && (
            <div
              className="absolute border-2 opacity-35 border-red-500 bg-red-500 bg-opacity-10 pointer-events-none"
              style={{
                left: rect.x,
                top: rect.y,
                width: rect.w,
                height: rect.h,
                zIndex: 10,
              }}
            >
              {/* 영역 정보 */}
              <div
                className="absolute left-0 top-0 bg-black bg-opacity-70 text-white text-xs rounded px-2 py-1 m-1"
                style={{ pointerEvents: 'none' }}
              >
                W: {Math.round(rect.w)}px
                <br />
                H: {Math.round(rect.h)}px
              </div>
            </div>
          )}
        </div>

        {isLoaded && <VideoPlayerController player={playerRef.current} />}
      </div>

      {/* 추출 버튼 및 미리보기 */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
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
      </div>
    </div>
  );
}
