import { baseApi } from '@shared/lib/axios/axios';

const API_URL = '/api/v1/videos';

export const startEncoding = async (filename: string) => {
  return await baseApi.post(`${API_URL}/encode?filename=${filename}`);
};
