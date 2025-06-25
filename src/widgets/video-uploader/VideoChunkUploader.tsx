import { baseApi } from '@shared/lib/axios/axios';
import React, { useRef, useState } from 'react';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

const API_URL = '/api/v1/files/video/upload';

function chunkFile(file: File, chunkSize: number) {
  const chunks = [];

  let offset = 0;

  while (offset < file.size) {
    chunks.push(file.slice(offset, offset + chunkSize));
    offset += chunkSize;
  }

  return chunks;
}

export default function VideoChunkUploader() {
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  const uploadVideo = async () => {
    if (!selectedFile) {
      setUploadMsg('업로드할 동영상을 선택하세요.');
      return;
    }

    const startTime = Date.now();

    try {
      const formData = new FormData();

      formData.append('video', selectedFile);

      await baseApi.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (e: any) {
      setUploadMsg('업로드 실패: ' + (e?.response?.data?.message || e.message));
    } finally {
      setUploading(false);
    }

    const endTime = Date.now();
    const elapsedSec = ((endTime - startTime) / 1000).toFixed(2);
    setUploadMsg(`업로드 성공! (소요 시간: ${elapsedSec}초)`);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('선택한 파일:', file);
    if (!file) return;

    if (inputRef.current) inputRef.current.value = '';
    document.getElementById('file-name')!.textContent = '';

    setUploading(true);
    setUploadMsg(null);

    const startTime = Date.now();

    const chunks = chunkFile(file, CHUNK_SIZE);
    const MAX_PARALLEL = 4; // 동시에 업로드할 청크 개수
    let progressCount = 0;

    // 병렬 업로드 함수
    const uploadChunk = async (chunk: Blob, index: number) => {
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('index', String(index));
      formData.append('total', String(chunks.length));
      await baseApi.post(`${API_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      progressCount++;
      setProgress(Math.round((progressCount / chunks.length) * 100));
    };

    // 병렬 업로드 컨트롤
    const queue = Array.from(
      { length: Math.ceil(chunks.length / MAX_PARALLEL) },
      (_, i) => chunks.slice(i * MAX_PARALLEL, (i + 1) * MAX_PARALLEL)
    );

    for (const group of queue) {
      await Promise.all(
        group.map((chunk, idx) =>
          uploadChunk(chunk, queue.indexOf(group) * MAX_PARALLEL + idx)
        )
      );
    }

    const endTime = Date.now();
    const elapsedSec = ((endTime - startTime) / 1000).toFixed(2);

    setSelectedFile(file || null);
    if (file) {
      document.getElementById('file-name')!.textContent = file.name;
    } else {
      document.getElementById('file-name')!.textContent = '';
    }

    setUploadMsg(`업로드 성공! (소요 시간: ${elapsedSec}초)`);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2 text-blue-500"
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
        파일 선택
      </label>
      <input
        id="file-upload"
        type="file"
        accept="video/*"
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
      />
      <div>업로드 진행률: {progress}%</div>
      <span id="file-name" className="text-xs text-gray-500 mt-1"></span>
      <button
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300"
        onClick={uploadVideo}
        // disabled={!uploading}
      >
        {uploading ? '업로드 중...' : '동영상 업로드'}
      </button>
      {uploadMsg && (
        <span className="text-xs text-red-500 mt-1">{uploadMsg}</span>
      )}
    </div>
  );
}
