import VideoController from '@pages/playback/components/VideoController';
import useVideoShortcut from '../../../features/video/model/useVideoShortcut';
import { VideoHelpInfo } from '../../../features/video/ui/VideoHelpInfo';
import { useVideoAreaSelect } from '../../../features/video/model/useVideoAreaSelect';
import { useVideoStore } from '@pages/playback/store/videoStore';
import useVideoZoom from '../../../features/video/model/useVideoZoom';
import { useEffect } from 'react';
import { VideoOverlay } from './VideoOverlay';
import { VideoEditToolbar } from '@features/video/ui/VideoEditToolbar';

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  selectedVideo: string;
}

export function VideoPlayer({ videoRef, selectedVideo }: VideoPlayerProps) {
  const {
    editMode,
    setEditMode,
    panOffset,
    setPanOffset,
    finalRect,
    setFinalRect,
  } = useVideoStore();

  useVideoShortcut({
    video: videoRef.current,
  });

  const videoArea = useVideoAreaSelect({
    videoRef,
    editMode,
    finalRect,
    setFinalRect,
  });

  const { zoom, setZoom } = useVideoZoom({ editMode });

  // panOffset clamp: 비디오가 부모 영역을 벗어나지 않게 제한
  useEffect(() => {
    const containerW = videoArea.containerSize.width || 640;
    const containerH = videoArea.containerSize.height || 360;
    const videoW = containerW * zoom;
    const videoH = containerH * zoom;
    const maxX = Math.max(0, (videoW - containerW) / 2);
    const maxY = Math.max(0, (videoH - containerH) / 2);

    if (panOffset) {
      const clamped = {
        x: Math.max(-maxX, Math.min(maxX, panOffset.x)),
        y: Math.max(-maxY, Math.min(maxY, panOffset.y)),
      };

      if (clamped.x !== panOffset.x || clamped.y !== panOffset.y) {
        setPanOffset(clamped);
      }
    }
  }, [zoom, panOffset, videoArea.containerSize]);

  useEffect(() => {
    if (!editMode) {
      setFinalRect(null);
    }
  }, [editMode, setFinalRect]);

  return (
    <div className="bg-neutral-900 flex flex-col w-full h-full p-2 gap-2">
      <VideoEditToolbar
        editMode={editMode}
        setEditMode={setEditMode}
        rect={videoArea.renderRect}
      />
      <VideoOverlay videoRef={videoRef} editMode={editMode} zoom={zoom}>
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transition: 'transform 0.2s',
            transformOrigin: 'center',
          }}
        />
      </VideoOverlay>
      <div className="w-full mt-2 mb-1">
        <VideoController
          video={videoRef.current}
          selectedVideo={selectedVideo}
          zoom={zoom}
          setZoom={setZoom}
        />
      </div>
      <div className="w-full mt-2">
        <VideoHelpInfo />
      </div>
    </div>
  );
}
