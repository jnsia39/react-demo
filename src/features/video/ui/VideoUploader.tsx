import { baseApi } from '@shared/lib/axios/axios';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

const API_URL = '/api/v1/files/video/upload';

export default function VideoUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const queryClient = useQueryClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('선택된 파일:', file);
    if (!file) return;

    setUploading(true);

    const startTime = Date.now();

    try {
      const formData = new FormData();

      formData.append('video', file);

      await baseApi.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      const endTime = Date.now();
      const elapsedSec = ((endTime - startTime) / 1000).toFixed(2);

      console.log(`업로드 성공! (소요 시간: ${elapsedSec}초)`);
      queryClient.invalidateQueries({ queryKey: ['videoList'] });
    } catch (e: any) {
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {uploading ? (
        <div className="w-full bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full px-4 py-2 bg-blue-500 transition-all truncate"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors"
        >
          <UploadIcon />
          파일 선택
        </label>
      )}
      <input
        id="file-upload"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      className="w-5 h-5 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
      />
    </svg>
  );
}
