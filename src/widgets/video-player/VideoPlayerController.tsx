import { baseApi } from '@shared/lib/axios/axios';
import React, { useEffect, useRef, useState, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = '/api/v1/files/video/frame';

export default function VideoPlayerController({ player }: { player: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverImageUrl, setHoverImageUrl] = useState<string | null>(null);

  const progressBarRef = useRef<HTMLInputElement | null>(null);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    player?.currentTime(val);
    setCurrent(val);
  };

  function handleKeydown(e: KeyboardEvent) {
    // 포커스가 body(즉, 아무 입력창에도 focus 안 된 상태)일 때만 동작
    if (
      document.activeElement &&
      document.activeElement !== document.body &&
      !document.activeElement.closest('#video-player')
    )
      return;
    if (!player) return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        player.paused() ? player.play() : player.pause();
        break;
      case 'ArrowRight':
        e.preventDefault();
        player.currentTime(player.currentTime() + 5);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        player.currentTime(player.currentTime() - 5);
        break;
      case 'b':
      case 'B': {
        const fps = 30;
        player.currentTime(player.currentTime() - 1 / fps);
        break;
      }
      case 'n':
      case 'N': {
        const fps = 30;
        player.currentTime(player.currentTime() + 1 / fps);
        break;
      }
      case 'ArrowUp':
        player.volume(Math.min(player.volume() + 0.1, 1));
        break;
      case 'ArrowDown':
        player.volume(Math.max(player.volume() - 0.1, 0));
        break;
      case '+':
        player.playbackRate(Math.min(player.playbackRate() + 0.25, 2));
        break;
      case '-':
        player.playbackRate(Math.max(player.playbackRate() - 0.25, 0.25));
        break;
      case 'f':
      case 'F':
        player.isFullscreen()
          ? player.exitFullscreen()
          : player.requestFullscreen();
        break;
      case 'm':
      case 'M':
        player.muted(!player.muted());
        break;
    }
  }

  // 진행바에 마우스 올릴 때 썸네일 요청 (debounce 적용)
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchThumbnail = useCallback(async (time: number) => {
    setHoverImageUrl(``);

    try {
      const timeStr = new Date(time * 1000).toISOString().substring(11, 23);
      const res = await baseApi.get(`${API_URL}?time=${timeStr}`);
      setHoverImageUrl(`${BASE_URL}/${res.data}`);
    } catch {
      setHoverImageUrl(null);
    }
  }, []);

  // hoverTime이 바뀔 때마다 항상 썸네일 요청
  useEffect(() => {
    if (hoverTime === null) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchThumbnail(hoverTime);
    }, 300);
  }, [hoverTime]);

  // handleProgressBarMouseMove는 hoverTime만 갱신
  const handleProgressBarMouseMove = (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = Math.max(0, Math.min(duration, percent * duration));
    setHoverTime(time);
  };

  const handleProgressBarMouseLeave = () => {
    setHoverTime(null);
    setHoverImageUrl(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  useEffect(() => {
    const update = () => {
      setCurrent(player.currentTime());
      setDuration(player.duration());
      setMuted(player.muted());
    };

    if (player) {
      player.on('play', () => {
        console.log('play');
        setIsPlaying(true);
      });
      player.on('pause', () => setIsPlaying(false));
      player.on('volumechange', () => {
        setVolume(player.volume());
        setMuted(player.muted());
      });
      player.on('ratechange', () => setRate(player.playbackRate()));
      player.on('timeupdate', update);
      player.on('loadedmetadata', update);
      player.on('durationchange', update);
    }

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <>
      <div className="w-full items-center mb-2 px-2 relative">
        <input
          ref={progressBarRef}
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={current}
          onChange={handleSeek}
          onMouseMove={handleProgressBarMouseMove}
          onMouseLeave={handleProgressBarMouseLeave}
          className="w-full accent-red-600 h-1 appearance-none bg-transparent"
          title="진행바"
          style={{
            background: `linear-gradient(to right, #f87171 ${
              (current / (duration || 1)) * 100
            }%, #444 ${(current / (duration || 1)) * 100}%)`,
          }}
        />
        {/* 썸네일 미리보기 */}
        {hoverTime !== null && (
          <div
            style={{
              position: 'absolute',
              left: `calc(${(hoverTime / (duration || 1)) * 100}% - 60px)`,
              bottom: '18px',
              width: '120px',
              height: '68px',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'end',
              zIndex: 10,
            }}
          >
            {hoverImageUrl && (
              <img
                src={hoverImageUrl}
                alt="썸네일 미리보기"
                className="rounded shadow border bg-black object-contain w-full h-full"
                style={{ userSelect: 'none' }}
              />
            )}
            <div className="text-xs text-center text-white bg-black bg-opacity-60 rounded-b px-1 py-0.5 -mt-1">
              {formatTime(hoverTime)}
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex items-center justify-between px-6 py-4 bg-[#181818] rounded-lg shadow text-white gap-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => player?.currentTime(player?.currentTime() - 10)}
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
              player?.paused() ? player?.play() : player?.pause()
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
            onClick={() => player?.currentTime(player?.currentTime() + 10)}
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
              player?.muted(!muted);
              setMuted(!muted);
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
              const vol = parseFloat(e.target.value);
              player?.volume(vol);
              setVolume(vol);
            }}
            className="w-24 accent-red-600"
            title="볼륨 조절"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={rate}
            onChange={(e) => {
              const newRate = parseFloat(e.target.value);
              player?.playbackRate(newRate);
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
            onClick={() =>
              player?.isFullscreen()
                ? player?.exitFullscreen()
                : player?.requestFullscreen()
            }
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
    </>
  );
}

function formatTime(sec: number) {
  if (isNaN(sec)) return '00:00';
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}
