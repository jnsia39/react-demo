import { baseApi } from '@shared/lib/axios/axios';

const API_URL = '/api/v1/files/video';

export const startEncoding = async (filename: string) => {
  return await baseApi.post(`${API_URL}/encode?filename=${filename}`);
};
