import { useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { VideoFile } from '../types';

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
      // 비디오 데이터 설정
      e.dataTransfer.setData('video', JSON.stringify(video));
      e.dataTransfer.effectAllowed = 'copy';

      // React 컴포넌트를 DOM 요소로 렌더링
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-1000px';
      container.style.left = '-1000px';

      const root = ReactDOM.createRoot(container);
      root.render(<DragPreview videoName={video.name} />);

      document.body.appendChild(container);

      // React 렌더링이 완료될 때까지 대기
      requestAnimationFrame(() => {
        const previewElement = container.firstChild as HTMLElement;
        if (previewElement) {
          e.dataTransfer.setDragImage(previewElement, 0, 0);
        }

        // 드래그가 시작된 후 제거
        setTimeout(() => {
          if (document.body.contains(container)) {
            document.body.removeChild(container);
          }
        }, 0);
      });

      // 원본 요소 스타일 변경
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
