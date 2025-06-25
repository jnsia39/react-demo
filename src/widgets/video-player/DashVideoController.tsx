import { baseApi } from '@shared/lib/axios/axios';
import React, { useEffect, useState } from 'react';

interface DashVideoControllerProps {
  video: HTMLVideoElement | null;
}

export default function DashVideoController({
  video,
}: DashVideoControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const getVideoDuration = async () => {
    const response = await baseApi.get('/api/v1/files/video/duration');
    return response.data;
  };

  // 초기 비디오 로드 시 메타데이터 가져오기
  useEffect(() => {
    if (!video) return;

    const fetchDuration = async () => {
      try {
        const duration = await getVideoDuration();
        setDuration(duration);
      } catch (error) {
        console.error('비디오 길이 가져오기 실패:', error);
      }
    };

    fetchDuration();

    return () => {
      video.removeEventListener('loadedmetadata', () => {});
    };
  }, []);

  // 키보드 단축키 핸들러
  useEffect(() => {
    if (!video) return;
    const handleKeydown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        document.activeElement !== document.body &&
        !document.activeElement.closest('#video-player')
      )
        return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          video.paused ? video.play() : video.pause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          console.log('duration', duration);
          video.currentTime = video.currentTime + 5;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          break;
        case 'b':
        case 'B': {
          const fps = 30;
          video.currentTime = Math.max(0, video.currentTime - 1 / fps);
          break;
        }
        case 'n':
        case 'N': {
          const fps = 30;
          video.currentTime = Math.min(duration, video.currentTime + 1 / fps);
          break;
        }
        case 'ArrowUp':
          video.volume = Math.min(video.volume + 0.1, 1);
          break;
        case 'ArrowDown':
          video.volume = Math.max(video.volume - 0.1, 0);
          break;
        case '+':
          video.playbackRate = Math.min(video.playbackRate + 0.25, 2);
          break;
        case '-':
          video.playbackRate = Math.max(video.playbackRate - 0.25, 0.25);
          break;
        case 'f':
        case 'F':
          if (document.fullscreenElement) document.exitFullscreen();
          else video.requestFullscreen();
          break;
        case 'm':
        case 'M':
          video.muted = !video.muted;
          setMuted(video.muted);
          break;
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  // 비디오 상태 동기화
  useEffect(() => {
    if (!video) return;
    const update = () => {
      setCurrent(video.currentTime);
      setMuted(video.muted);
      setVolume(video.volume);
      setRate(video.playbackRate);
    };

    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));
    video.addEventListener('volumechange', update);
    video.addEventListener('ratechange', update);
    video.addEventListener('timeupdate', update);
    video.addEventListener('loadedmetadata', update);

    return () => {
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
      video.removeEventListener('volumechange', update);
      video.removeEventListener('ratechange', update);
      video.removeEventListener('timeupdate', update);
      video.removeEventListener('loadedmetadata', update);
      video.removeEventListener('durationchange', update);
    };
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.currentTime = val;
    setCurrent(val);
  };

  return (
    <div className="w-full flex flex-col items-center justify-between px-6 py-4 bg-[#181818] rounded-lg shadow text-white gap-6">
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.01}
        value={current}
        onChange={handleSeek}
        className="w-full accent-blue-600 h-1 appearance-none bg-transparent mt-4"
        title="진행바"
        style={{
          background: `linear-gradient(to right, #60a5fa ${
            (current / (duration || 1)) * 100
          }%, #444 ${(current / (duration || 1)) * 100}%)`,
        }}
      />
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              video && (video.currentTime = Math.max(0, video.currentTime - 10))
            }
            className="hover:bg-[#333] rounded-full p-2 transition cursor-pointer  rotate-90"
            title="10초 뒤로 (←)"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 5v14m0 0l-7-7m7 7l7-7"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              video && (video.paused ? video.play() : video.pause())
            }
            className="hover:bg-[#333] rounded-full p-2 transition text-xl cursor-pointer"
            title="재생/일시정지 (Space)"
          >
            {isPlaying ? (
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="2" fill="#fff" />
                <rect x="14" y="4" width="4" height="16" rx="2" fill="#fff" />
              </svg>
            ) : (
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path d="M7 4v16l13-8-13-8z" fill="#fff" />
              </svg>
            )}
          </button>
          <button
            onClick={() =>
              video &&
              (video.currentTime = Math.min(duration, video.currentTime + 10))
            }
            className="hover:bg-[#333] rounded-full p-2 transition cursor-pointer  rotate-90"
            title="10초 앞으로 (→)"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 19V5m0 0l7 7m-7-7l-7 7"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
            {muted || volume === 0 ? (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M9 9v6h4l5 5V4l-5 5H9z" fill="#fff" />
                <line
                  x1="4"
                  y1="4"
                  x2="20"
                  y2="20"
                  stroke="#f87171"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M9 9v6h4l5 5V4l-5 5H9z" fill="#fff" />
              </svg>
            )}
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
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="2"
                stroke="#fff"
                strokeWidth="2"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="2"
                stroke="#fff"
                strokeWidth="2"
              />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="2"
                stroke="#fff"
                strokeWidth="2"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="2"
                stroke="#fff"
                strokeWidth="2"
              />
            </svg>
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
