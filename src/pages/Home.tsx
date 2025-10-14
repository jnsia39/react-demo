import { useState } from 'react';
import VideoList from '../components/VideoList/VideoList';
import RouteTrackingMap from '../components/GoogleMap/RouteTrackingMap';

export default function Home() {
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '15px 20px',
          backgroundColor: '#2c3e50',
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '24px' }}>동선 추적 PoC</h1>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '400px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <VideoList
            onDragStart={() => setIsDraggingVideo(true)}
            onDragEnd={() => setIsDraggingVideo(false)}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            <RouteTrackingMap isDraggingVideo={isDraggingVideo} />
          </div>
        </div>
      </div>
    </div>
  );
}
