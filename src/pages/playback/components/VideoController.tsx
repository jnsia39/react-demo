import {
  IconPrev10,
  IconNext10,
  IconPause,
  IconPlay,
  IconVolumeMute,
  IconVolume,
  IconFullscreen,
} from '@features/video/ui/VideoIcons';
import { formatTime } from '@shared/utils/time';
import useVideoController from '@features/video/model/useVideoController';
import VideoSeekBar from '@features/video/ui/VideoSeekBar';

interface DashVideoControllerProps {
  video: HTMLVideoElement | null;
  selectedVideo: string;
  zoom?: number;
  setZoom?: (z: number) => void;
}

export default function VideoController({
  video,
  selectedVideo,
  zoom,
  setZoom,
}: DashVideoControllerProps) {
  const {
    isPlaying,
    volume,
    setVolume,
    rate,
    setRate,
    muted,
    setMuted,
    current,
    setCurrent,
    duration,
  } = useVideoController({ video });

  return (
    <div className="w-full flex flex-col items-center justify-between px-0 py-2 bg-neutral-900 text-white gap-2 border-b border-gray-800 relative">
      <VideoSeekBar
        video={video}
        duration={duration}
        current={current}
        setCurrent={setCurrent}
        selectedVideo={selectedVideo}
      />
      <div className="flex flex-wrap justify-between items-center w-full gap-2 mt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              video && (video.currentTime = Math.max(0, video.currentTime - 5))
            }
            className="hover:bg-blue-900 rounded-none p-2 transition cursor-pointer rotate-90 focus:outline-none"
            title="5초 뒤로 (←)"
          >
            <IconPrev10 />
          </button>
          <button
            onClick={() =>
              video && (video.paused ? video.play() : video.pause())
            }
            className="hover:bg-blue-900 rounded-none p-2 transition text-xl cursor-pointer focus:outline-none"
            title="재생/일시정지 (Space)"
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button
            onClick={() =>
              video &&
              (video.currentTime = Math.min(duration, video.currentTime + 5))
            }
            className="hover:bg-blue-900 rounded-none p-2 transition cursor-pointer rotate-90 focus:outline-none"
            title="5초 앞으로 (→)"
          >
            <IconNext10 />
          </button>
          <span className="ml-4 text-xs text-gray-400">
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
            className="hover:bg-blue-900 rounded-none p-2 transition cursor-pointer focus:outline-none"
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
            className="w-24 accent-blue-600 h-1 bg-gray-700 rounded-none border-none focus:outline-none"
            title="볼륨 조절"
          />
        </div>
        {zoom && setZoom && (
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 border border-white rounded-none hover:bg-blue-900 focus:outline-none"
              onClick={() => setZoom(Math.max(1, +(zoom - 0.1).toFixed(2)))}
              disabled={zoom <= 1}
            >
              -
            </button>
            <span className="text-white text-xs">Zoom: {zoom.toFixed(1)}x</span>
            <button
              className="px-2 py-1 border border-white rounded-none hover:bg-blue-900 focus:outline-none"
              onClick={() => setZoom(Math.min(10, +(zoom + 0.1).toFixed(2)))}
              disabled={zoom >= 10}
            >
              +
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <select
            value={rate}
            onChange={(e) => {
              if (!video) return;
              const newRate = parseFloat(e.target.value);
              video.playbackRate = newRate;
              setRate(newRate);
            }}
            className="bg-neutral-900 text-white border border-gray-700 rounded-none px-2 py-1 focus:outline-none"
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
            className="hover:bg-blue-900 rounded-none p-2 transition cursor-pointer focus:outline-none"
            title="전체화면(F)"
          >
            <IconFullscreen />
          </button>
        </div>
      </div>
    </div>
  );
}
