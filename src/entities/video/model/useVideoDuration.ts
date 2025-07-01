import { baseApi } from '@shared/lib/axios/axios';
import { useEffect, useState } from 'react';

export default function useVideoDuration({ video }: { video: string }) {
  const [duration, setDuration] = useState<number>(0);

  const getVideoDuration = async () => {
    const response = await baseApi.get(`/api/v1/videos/duration/${video}`);
    return response.data;
  };

  useEffect(() => {
    if (!video) return;

    const fetchDuration = async () => {
      try {
        const duration = await getVideoDuration();
        setDuration(duration);
      } catch (error) {
        console.error('비디오 길이 가져오기 실패:', error);
      }
    };

    fetchDuration();
  }, [video]);

  return {
    duration,
  };
}
