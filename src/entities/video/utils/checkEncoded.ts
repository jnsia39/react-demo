import { baseURL } from '@shared/lib/axios/axios';
import axios from 'axios';

export async function checkEncoded(video: string): Promise<boolean> {
  const nameWithoutExt = video.replace(/\.[^/.]+$/, '');
  const source = `${baseURL}/${nameWithoutExt}.m3u8`;
  const noCacheSource = `${source}${
    source.includes('?') ? '&' : '?'
  }_ts=${Date.now()}`;

  try {
    const res = await axios.get(noCacheSource, { method: 'HEAD' });
    return res.data;
  } catch {
    return false;
  }
}
