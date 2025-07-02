import { useEffect, useState } from 'react';

export default function useVideoController({
  video,
}: {
  video: HTMLVideoElement | null;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

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

  return {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    rate,
    setRate,
    muted,
    setMuted,
    current,
    setCurrent,
    duration,
  };
}
