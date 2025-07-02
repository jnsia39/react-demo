import { useEffect, useState } from 'react';

export function useVideoRect(video: HTMLVideoElement | null) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!video) return;

    const update = () => setRect(video.getBoundingClientRect());
    update();

    const resizeObserver = new window.ResizeObserver(update);
    resizeObserver.observe(video);

    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [video]);

  return rect ?? { width: 640, height: 360, top: 0, left: 0 };
}
