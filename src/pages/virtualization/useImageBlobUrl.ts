import { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '@shared/lib/axios/axios';

export function useImageBlobUrl(src: string | undefined) {
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!src) {
      setBlobUrl(undefined);
      return;
    }
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBlobUrl(undefined);
    axiosInstance
      .get(src, { responseType: 'blob', signal: controller.signal })
      .then((res) => {
        setBlobUrl(URL.createObjectURL(res.data));
      })
      .catch((e) => {
        if (e.name !== 'CanceledError' && e.name !== 'AbortError') {
          setBlobUrl(undefined);
        }
      });
    return () => {
      controller.abort();
    };
  }, [src]);
  return blobUrl;
}
