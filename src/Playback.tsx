import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const PATH = 'http://localhost:15460/video/stream.m3u8';

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

export default function Playback() {
  const videoRef = useRef<any>(null);
  const playerRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const start = async () => {
    const result = await axios.post(
      'http://localhost:15460/api/v1/files/video'
    );

    console.log('Video started:', result);

    const player = playerRef.current;

    player.play();
  };

  const stop = async () => {
    const result = await axios.post(
      'http://localhost:15460/api/v1/files/video/stop'
    );

    console.log('Video stopped:', result);
  };

  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: false,
        autoplay: false,
        preload: 'auto',
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        sources: [
          {
            src: PATH,
            type: 'application/x-mpegURL',
          },
        ],
      });
    }

    const player = playerRef.current;

    const update = () => {
      setCurrent(player.currentTime());
      setDuration(player.duration());
      setMuted(player.muted());
    };

    player.on('play', () => setIsPlaying(true));
    player.on('pause', () => setIsPlaying(false));
    player.on('volumechange', () => {
      setVolume(player.volume());
      setMuted(player.muted());
    });
    player.on('ratechange', () => setRate(player.playbackRate()));
    player.on('timeupdate', update);
    player.on('loadedmetadata', update);
    player.on('durationchange', update);

    function handleKeydown(e: KeyboardEvent) {
      if (!player) return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          player.paused() ? player.play() : player.pause();
          break;
        case 'ArrowRight':
          player.currentTime(player.currentTime() + 5);
          break;
        case 'ArrowLeft':
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

    window.addEventListener('keydown', handleKeydown);

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  // Seek bar 핸들러
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    playerRef.current?.currentTime(val);
    setCurrent(val);
  };

  // 비디오 클릭 시 재생/일시정지
  const handleVideoClick = () => {
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex gap-4 my-2">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
          onClick={start}
        >
          Start
        </button>
        <button
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition cursor-pointer"
          onClick={stop}
        >
          End
        </button>
      </div>
      <main className="flex flex-col items-center w-full">
        <div
          className="bg-black rounded-xl shadow-lg p-8 flex flex-col items-center"
          style={{ width: 900 }}
        >
          <div data-vjs-player className="mb-4 w-full flex justify-center">
            <video
              className="video-js vjs-default-skin rounded-lg shadow-lg cursor-pointer border-4 border-black"
              ref={videoRef}
              width={900}
              height={520}
              controls
              onClick={handleVideoClick}
              style={{ background: '#181818' }}
            >
              <source src={PATH} type="application/x-mpegURL" />
            </video>
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex items-center mb-2 px-2 relative">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.01}
                value={current}
                onChange={handleSeek}
                className="w-full accent-red-600 h-1 appearance-none bg-transparent"
                title="진행바"
                style={{
                  background: `linear-gradient(to right, #f87171 ${
                    (current / (duration || 1)) * 100
                  }%, #444 ${(current / (duration || 1)) * 100}%)`,
                }}
              />
            </div>
            <div className="w-full flex items-center justify-between px-6 py-4 bg-[#181818] rounded-lg shadow text-white gap-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    playerRef.current?.currentTime(
                      playerRef.current?.currentTime() - 10
                    )
                  }
                  className="hover:bg-[#333] rounded-full p-2 transition cursor-pointer"
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
                    playerRef.current?.paused()
                      ? playerRef.current?.play()
                      : playerRef.current?.pause()
                  }
                  className="hover:bg-[#333] rounded-full p-2 transition text-xl cursor-pointer"
                  title="재생/일시정지 (Space)"
                >
                  {isPlaying ? (
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="6"
                        y="4"
                        width="4"
                        height="16"
                        rx="2"
                        fill="#fff"
                      />
                      <rect
                        x="14"
                        y="4"
                        width="4"
                        height="16"
                        rx="2"
                        fill="#fff"
                      />
                    </svg>
                  ) : (
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <path d="M7 4v16l13-8-13-8z" fill="#fff" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() =>
                    playerRef.current?.currentTime(
                      playerRef.current?.currentTime() + 10
                    )
                  }
                  className="hover:bg-[#333] rounded-full p-2 transition cursor-pointer"
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
                  {formatTime(current)} / {formatTime(duration)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playerRef.current?.muted(!muted);
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
                    playerRef.current?.volume(vol);
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
                    playerRef.current?.playbackRate(newRate);
                    setRate(newRate);
                  }}
                  className="bg-[#222] text-white border border-gray-600 rounded px-2 py-1 focus:outline-none"
                  title="재생 속도"
                >
                  {[0.5, 1, 1.25, 1.5, 2].map((r) => (
                    <option key={r} value={r}>
                      {r}x
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    playerRef.current?.isFullscreen()
                      ? playerRef.current?.exitFullscreen()
                      : playerRef.current?.requestFullscreen()
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
            <div className="w-full text-xs text-gray-400 mt-2 flex flex-wrap gap-x-4 gap-y-1 justify-center">
              <span>
                <b>Space</b>: 재생/일시정지
              </span>
              <span>
                <b>←/→</b>: 5초 이동
              </span>
              <span>
                <b>↑/↓</b>: 볼륨
              </span>
              <span>
                <b>+/–</b>: 속도
              </span>
              <span>
                <b>B/N</b>: 1프레임 뒤로/앞으로 (30fps 기준)
              </span>
              <span>
                <b>M</b>: 음소거
              </span>
              <span>
                <b>F</b>: 전체화면
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
