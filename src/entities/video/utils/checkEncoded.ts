import { baseURL } from '@shared/lib/axios/axios';
import axios from 'axios';

export async function checkEncoded(video: string): Promise<boolean> {
  const nameWithoutExt = video.replace(/\.[^/.]+$/, '');
  const source = `${baseURL}/${nameWithoutExt}.m3u8`;

  try {
    const res = await axios.get(source, { method: 'HEAD' });
    return res.data;
  } catch {
    return false;
  }
}
