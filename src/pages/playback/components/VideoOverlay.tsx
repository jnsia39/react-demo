import { useEffect, useMemo } from 'react';
import { useVideoAreaSelect } from '../../../features/video/model/useVideoAreaSelect';
import { useVideoStore } from '@pages/playback/store/videoStore';
import { useVideoRect } from '@features/video/model/useVideoRect';
import SelectedArea from '@features/video/ui/SelectedArea';
import { useVideoZoom } from '@features/video/model/useVideoZoom';
import { VideoEditToolbar } from '@features/video/ui/VideoEditToolbar';

interface VideoOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function VideoOverlay({ videoRef }: VideoOverlayProps) {
  const video = videoRef.current;
  if (!video) {
    console.error('Video element is not available');
    return null;
  }

  const { selectedArea, setSelectedArea, editMode, zoom } = useVideoStore();

  const {
    overlayRef,
    renderRect,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleResizeMouseDown,
  } = useVideoAreaSelect({
    video,
    editMode,
    selectedArea,
    setSelectedArea,
  });

  const videoRect = useVideoRect(video);
  const overlaySize = useMemo(() => {
    return {
      width: videoRect.width,
      height: videoRect.height,
      top: videoRect.top,
      left: videoRect.left,
    };
  }, [videoRect, editMode, zoom, video]);

  const { getPanMouseDown } = useVideoZoom({
    editMode,
    videoRect,
    overlaySize,
  });

  const handleClickVideo = () => {
    if (videoRef.current && zoom === 1 && !editMode) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  useEffect(() => {
    setSelectedArea({
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    });
  }, [editMode]);

  return (
    <>
      <VideoEditToolbar />
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          overflow: 'hidden',
          width: overlaySize.width,
          height: overlaySize.height,
          top: overlaySize.top,
          left: overlaySize.left,
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <div
          className="absolute select-none"
          style={{
            pointerEvents: 'auto',
            width: overlaySize.width,
            height: overlaySize.height,
            inset: 0,
            cursor: editMode ? 'crosshair' : zoom > 1 ? 'grab' : 'default',
          }}
          onClick={handleClickVideo}
          onMouseDown={editMode ? handleMouseDown : getPanMouseDown()}
          onMouseMove={editMode ? handleMouseMove : undefined}
          onMouseUp={editMode ? handleMouseUp : undefined}
        >
          <SelectedArea
            renderRect={renderRect}
            editMode={editMode}
            handleResizeMouseDown={handleResizeMouseDown}
          />
        </div>
      </div>
    </>
  );
}
