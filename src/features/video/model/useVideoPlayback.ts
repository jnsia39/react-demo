import { checkEncoded } from '@entities/video/utils/checkEncoded';
import { startEncoding } from '@entities/video/video.api';
import * as dashjs from 'dashjs';
import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function useVideoPlayback({
  selectedVideo,
}: {
  selectedVideo: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selectedVideo) return;

    const nameWithoutExt = selectedVideo.replace(/\.[^/.]+$/, '');
    const source = `${BASE_URL}/${nameWithoutExt}.m3u8`;

    let hls: Hls | null = null;
    let dashPlayer: dashjs.MediaPlayerClass | null = null;
    let encodingStarted = false;
    let cleanup: (() => void) | undefined;

    const setupPlayer = () => {
      if (Hls.isSupported() && source.endsWith('.m3u8')) {
        const noCacheSource = `${source}${
          source.includes('?') ? '&' : '?'
        }_ts=${Date.now()}`;
        hls = new Hls({
          maxBufferLength: 10,
          maxMaxBufferLength: 20,
          maxBufferSize: 20 * 1000 * 1000,
          maxBufferHole: 0.5,
          abrEwmaFastLive: 2.0,
          abrEwmaSlowLive: 5.0,
          abrBandWidthFactor: 0.95,
          abrBandWidthUpFactor: 0.8,
          manifestLoadingTimeOut: 1000,
          manifestLoadingMaxRetry: 5,
          manifestLoadingRetryDelay: 200,
          manifestLoadingMaxRetryTimeout: 2000,
          maxLiveSyncPlaybackRate: 1.0,
          lowLatencyMode: true,
        });
        hls.loadSource(noCacheSource);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
        cleanup = () => {
          hls && hls.destroy();
        };
      } else if (source.endsWith('.mpd')) {
        dashPlayer = dashjs.MediaPlayer().create();
        dashPlayer.updateSettings({
          streaming: {
            buffer: {
              bufferPruningInterval: 20,
              bufferToKeep: 30,
              bufferTimeAtTopQuality: 30,
              bufferTimeAtTopQualityLongForm: 60,
            },
            abr: {
              autoSwitchBitrate: { audio: true, video: true },
              initialBitrate: { audio: 300000, video: 1500000 },
            },
            delay: { liveDelayFragmentCount: 4, liveDelay: 2 },
          },
        });
        dashPlayer.initialize(video, source, true);
        video.removeAttribute('controls');
        const tryAutoplay = () => {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(() => {
              const onCanPlay = () => {
                video.play();
                video.removeEventListener('canplay', onCanPlay);
              };
              video.addEventListener('canplay', onCanPlay);
            });
          }
        };
        tryAutoplay();
        cleanup = () => {
          dashPlayer && dashPlayer.reset();
        };
      }
    };

    // effect 진입 시 인코딩 파일 존재하면 바로 실행
    checkEncoded(selectedVideo).then((exists) => {
      if (exists) {
        setupPlayer();
      } else {
        // 없으면 play 이벤트에서 인코딩 후 실행
        video.addEventListener('play', handlePlay);
      }
    });

    // play 이벤트 핸들러 (인코딩 후 플레이어 세팅)
    async function handlePlay() {
      if (encodingStarted) return;
      encodingStarted = true;
      await startEncoding(selectedVideo);
      setupPlayer();
      video!!.removeEventListener('play', handlePlay);
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      if (cleanup) cleanup();
    };
  }, [selectedVideo]);

  return {
    videoRef,
  };
}
