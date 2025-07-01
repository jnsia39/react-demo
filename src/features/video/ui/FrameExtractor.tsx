import { baseApi } from '@shared/lib/axios/axios';
import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = '/api/v1/videos/frame';

export default function FrameExtractor({
  selectedVideo,
}: {
  selectedVideo: string;
}) {
  const [frameNumbers, setFrameNumbers] = useState<string>('1');
  const [frameImageUrl, setFrameImageUrl] = useState([]);
  const [loadingFrame, setLoadingFrame] = useState(false);

  const handleExtractFrame = async () => {
    setLoadingFrame(true);
    setFrameImageUrl([]);
    try {
      // 쉼표, 공백 기준으로 분리 후 숫자만 추출
      const frames = frameNumbers
        .split(/[,\s]+/)
        .map((f) => f.trim())
        .filter((f) => f !== '')
        .map(Number)
        .filter((n) => !isNaN(n));
      const res = await baseApi.get(`${API_URL}/${selectedVideo}`, {
        params: { frames },
      });
      setFrameImageUrl(res.data);
    } catch (e) {
      alert(e instanceof Error ? e.message : '프레임 이미지 추출 실패');
    } finally {
      setLoadingFrame(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-2 w-full h-full">
      <div className="flex flex-col w-full">
        <label className="mb-1 text-sm font-medium">
          프레임 번호 (여러 개: 1, 10, 20)
        </label>
        <input
          type="text"
          className="border px-3 py-2"
          value={frameNumbers}
          onChange={(e) => setFrameNumbers(e.target.value)}
          placeholder="예: 1, 10, 20"
        />
      </div>
      <button
        className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
        onClick={handleExtractFrame}
        disabled={loadingFrame}
      >
        {loadingFrame ? '추출 중...' : '프레임 이미지 추출'}
      </button>
      <div className="w-full h-100 flex flex-col gap-4 items-center justify-center border p-2 overflow-y-auto">
        {frameImageUrl.length > 0 ? (
          frameImageUrl.map((url, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={`${BASE_URL}/${url}`}
                alt={`프레임 추출 이미지 ${index + 1}`}
                className="w-48 h-auto rounded shadow mb-2 border"
                style={{ maxWidth: 200 }}
              />
              <span className="text-xs text-gray-500">프레임 {index + 1}</span>
            </div>
          ))
        ) : (
          <span className="text-gray-400">프레임 추출 이미지</span>
        )}
      </div>
    </div>
  );
}
