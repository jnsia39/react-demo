import { baseApi } from '@shared/lib/axios/axios';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface FileRecord {
  filename: string;
  size: string;
  url: string;
}

export default function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0); // 프로그레스 상태 추가
  const [uploadingFile, setUploadingFile] = useState<File | null>(null); // 업로드 중 파일 상태 추가

  const [uploadedFiles, setUploadedFiles] = useState<FileRecord[]>([]);

  const fetchUploadedFiles = async () => {
    try {
      const response = await baseApi.get('/api/v1/files');
      setUploadedFiles(response.data.records || []);
    } catch (error) {
      console.error('업로드된 파일 목록 가져오기 실패:', error);
      setUploadMsg('업로드된 파일 목록을 가져오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMsg(null);
    setProgress(0); // 진행률 초기화
    setUploadingFile(file); // 업로드 중 파일 설정

    const startTime = Date.now();

    try {
      await axios.put(`http://172.16.7.76/upload/${file.name}`, file, {
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      const formData = new FormData();
      formData.append('file', file, file.name);

      await baseApi.post('/api/v1/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const endTime = Date.now();
      const elapsedSec = ((endTime - startTime) / 1000).toFixed(2);
      setSelectedFile(file || null);
      setUploadMsg(`업로드 성공! (소요 시간: ${elapsedSec}초)`);

      fetchUploadedFiles();
    } catch (err: any) {
      // 상세 에러 메시지 및 상태코드 표시
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message;
      if (status === 502) {
        setUploadMsg('업로드 실패: File uploader가 실행되지 않음');
      } else if (status === 500) {
        setUploadMsg('업로드 실패: 서버 내부 오류');
      } else if (status) {
        setUploadMsg(`업로드 실패 (코드: ${status}): ${msg}`);
      } else {
        setUploadMsg(`업로드 실패: ${msg}`);
      }
    } finally {
      setUploading(false);
      setProgress(0); // 업로드 종료 후 프로그레스 초기화(원하면 유지 가능)
      setUploadingFile(null); // 업로드 끝나면 초기화
    }
  };

  return (
    <div className="flex">
      <div className="min-h-screen flex flex-2 flex-col items-center justify-center gap-2">
        <h1 className="text-lg font-bold">MD Platform Infra</h1>
        <h2 className="text-sm text-gray-600">파일 업로드</h2>
        {/* 파일 업로드 버튼 */}
        {uploading ? (
          <button
            className="inline-flex items-center px-4 py-2 bg-gray-300 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-500 cursor-not-allowed"
            disabled
          >
            업로드 중...
          </button>
        ) : (
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
        )}
        <input
          id="file-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />

        {/* 프로그레스바 표시 */}
        {uploading && (
          <div className="w-64 h-3 bg-gray-200 rounded mt-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* 업로드한 파일 이름 표시 */}
        <div className="text-center">
          <p className="text-xs text-blue-600 ">
            {uploading
              ? uploadingFile?.name // 업로드 중이면 업로드 중인 파일 이름
              : selectedFile
              ? `업로드 파일: ${selectedFile.name}` // 업로드 완료 후 파일 이름
              : ''}
          </p>
          {uploadMsg && <p className="text-xs text-red-500">{uploadMsg}</p>}
        </div>
      </div>
      <div className="h-screen flex flex-1 flex-col items-center justify-center gap-4 bg-gray-50 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4 text-blue-700">
          업로드된 파일 목록
        </h2>
        <ul className="w-full max-w-md space-y-2 overflow-y-auto">
          {uploadedFiles.length === 0 ? (
            <li className="text-gray-400 text-center py-8">
              업로드된 파일이 없습니다.
            </li>
          ) : (
            uploadedFiles.map((file) => (
              <li
                key={file.filename}
                className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-800">
                    {file.filename}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <a
                  href={file.url}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-semibold shadow"
                  type="button"
                  download
                >
                  다운로드
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function formatFileSize(size: string | number): string {
  let bytes = typeof size === 'string' ? parseInt(size, 10) : size;
  if (isNaN(bytes) || bytes < 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `${bytes.toFixed(2)} ${units[i]}`;
}
