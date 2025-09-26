import { VideoMetadata } from '@shared/types/video';

export const extractVideoMetadata = (
  dataTransfer: DataTransfer
): VideoMetadata | null => {
  try {
    const videoMetadata = dataTransfer.getData('video');
    if (!videoMetadata) return null;

    return JSON.parse(videoMetadata);
  } catch (error) {
    console.error('Failed to parse video metadata:', error);
    return null;
  }
};
