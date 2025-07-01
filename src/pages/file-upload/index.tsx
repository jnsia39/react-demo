import axios from 'axios';
import { useRef, useState } from 'react';

export default function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0); // 프로그레스 상태 추가
  const [uploadingFile, setUploadingFile] = useState<File | null>(null); // 업로드 중 파일 상태 추가

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (inputRef.current) inputRef.current.value = '';
    document.getElementById('file-name')!.textContent = '';

    setUploading(true);
    setUploadMsg(null);
    setProgress(0); // 진행률 초기화
    setUploadingFile(file); // 업로드 중 파일 설정

    const startTime = Date.now();

    try {
      await axios.put(
        `http://172.16.7.76/upload/${file.name}?path=jnsia`,
        file,
        {
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            }
          },
        }
      );

      const endTime = Date.now();
      const elapsedSec = ((endTime - startTime) / 1000).toFixed(2);
      setSelectedFile(file || null);
      setUploadMsg(`업로드 성공! (소요 시간: ${elapsedSec}초)`);
    } catch (err: any) {
      if (err.status === 502) {
        setUploadMsg('업로드 실패: File uploader가 실행되지 않음');
      } else if (err.status === 500) {
        setUploadMsg('업로드 실패: 서버 내부 오류');
      }
    } finally {
      setUploading(false);
      setProgress(0); // 업로드 종료 후 프로그레스 초기화(원하면 유지 가능)
      setUploadingFile(null); // 업로드 끝나면 초기화
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-2">
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
      <span className="text-xs text-blue-600 mt-1">
        {uploading
          ? uploadingFile?.name // 업로드 중이면 업로드 중인 파일 이름
          : selectedFile
          ? `업로드 파일: ${selectedFile.name}` // 업로드 완료 후 파일 이름
          : ''}
      </span>

      <span id="file-name" className="text-xs text-gray-500 mt-1"></span>

      {uploadMsg && (
        <span className="text-xs text-red-500 mt-1">{uploadMsg}</span>
      )}
    </div>
  );
}
