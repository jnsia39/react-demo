import { useEffect, useRef, useState } from 'react';
import { cloudApi } from '@shared/lib/axios/axios';

export function useImageBlobUrl(src: string | undefined) {
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);
  const prevUrlRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!src) {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = undefined;
      }
      setBlobUrl(undefined);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    cloudApi
      .get(src, { responseType: 'blob', signal: controller.signal })
      .then((res) => {
        if (prevUrlRef.current) {
          URL.revokeObjectURL(prevUrlRef.current);
        }
        const url = URL.createObjectURL(res.data);
        prevUrlRef.current = url;
        setBlobUrl(url);
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

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
    };
  }, []);

  return blobUrl;
}
