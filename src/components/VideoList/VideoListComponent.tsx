import React, { useState, useRef, useCallback, useEffect } from 'react';

export interface VideoFile {
  id: string;
  name: string;
  url: string;
  duration?: number;
  thumbnail?: string;
  size: number;
}

interface VideoListComponentProps {
  onVideoSelect?: (video: VideoFile) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export default function VideoListComponent({
  onVideoSelect,
  onDragStart,
  onDragEnd,
}: VideoListComponentProps) {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingDefault, setIsLoadingDefault] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // Load default videos from public folder
  useEffect(() => {
    const loadDefaultVideos = async () => {
      setIsLoadingDefault(true);
      const defaultVideos = ['Sample_1.mp4', 'Sample_2.mp4', 'Sample_3.mp4'];
      const loadedVideos: VideoFile[] = [];

      for (const filename of defaultVideos) {
        try {
          const url = `/${filename}`;
          const response = await fetch(url, { method: 'HEAD' });

          if (response.ok) {
            const video: VideoFile = {
              id: `default_${filename}`,
              name: filename,
              url,
              size: parseInt(response.headers.get('content-length') || '0'),
            };

            // Get duration and thumbnail
            try {
              video.duration = await getVideoDuration(url);
              video.thumbnail = await generateThumbnail(url);
            } catch (error) {
              console.warn(`Could not get metadata for ${filename}:`, error);
            }

            loadedVideos.push(video);
          }
        } catch (error) {
          console.warn(`Could not load default video ${filename}:`, error);
        }
      }

      setVideos(loadedVideos);
      setIsLoadingDefault(false);
    };

    loadDefaultVideos();
  }, []);

  const getVideoDuration = useCallback((url: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        resolve(video.duration);
      };

      video.onerror = () => {
        reject(new Error('Failed to load video metadata'));
      };

      video.src = url;
    });
  }, []);

  const generateThumbnail = useCallback((url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        video.currentTime = Math.min(1, video.duration * 0.1);
      });

      video.addEventListener('seeked', () => {
        context.drawImage(video, 0, 0);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
      });

      video.addEventListener('error', () => {
        reject(new Error('Failed to generate thumbnail'));
      });

      video.src = url;
    });
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const formatDuration = useCallback((seconds?: number): string => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const newVideos: VideoFile[] = [];

      for (const file of Array.from(files)) {
        const url = URL.createObjectURL(file);
        const video: VideoFile = {
          id: `${Date.now()}_${file.name}`,
          name: file.name,
          url,
          size: file.size,
        };

        try {
          video.duration = await getVideoDuration(url);
          video.thumbnail = await generateThumbnail(url);
        } catch (error) {
          console.warn(`Could not get metadata for ${file.name}:`, error);
        }

        newVideos.push(video);
      }

      setVideos((prev) => [...prev, ...newVideos]);

      // Reset file input
      event.target.value = '';
    },
    [getVideoDuration, generateThumbnail]
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;

      const newVideos: VideoFile[] = [];

      for (const file of Array.from(files)) {
        if (file.type.startsWith('video/')) {
          const url = URL.createObjectURL(file);
          const video: VideoFile = {
            id: `${Date.now()}_${file.name}`,
            name: file.name,
            url,
            size: file.size,
          };

          try {
            video.duration = await getVideoDuration(url);
            video.thumbnail = await generateThumbnail(url);
          } catch (error) {
            console.warn(`Could not get metadata for ${file.name}:`, error);
          }

          newVideos.push(video);
        }
      }

      setVideos((prev) => [...prev, ...newVideos]);
    },
    [getVideoDuration, generateThumbnail]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleDeleteVideo = useCallback(
    (id: string) => {
      setVideos((prev) => prev.filter((video) => video.id !== id));
      if (selectedVideo?.id === id) {
        setSelectedVideo(null);
        setIsPlaying(false);
      }
    },
    [selectedVideo]
  );

  const handleVideoClick = useCallback(
    (video: VideoFile) => {
      setSelectedVideo(video);
      setIsPlaying(false);
      onVideoSelect?.(video);

      setTimeout(() => {
        if (videoPlayerRef.current) {
          videoPlayerRef.current.load();
        }
      }, 0);
    },
    [onVideoSelect]
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            margin: '0 0 12px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
          }}
        >
          비디오 파일 목록
        </h2>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          비디오 파일 추가
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isLoadingDefault ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid #f3f4f6',
                borderTop: '3px solid #3B82F6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '12px',
              }}
            />
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
              샘플 비디오 로딩 중...
            </p>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : videos.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6B7280',
            }}
          >
            <p style={{ fontSize: '16px', margin: '0 0 8px 0' }}>
              비디오 파일이 없습니다
            </p>
            <p style={{ fontSize: '14px', margin: 0 }}>
              파일을 추가하거나 여기로 드래그하세요
            </p>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '8px',
                backgroundColor: '#EBF8FF',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#1E40AF',
                border: '1px dashed #60A5FA',
              }}
            >
              🎯 비디오를 지도의 마커로 드래그하여 연결하세요
            </div>

            {videos.map((video) => (
              <div
                key={video.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    'video',
                    JSON.stringify({
                      id: video.id,
                      name: video.name,
                      url: video.url,
                      duration: video.duration,
                      thumbnail: video.thumbnail,
                      size: video.size,
                    })
                  );
                  e.dataTransfer.effectAllowed = 'copy';
                  e.currentTarget.style.opacity = '0.5';
                  e.currentTarget.style.cursor = 'grabbing';
                  onDragStart?.();
                }}
                onDragEnd={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.cursor = 'grab';
                  onDragEnd?.();
                }}
                onClick={() => handleVideoClick(video)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor:
                    selectedVideo?.id === video.id ? '#EBF8FF' : 'white',
                  border: `1px solid ${
                    selectedVideo?.id === video.id ? '#3B82F6' : '#e5e7eb'
                  }`,
                  borderRadius: '8px',
                  cursor: 'grab',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedVideo?.id !== video.id) {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedVideo?.id !== video.id) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '40px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    marginRight: '12px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#6B7280',
                      }}
                    >
                      No Preview
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#111827',
                      marginBottom: '4px',
                    }}
                  >
                    {video.name}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      display: 'flex',
                      gap: '12px',
                    }}
                  >
                    <span>{formatFileSize(video.size)}</span>
                    <span>{formatDuration(video.duration)}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteVideo(video.id);
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      {selectedVideo && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'white',
            borderTop: '1px solid #e5e7eb',
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
            }}
          >
            미리보기: {selectedVideo.name}
          </h3>
          <div style={{ marginBottom: '12px' }}>
            <video
              ref={videoPlayerRef}
              src={selectedVideo.url}
              style={{
                width: '100%',
                maxHeight: '200px',
                backgroundColor: '#000',
                borderRadius: '4px',
              }}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
