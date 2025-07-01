import { VideoPlayer } from './components/VideoPlayer';
import { useState } from 'react';
import useVideoPlayback from '../../features/video/model/useVideoPlayback';
import VideoPlaylist from './components/VideoPlaylist';
import VideoAreaCropper from '@features/video/ui/VideoAreaCropper';
import FrameExtractor from '@features/video/ui/FrameExtractor';

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
        <VideoPlayer videoRef={videoRef} selectedVideo={selectedVideo} />
      </div>
      <div className="h-full flex-1 flex-col w-full flex items-center p-2 gap-4">
        <VideoAreaCropper videoRef={videoRef} />
        <hr className="w-full my-4" />
        <FrameExtractor selectedVideo={selectedVideo} />
      </div>
    </div>
  );
}
