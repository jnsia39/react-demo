import { useCallback } from 'react';
import { VideoFile } from '../types';
import ReactDOM from 'react-dom/client';
import DragPreview from '../components/DragPreview';

interface UseVideoDragPreviewProps {
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export default function useVideoDragPreview({
  onDragStart,
  onDragEnd,
}: UseVideoDragPreviewProps = {}) {
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, video: VideoFile) => {
      e.dataTransfer.setData('video', JSON.stringify(video));
      e.dataTransfer.effectAllowed = 'copy';

      const dragPreview = document.createElement('div');
      dragPreview.style.position = 'absolute';
      dragPreview.style.top = '-1000px';
      dragPreview.style.left = '-1000px';

      const root = ReactDOM.createRoot(dragPreview);
      root.render(<DragPreview videoName={video.name} />);

      document.body.appendChild(dragPreview);
      e.dataTransfer.setDragImage(dragPreview, 0, 0);

      setTimeout(() => {
        if (document.body.contains(dragPreview)) {
          document.body.removeChild(dragPreview);
        }
      }, 0);

      e.currentTarget.style.opacity = '0.4';
      e.currentTarget.style.transform = 'scale(0.95)';

      onDragStart?.();
    },
    [onDragStart]
  );

  const handleDragEnd = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      // 원래 스타일로 복원
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = 'scale(1)';

      onDragEnd?.();
    },
    [onDragEnd]
  );

  return {
    handleDragStart,
    handleDragEnd,
  };
}
