import { checkEncoded } from '@entities/video/utils/checkEncoded';
import { baseApi } from '@shared/lib/axios/axios';
import { formatTime, formatTimeWithMs } from '@shared/utils/time';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';

export default function VideoSeekBar({
  video,
  duration,
  current,
  setCurrent,
  selectedVideo,
}: {
  video: HTMLVideoElement | null;
  duration: number;
  current: number;
  setCurrent: (time: number) => void;
  selectedVideo: string;
}) {
  const thumbnailAbortRef = useRef<AbortController | null>(null);
  const latestSelectedVideo = useRef(selectedVideo);

  const [thumbnailTime, setThumbnailTime] = useState<number | null>(null);
  const [thumbnailX, setThumbnailX] = useState<number>(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  const getThumbnailUrl = async (time: number, filename: string) => {
    if (!filename) return;

    const isEncoded = await checkEncoded(filename);
    if (!isEncoded) {
      return;
    }

    if (thumbnailAbortRef.current) {
      thumbnailAbortRef.current.abort();
    }
    const controller = new AbortController();
    thumbnailAbortRef.current = controller;

    const res = await baseApi.get(
      `/api/v1/videos/thumbnail/${filename}?time=${formatTimeWithMs(time)}`,
      {
        responseType: 'blob',
        signal: controller.signal,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      }
    );

    try {
      const blobUrl = URL.createObjectURL(res.data);
      setThumbnailUrl(blobUrl);
    } catch (error) {
      console.error('썸네일 URL 생성 실패:', error);
    }
  };

  const debouncedGetThumbnailUrl = useRef(
    debounce((time: number) => {
      getThumbnailUrl(time, latestSelectedVideo.current);
    }, 100)
  ).current;

  const getTimeFromMouseEvent = (e: any) => {
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(duration, percent * (duration || 0)));
  };

  const handleSeek = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    if (!video) return;
    const time = getTimeFromMouseEvent(e);
    video.currentTime = time;
    setCurrent(time);
  };

  useEffect(() => {
    return () => {
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  }, [thumbnailUrl]);

  useEffect(() => {
    latestSelectedVideo.current = selectedVideo;
  }, [selectedVideo]);

  return (
    <>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.01}
        value={current}
        onClick={handleSeek}
        onChange={() => {}}
        className="w-full accent-blue-600 h-1 mt-2 appearance-none bg-gray-700 rounded-none border-none focus:outline-none"
        style={{
          background: `linear-gradient(to right, #60a5fa ${
            (current / (duration || 1)) * 100
          }%, #444 ${(current / (duration || 1)) * 100}%)`,
        }}
        onMouseMove={async (e) => {
          if (!selectedVideo) return;
          const time = getTimeFromMouseEvent(e);
          setThumbnailTime(time);
          setThumbnailX(e.clientX);
          debouncedGetThumbnailUrl(time);
        }}
        onMouseLeave={() => {
          setThumbnailTime(null);
          setThumbnailUrl('');
        }}
      />
      {thumbnailTime !== null && thumbnailUrl && (
        <div
          style={{
            position: 'absolute',
            left: `calc(${thumbnailX}px - 400px)`,
            bottom: '70px',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        >
          <img
            src={thumbnailUrl}
            alt="썸네일 미리보기"
            style={{
              width: 120,
              height: 68,
              objectFit: 'cover',
              borderRadius: 0,
              boxShadow: 'none',
              border: '1px solid #222',
            }}
          />
          <div
            style={{
              background: '#181818',
              color: '#fff',
              fontSize: 12,
              textAlign: 'center',
              borderRadius: 0,
              marginTop: 2,
              padding: '0 4px',
              border: '1px solid #222',
            }}
          >
            {formatTime(thumbnailTime)}
          </div>
        </div>
      )}
    </>
  );
}
