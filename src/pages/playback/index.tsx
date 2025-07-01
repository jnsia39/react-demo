import { VideoPlayer } from './components/VideoPlayer';
import { useState } from 'react';
import useVideoPlayback from '../../features/video/model/useVideoPlayback';
import VideoPlaylist from './components/VideoPlaylist';
import VideoAreaCropper from '@features/video/ui/VideoAreaCropper';
import FrameExtractor from '@features/video/ui/FrameExtractor';
import { VideoEditToolbar } from '@features/video/ui/VideoEditToolbar';
import { VideoOverlay } from './components/VideoOverlay';

export default function Playback() {
  const [selectedVideo, setSelectedVideo] = useState<string>('');

  const onVideoSelect = async (video: string) => {
    setSelectedVideo(video);
  };

  const { videoRef } = useVideoPlayback({ selectedVideo: selectedVideo });

  return (
    <div className="flex w-full h-screen">
      <div className="flex-1">
        <VideoPlaylist selectedVideo={selectedVideo} onSelect={onVideoSelect} />
      </div>
      <div className="flex-4">
        <div className="bg-neutral-900 flex flex-col w-full h-full p-2 gap-2 justify-center items-center">
          <VideoEditToolbar />
          <VideoOverlay videoRef={videoRef} />
          <VideoPlayer videoRef={videoRef} selectedVideo={selectedVideo} />
        </div>
      </div>
      <div className="h-full flex-1 flex-col w-full flex items-center p-2 gap-4">
        <VideoAreaCropper videoRef={videoRef} />
        <hr className="w-full my-4" />
        <FrameExtractor selectedVideo={selectedVideo} />
      </div>
    </div>
  );
}
