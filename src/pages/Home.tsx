import { ROUTES } from '@shared/config/routes';
import { baseApi } from '@shared/lib/axios/axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api/v1/files/video/upload';

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  const changePage = (path: string) => {
    navigate(path);
  };

  const uploadVideo = async () => {
    if (!selectedFile) {
      setUploadMsg('업로드할 동영상을 선택하세요.');
      return;
    }
    setUploading(true);
    setUploadMsg(null);

    try {
      const formData = new FormData();

      formData.append('video', selectedFile);

      await baseApi.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMsg('업로드 성공!');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      document.getElementById('file-name')!.textContent = '';
    } catch (e: any) {
      setUploadMsg('업로드 실패: ' + (e?.response?.data?.message || e.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
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
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            setSelectedFile(file || null);
            if (file) {
              document.getElementById('file-name')!.textContent = file.name;
            } else {
              document.getElementById('file-name')!.textContent = '';
            }
          }}
        />
        <span id="file-name" className="text-xs text-gray-500 mt-1"></span>
        <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300"
          onClick={uploadVideo}
          disabled={uploading || !selectedFile}
        >
          {uploading ? '업로드 중...' : '동영상 업로드'}
        </button>
        {uploadMsg && (
          <span className="text-xs text-red-500 mt-1">{uploadMsg}</span>
        )}
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => changePage(ROUTES.VIRTUALIZATION)}
      >
        VIRTUALIZATION
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => changePage(ROUTES.PLAYBACK)}
      >
        PLAYBACK
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => changePage(ROUTES.EXTRACT_FRAME)}
      >
        EXTRACT_FRAME
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => changePage(ROUTES.VIDEO_AREA_SELECT)}
      >
        VIDEO_AREA_SELECT
      </button>
    </div>
  );
}
