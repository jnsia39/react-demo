import { useState, useCallback, useEffect, useRef } from 'react';
import { VideoFile } from '../types';
import {
  getVideoDuration,
  generateThumbnail,
  createVideoFromFile,
} from '../utils/videoUtils';

interface UseVideoListProps {
  onVideoSelect?: (video: VideoFile) => void;
}

export default function useVideoList({ onVideoSelect }: UseVideoListProps) {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [isLoadingDefault, setIsLoadingDefault] = useState(false);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // 기본 비디오 로드
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

  // 파일 업로드 처리
  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const newVideos: VideoFile[] = [];

    for (const file of Array.from(files)) {
      const video = await createVideoFromFile(file);
      if (video) {
        newVideos.push(video);
      }
    }

    setVideos((prev) => [...prev, ...newVideos]);
  }, []);

  // 드롭 처리
  const handleDrop = useCallback(async (files: FileList) => {
    const newVideos: VideoFile[] = [];

    for (const file of Array.from(files)) {
      if (file.type.startsWith('video/')) {
        const video = await createVideoFromFile(file);
        if (video) {
          newVideos.push(video);
        }
      }
    }

    setVideos((prev) => [...prev, ...newVideos]);
  }, []);

  // 비디오 삭제
  const handleDeleteVideo = useCallback(
    (id: string) => {
      setVideos((prev) => prev.filter((video) => video.id !== id));
      if (selectedVideo?.id === id) {
        setSelectedVideo(null);
      }
    },
    [selectedVideo]
  );

  // 비디오 선택
  const handleVideoClick = useCallback(
    (video: VideoFile) => {
      setSelectedVideo(video);
      onVideoSelect?.(video);

      setTimeout(() => {
        if (videoPlayerRef.current) {
          videoPlayerRef.current.load();
        }
      }, 0);
    },
    [onVideoSelect]
  );

  return {
    videos,
    selectedVideo,
    isLoadingDefault,
    videoPlayerRef,
    handleFileUpload,
    handleDrop,
    handleDeleteVideo,
    handleVideoClick,
  };
}
