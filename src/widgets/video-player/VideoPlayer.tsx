import { useEffect, useRef, useState, useCallback } from 'react';
import videojs from 'video.js';
import VideoCommandDescription from './VideoCommandDescription';
import VideoPlayerController from './VideoPlayerController';

const BASE_URL = import.meta.env.VITE_API_URL;
const PATH = `${BASE_URL}/stream.m3u8`;

export interface VideoPlayerState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  playbackRate: number;
}

interface VideoPlayerProps {
  source: string;
  onChange?: (state: VideoPlayerState) => void;
}

export default function VideoPlayer({ source, onChange }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // video.js 상태를 상위로 전달
  const emitState = useCallback(() => {
    const player = playerRef.current;

    if (!player || !onChange) return;

    onChange({
      currentTime: player.currentTime(),
      duration: player.duration(),
      isPlaying: !player.paused(),
      volume: player.volume(),
      muted: player.muted(),
      playbackRate: player.playbackRate(),
    });
  }, [onChange]);

  // 비디오 클릭 시 재생/일시정지
  const handleVideoClick = () => {
    const player = playerRef.current;
    if (player) {
      player.paused() ? player.play() : player.pause();
    }
  };

  // video.js 인스턴스 초기화
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

  // source가 바뀌면 동적으로 소스 변경
  useEffect(() => {
    const player = playerRef.current;
    if (source && player) {
      player.src({
        src: source,
        type: 'application/x-mpegURL',
      });

      player.play();
    }
  }, [source]);

  // 주요 이벤트에 대한 상태 전달
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !onChange) return;

    const update = emitState;

    player.on('timeupdate', update);
    player.on('play', update);
    player.on('pause', update);
    player.on('volumechange', update);
    player.on('ratechange', update);
    player.on('loadedmetadata', update);
    player.on('durationchange', update);

    return () => {
      player.off('timeupdate', update);
      player.off('play', update);
      player.off('pause', update);
      player.off('volumechange', update);
      player.off('ratechange', update);
      player.off('loadedmetadata', update);
      player.off('durationchange', update);
    };
  }, [emitState, onChange]);

  return (
    <div id="video-player">
      <div data-vjs-player className="mb-4 w-full flex justify-center">
        <video
          className="video-js vjs-default-skin rounded-lg shadow-lg cursor-pointer border-4 border-black"
          ref={videoRef}
          controls
          onClick={handleVideoClick}
          style={{ background: '#181818' }}
        />
      </div>

      {isLoaded && <VideoPlayerController player={playerRef.current} />}

      <div className="w-full flex flex-col items-center gap-4">
        <VideoCommandDescription />
      </div>
    </div>
  );
}
