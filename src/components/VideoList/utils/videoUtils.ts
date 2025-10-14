import { VideoFile } from '../types';

/**
 * 비디오 길이 가져오기
 */
export function getVideoDuration(url: string): Promise<number> {
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
}

/**
 * 비디오 썸네일 생성
 */
export function generateThumbnail(url: string): Promise<string> {
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
}

/**
 * 파일 크기 포맷팅
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 비디오 길이 포맷팅
 */
export function formatDuration(seconds?: number): string {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 파일로부터 VideoFile 객체 생성
 */
export async function createVideoFromFile(
  file: File
): Promise<VideoFile | null> {
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

  return video;
}
