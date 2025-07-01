import { baseApi } from '@shared/lib/axios/axios';
import { useQuery } from '@tanstack/react-query';

export default function useVideoList() {
  return useQuery({
    queryKey: ['videoList'],
    queryFn: async () => {
      const response = await baseApi.get('/api/v1/files/video');

      if (response.status !== 200) {
        throw new Error('Failed to fetch video list');
      }

      return response.data;
    },
    retry: 0,
  });
}
