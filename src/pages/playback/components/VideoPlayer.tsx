import VideoController from '@pages/playback/components/VideoController';
import { useVideoStore } from '@pages/playback/store/videoStore';
import { useEffect } from 'react';
import useVideoShortcut from '@features/video/model/useVideoShortcut';
import { VideoHelpInfo } from '@features/video/ui/VideoHelpInfo';

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  selectedVideo: string;
}

export function VideoPlayer({ videoRef, selectedVideo }: VideoPlayerProps) {
  const { setEditMode, panOffset, zoom, setZoom } = useVideoStore();

  useVideoShortcut({
    video: videoRef.current,
  });

  useEffect(() => {
    setEditMode(false);
    setZoom(1);
  }, [selectedVideo]);

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="relative w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          style={{
            width: '100%',
            objectFit: 'contain',
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transition: 'transform 0.2s',
            transformOrigin: 'center',
          }}
        />
      </div>
      <VideoController
        video={videoRef.current}
        selectedVideo={selectedVideo}
        zoom={zoom}
        setZoom={setZoom}
      />
      <VideoHelpInfo />
    </div>
  );
}
