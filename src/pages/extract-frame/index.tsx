import { useRef, useState } from 'react';
import VideoPlayer from '@pages/playback/components/VideoPlayer';

export default function ExtractFrame() {
  const [frameNumber, setFrameNumber] = useState('');
  const [videoTime, setVideoTime] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const videoPlayerRef = useRef<any>(null);

  // 예시: 이미지 추출 API 호출 (실제 API에 맞게 수정 필요)
  const handleExtract = async () => {
    setLoading(true);
    try {
      // 실제로는 frameNumber, videoTime을 서버에 전달하여 이미지 추출
      // 아래는 예시 URL (API에 맞게 수정)
      const res = await fetch(
        `/api/v1/extract-frame?frame=${frameNumber}&time=${videoTime}`
      );
      const data = await res.json();
      setImageUrl(data.imageUrl); // 서버에서 반환하는 이미지 URL
    } catch (e) {
      alert('이미지 추출 실패');
    } finally {
      setLoading(false);
    }
  };

  // blur 시 영상 시간 이동
  const handleFrameBlur = () => {
    // 프레임 번호를 시간(초)로 변환하는 로직 필요 (예: 30fps)
    const fps = 30;
    const frame = parseInt(frameNumber, 10);
    if (!isNaN(frame) && videoPlayerRef.current) {
      const sec = frame / fps;
      videoPlayerRef.current.setCurrentTime?.(sec);
    }
  };
  const handleTimeBlur = () => {
    const sec = parseFloat(videoTime);
    if (!isNaN(sec) && videoPlayerRef.current) {
      videoPlayerRef.current.setCurrentTime?.(sec);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center gap-4">
      <div>
        <VideoPlayer source="" />
      </div>
      <div className="flex gap-4 flex-col w-full max-w-3xl">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">프레임 번호</label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={frameNumber}
            onChange={(e) => setFrameNumber(e.target.value)}
            onBlur={handleFrameBlur}
            placeholder="예: 123"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">영상 시간 (초)</label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={videoTime}
            onChange={(e) => setVideoTime(e.target.value)}
            onBlur={handleTimeBlur}
            placeholder="예: 12.34"
          />
        </div>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          onClick={handleExtract}
          disabled={loading}
        >
          {loading ? '추출 중...' : '이미지 추출'}
        </button>
        <div className="w-full max-w-3xl min-h-[400px] flex items-center justify-center border rounded bg-gray-50 mt-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="추출된 프레임"
              className="max-w-full max-h-[400px] rounded"
            />
          ) : (
            <span className="text-gray-400">
              여기에 추출된 이미지가 표시됩니다
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
