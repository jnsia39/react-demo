import { useEffect, useRef, useState, useCallback } from 'react';
import VideoCommandDescription from './VideoCommandDescription';
import Hls from 'hls.js';
import DashVideoController from './DashVideoController';
import * as dashjs from 'dashjs';

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
  const videoRef = useRef<any | null>(null);
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

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // DASH
    if (source.endsWith('.mpd')) {
      const dashPlayer = dashjs.MediaPlayer().create();
      dashPlayer.updateSettings({
        streaming: {
          buffer: {
            bufferPruningInterval: 20,
            bufferToKeep: 30,
            bufferTimeAtTopQuality: 30,
            bufferTimeAtTopQualityLongForm: 60,
          },
          abr: {
            autoSwitchBitrate: {
              audio: true,
              video: true,
            },
            initialBitrate: {
              audio: 300000,
              video: 1500000,
            },
          },
          delay: {
            liveDelay: 2,
          },
        },
      });
      dashPlayer.initialize(videoElement, source, true);
      videoElement.removeAttribute('controls'); // 기본 컨트롤러 제거
      const tryAutoplay = () => {
        const playPromise = videoElement.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch(() => {
            const onCanPlay = () => {
              videoElement.play();
              videoElement.removeEventListener('canplay', onCanPlay);
            };
            videoElement.addEventListener('canplay', onCanPlay);
          });
        }
      };
      tryAutoplay();
      setIsLoaded(true);
      return () => {
        dashPlayer && dashPlayer.reset();
      };
    }

    // HLS
    if (Hls.isSupported() && source.endsWith('.m3u8')) {
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
      hls.loadSource(source);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play();
      });
      videoElement.removeAttribute('controls');
      setIsLoaded(true);
      return () => {
        hls && hls.destroy();
      };
    }
  }, [source]);

  // 주요 이벤트에 대한 상태 전달
  useEffect(() => {
    const player = videoRef.current;
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
    <div
      id="video-player"
      className="flex flex-col items-center justify-center w-full h-full"
    >
      <video
        id="videoPlayer"
        controls
        className="aspect-video cursor-pointer w-full h-full"
        ref={videoRef}
        width={640}
        height={360}
        onClick={handleVideoClick}
      />

      {isLoaded && <DashVideoController video={videoRef.current} />}

      <div className="w-full flex flex-col items-center gap-4">
        <VideoCommandDescription />
      </div>
    </div>
  );
}
