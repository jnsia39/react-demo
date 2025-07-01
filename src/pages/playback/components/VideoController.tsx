import { baseApi, baseURL } from '@shared/lib/axios/axios';
import React, { useEffect, useState, useRef } from 'react';
import {
  IconPrev10,
  IconNext10,
  IconPause,
  IconPlay,
  IconVolumeMute,
  IconVolume,
  IconFullscreen,
} from '@features/video/ui/VideoIcons';
import { debounce } from 'lodash';
import { checkEncoded } from '@entities/video/utils/checkEncoded';

interface DashVideoControllerProps {
  video: HTMLVideoElement | null;
  selectedVideo: string;
  zoom: number;
  setZoom: (z: number) => void;
}

export default function VideoController({
  video,
  selectedVideo,
  zoom,
  setZoom,
}: DashVideoControllerProps) {
  const latestSelectedVideo = useRef(selectedVideo);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [thumbnailTime, setThumbnailTime] = useState<number | null>(null);
  const [thumbnailX, setThumbnailX] = useState<number>(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  const thumbnailAbortRef = useRef<AbortController | null>(null);

  const getThumbnailUrl = async (time: number, filename: string) => {
    if (!filename) return;

    const isEncoded = await checkEncoded(filename);
    if (!isEncoded) {
      setThumbnailUrl('');
      return;
    }

    if (thumbnailAbortRef.current) {
      thumbnailAbortRef.current.abort();
    }
    const controller = new AbortController();
    thumbnailAbortRef.current = controller;

    const res = await baseApi.get(
      `/api/v1/files/video/thumbnail/${filename}?time=${formatTimeWithMs(
        time
      )}`,
      { signal: controller.signal }
    );
    setThumbnailUrl(`${baseURL}/${res.data}`);
  };

  const debouncedGetThumbnailUrl = useRef(
    debounce((time: number) => {
      getThumbnailUrl(time, latestSelectedVideo.current);
    }, 100)
  ).current;

  useEffect(() => {
    latestSelectedVideo.current = selectedVideo;
  }, [selectedVideo]);

  // const getVideoDuration = async () => {
  //   const response = await baseApi.get(
  //     `/api/v1/files/video/duration/${selectedVideo}`
  //   );
  //   return response.data;
  // };

  // useEffect(() => {
  //   if (!video) return;

  //   const fetchDuration = async () => {
  //     try {
  //       const duration = await getVideoDuration();
  //       setDuration(duration);
  //     } catch (error) {
  //       console.error('비디오 길이 가져오기 실패:', error);
  //     }
  //   };

  //   fetchDuration();

  //   return () => {
  //     video.removeEventListener('loadedmetadata', () => {});
  //   };
  // }, [selectedVideo]);

  // 진행바에서 마우스 위치로 시간 계산 (공통 함수)
  const getTimeFromMouseEvent = (e: any) => {
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(duration, percent * (duration || 0)));
  };

  // onChange(드래그/클릭)에서도 동일하게 사용
  const handleSeek = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    if (!video) return;
    const time = getTimeFromMouseEvent(e);
    video.currentTime = time;
    setCurrent(time);
  };

  // 비디오 상태 동기화
  useEffect(() => {
    if (!video) return;

    const update = () => {
      setCurrent(video.currentTime);
      setMuted(video.muted);
      setVolume(video.volume);
      setRate(video.playbackRate);
      setDuration(video.duration);
    };

    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));
    video.addEventListener('volumechange', update);
    video.addEventListener('ratechange', update);
    video.addEventListener('timeupdate', update);
    video.addEventListener('loadedmetadata', update);
    video.addEventListener('durationchange', update);

    return () => {
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
      video.removeEventListener('volumechange', update);
      video.removeEventListener('ratechange', update);
      video.removeEventListener('timeupdate', update);
      video.removeEventListener('loadedmetadata', update);
      video.removeEventListener('durationchange', update);
    };
  }, [video]);

  return (
    <div className="w-full flex flex-col items-center justify-between px-4 py-2 bg-[#181818] text-white gap-2">
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.01}
        value={current}
        onClick={handleSeek}
        onChange={() => {}}
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
        className="w-full accent-blue-600 h-1 mt-2 appearance-none bg-transparent"
        title=""
        style={{
          background: `linear-gradient(to right, #60a5fa ${
            (current / (duration || 1)) * 100
          }%, #444 ${(current / (duration || 1)) * 100}%)`,
        }}
      />
      {/* 썸네일 미리보기 */}
      {thumbnailTime !== null && thumbnailUrl && (
        <div
          style={{
            position: 'absolute',
            left: `calc(${thumbnailX}px - 60px)`, // 썸네일 중앙 정렬 (썸네일 가로 120px 기준)
            bottom: '48px', // 진행바 위에 띄우기
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
              borderRadius: 6,
              boxShadow: '0 2px 8px #0008',
            }}
          />
          <div
            style={{
              background: '#222',
              color: '#fff',
              fontSize: 12,
              textAlign: 'center',
              borderRadius: 4,
              marginTop: 2,
              padding: '0 4px',
            }}
          >
            {formatTime(thumbnailTime)}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              video && (video.currentTime = Math.max(0, video.currentTime - 10))
            }
            className="hover:bg-[#333] rounded-full p-2 transition cursor-pointer  rotate-90"
            title="10초 뒤로 (←)"
          >
            <IconPrev10 />
          </button>
          <button
            onClick={() =>
              video && (video.paused ? video.play() : video.pause())
            }
            className="hover:bg-[#333] rounded-full p-2 transition text-xl cursor-pointer"
            title="재생/일시정지 (Space)"
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button
            onClick={() =>
              video &&
              (video.currentTime = Math.min(duration, video.currentTime + 10))
            }
            className="hover:bg-[#333] rounded-full p-2 transition cursor-pointer  rotate-90"
            title="10초 앞으로 (→)"
          >
            <IconNext10 />
          </button>
          <span className="ml-4 text-xs text-gray-300">
            {formatTime(current)} /{' '}
            {duration === Number.POSITIVE_INFINITY
              ? 'Encoding...'
              : formatTime(duration)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!video) return;
              video.muted = !video.muted;
              setMuted(video.muted);
            }}
            className="hover:bg-[#333] rounded-full p-2 transition cursor-pointer"
            title={muted ? '음소거 해제(M)' : '음소거(M)'}
          >
            {muted || volume === 0 ? <IconVolumeMute /> : <IconVolume />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              if (!video) return;
              const vol = parseFloat(e.target.value);
              video.volume = vol;
              setVolume(vol);
            }}
            className="w-24 accent-blue-600"
            title="볼륨 조절"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 border-white border rounded hover:bg-gray-300"
            onClick={() => setZoom(Math.max(1, +(zoom - 0.1).toFixed(2)))}
            disabled={zoom <= 1}
          >
            -
          </button>
          <span className="text-white">Zoom: {zoom.toFixed(1)}x</span>
          <button
            className="px-2 py-1 border-white border rounded hover:bg-gray-300"
            onClick={() => setZoom(Math.min(3, +(zoom + 0.1).toFixed(2)))}
            disabled={zoom >= 10}
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={rate}
            onChange={(e) => {
              if (!video) return;
              const newRate = parseFloat(e.target.value);
              video.playbackRate = newRate;
              setRate(newRate);
            }}
            className="bg-[#222] text-white border border-gray-600 rounded px-2 py-1 focus:outline-none"
            title="재생 속도"
          >
            {[0.25, 0.5, 1, 1.25, 1.5, 2, 3, 4, 10].map((r) => (
              <option key={r} value={r}>
                {r}x
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (!video) return;
              if (document.fullscreenElement) document.exitFullscreen();
              else video.requestFullscreen();
            }}
            className="hover:bg-[#333] rounded-full p-2 transition cursor-pointer"
            title="전체화면(F)"
          >
            <IconFullscreen />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(sec: number) {
  if (isNaN(sec)) return '00:00';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  if (h > 0) {
    return `${h}:${m}:${s}`;
  }
  return `${m}:${s}`;
}

function formatTimeWithMs(sec: number) {
  if (isNaN(sec)) return '00:00:00.000';
  const h = Math.floor(sec / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((sec % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  const ms = Math.floor((sec % 1) * 1000)
    .toString()
    .padStart(3, '0');
  return `${h}:${m}:${s}.${ms}`;
}
