import { baseApi } from '@shared/lib/axios/axios';
import { useState, useRef } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = '/api/v1/videos/frame';

export default function FrameExtractor({
  selectedVideo,
}: {
  selectedVideo: string;
}) {
  const [frameNumbers, setFrameNumbers] = useState<number[]>([1]);
  const [inputValue, setInputValue] = useState('');
  const [frameImageUrl, setFrameImageUrl] = useState([]);
  const [loadingFrame, setLoadingFrame] = useState(false);
  const [inputError, setInputError] = useState('');
  const [extractTime, setExtractTime] = useState<{
    start?: number;
    end?: number;
    ms?: number;
  }>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExtractFrame = async () => {
    setLoadingFrame(true);
    setFrameImageUrl([]);
    setExtractTime({});
    const start = Date.now();
    try {
      const res = await baseApi.get(`${API_URL}/${selectedVideo}`, {
        params: { frames: frameNumbers },
      });
      const end = Date.now();
      setExtractTime({ start, end, ms: end - start });
      setFrameImageUrl(res.data);
    } catch (e) {
      alert(e instanceof Error ? e.message : '프레임 이미지 추출 실패');
    } finally {
      setLoadingFrame(false);
    }
  };

  // 엔터 또는 쉼표 입력 시 프레임 번호 추가
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const values = inputValue
        .split(/[\s,]+/)
        .map((v) => v.trim())
        .filter((v) => v !== '')
        .map(Number);
      const valid = values.filter((n) => !isNaN(n) && n > 0);
      if (valid.length === 0) {
        setInputError('올바른 숫자를 입력하세요.');
        return;
      }

      const newNumbers = valid.filter((n) => !frameNumbers.includes(n));
      if (newNumbers.length === 0) {
        setInputError('이미 추가된 프레임입니다.');
        return;
      }

      setFrameNumbers((prev) =>
        Array.from(new Set([...prev, ...newNumbers])).sort((a, b) => a - b)
      );
      setInputValue('');
      setInputError('');
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setInputError('');
  };

  // 태그(X) 클릭 시 삭제
  const handleRemoveFrame = (num: number) => {
    setFrameNumbers((prev) => prev.filter((n) => n !== num));
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full min-h-0">
      <div className="flex flex-col w-full">
        <label className="mb-1 text-sm font-medium">프레임 번호</label>
        <input
          ref={inputRef}
          type="text"
          className={`border px-2 py-1 focus:border-blue-500 outline-none transition ${
            inputError ? 'border-red-400' : ''
          }`}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="프레임 번호 입력 후 Enter, 쉼표/공백 구분"
        />
        {inputError && (
          <span className="text-xs text-red-500 mt-1">{inputError}</span>
        )}
        {/* 태그 리스트 */}
        <div className="flex flex-wrap gap-2 mt-2">
          {frameNumbers.map((num) => (
            <span
              key={num}
              className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-300"
            >
              {num}
              <button
                type="button"
                className="ml-1 text-blue-500 hover:text-red-500 focus:outline-none"
                onClick={() => handleRemoveFrame(num)}
                aria-label="프레임 삭제"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      <button
        className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
        onClick={handleExtractFrame}
        disabled={loadingFrame}
      >
        {loadingFrame ? '추출 중...' : '프레임 이미지 추출'}
      </button>
      {extractTime.start && extractTime.end && (
        <div className="text-xs text-gray-500 mt-1">
          시작: {new Date(extractTime.start).toLocaleTimeString()}
          <br />
          종료: {new Date(extractTime.end).toLocaleTimeString()}
          <br />
          소요 시간: {extractTime.ms}ms
        </div>
      )}
      <div className="flex-1 min-h-0 w-full flex flex-col gap-2 items-stretch justify-start border p-2 overflow-y-auto bg-white">
        {frameImageUrl.length > 0 ? (
          frameImageUrl.map((url, index) => (
            <div key={index} className="w-full flex flex-col items-center">
              <img
                src={`${BASE_URL}/${url}`}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
              <span className="text-xs text-gray-500">
                프레임 {frameNumbers[index]}
              </span>
            </div>
          ))
        ) : (
          <span className="text-gray-400">프레임 추출 이미지</span>
        )}
      </div>
    </div>
  );
}
