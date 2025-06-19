import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import VideoCommandDescription from './VideoCommandDescription';
import VideoPlayerController from './VideoPlayerController';

const BASE_URL = import.meta.env.VITE_API_URL;
const PATH = `${BASE_URL}/stream.m3u8`;

export default function VideoPlayer({ source }: { source: string }) {
  const videoRef = useRef<any>(null);
  const playerRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleVideoClick = () => {
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  };

  const changeMuted = (value: boolean) => {
    setMuted(value);
  };

  const changeVolume = (value: number) => {
    setVolume(value);
  };

  const changeRate = (value: number) => {
    setRate(value);
  };

  const changeCurrentTime = (time: number) => {
    setCurrent(time);
  };

  useEffect(() => {
    if (source && playerRef.current) {
      playerRef.current.src({
        src: source,
        type: 'application/x-mpegURL',
      });
      playerRef.current.play();
    }
  }, [source]);

  useEffect(() => {
    if (!playerRef.current) {
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

      playerRef.current.on('error', (e: any) => {
        console.error('Video.js error:', e);
      });

      playerRef.current.on('ready', () => {
        console.log('Video.js player is ready');
      });

      playerRef.current.on('dispose', () => {
        console.log('Video.js player disposed');
      });
    }

    const player = playerRef.current;

    const update = () => {
      setCurrent(player.currentTime());
      setDuration(player.duration());
      setMuted(player.muted());
    };

    if (player) {
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
    }

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

  return (
    <>
      <div data-vjs-player className="mb-4 w-full flex justify-center">
        <video
          className="video-js vjs-default-skin rounded-lg shadow-lg cursor-pointer border-4 border-black"
          ref={videoRef}
          width={900}
          height={520}
          controls
          onClick={handleVideoClick}
          style={{ background: '#181818' }}
        />
        <VideoPlayerController
          player={playerRef.current}
          isPlaying={isPlaying}
          volume={volume}
          rate={rate}
          muted={muted}
          current={current}
          duration={duration}
          changeCurrentTime={changeCurrentTime}
          changeMuted={changeMuted}
          changeVolume={changeVolume}
          changeRate={changeRate}
        />
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <VideoCommandDescription />
      </div>
    </>
  );
}
