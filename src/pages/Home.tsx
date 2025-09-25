import { useState } from 'react';
import GoogleMapComponent from '../components/GoogleMap/GoogleMapComponent';
import VideoListComponent from '../components/VideoList/VideoListComponent';

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  const handleVideoSelect = (video: any) => {
    setSelectedVideo(video);
    console.log('Selected video:', video.name);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* 비디오 리스트 - 왼쪽 */}
      <div
        style={{
          width: '350px',
          flexShrink: 0,
          backgroundColor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#2c3e50',
            color: 'white',
            borderBottom: '1px solid #34495e',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            📹 비디오 목록
          </h2>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <VideoListComponent
            onVideoSelect={handleVideoSelect}
            onDragStart={() => setIsDraggingVideo(true)}
            onDragEnd={() => setIsDraggingVideo(false)}
          />
        </div>
      </div>

      {/* 지도 - 오른쪽 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#34495e',
            color: 'white',
            borderBottom: '1px solid #2c3e50',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>
            🗺️ 인터랙티브 맵
          </h1>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <GoogleMapComponent isDraggingVideo={isDraggingVideo} />
        </div>
      </div>
    </div>
  );
}
