import { useEffect } from 'react';

export default function useVideoShortcut({
  video,
}: {
  video: HTMLVideoElement | null;
}) {
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
          video.currentTime = video.currentTime + 1 / fps;
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
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [video]);
}
