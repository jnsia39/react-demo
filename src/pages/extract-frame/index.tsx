import { useState } from 'react';
import VideoPlayer, {
  VideoPlayerState,
} from '@widgets/video-player/VideoPlayer';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '@shared/lib/axios/axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const PATH = `${BASE_URL}/stream.m3u8`;

const API_URL = '/api/v1/files/video/frame';

export default function ExtractFrame() {
  const [frameNumber, setFrameNumber] = useState('1');
  const [videoTime, setVideoTime] = useState('00:00:00.000');

  const [frameImageUrl, setFrameImageUrl] = useState('');
  const [timeImageUrl, setTimeImageUrl] = useState('');

  const [loadingFrame, setLoadingFrame] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false);

  const navigate = useNavigate();

  // 프레임 번호로 이미지 추출
  const handleExtractFrame = async () => {
    setLoadingFrame(true);
    setFrameImageUrl(``);
    try {
      const res = await axiosInstance.get(`${API_URL}?frame=${frameNumber}`);
      setFrameImageUrl(`${BASE_URL}/${res.data}`);
      console.log(`${BASE_URL}/${res.data}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : '프레임 이미지 추출 실패');
    } finally {
      setLoadingFrame(false);
    }
  };

  // 영상 시간으로 이미지 추출
  const handleExtractTime = async () => {
    setLoadingTime(true);
    setTimeImageUrl(``);
    try {
      const res = await axiosInstance.get(`${API_URL}?time=${videoTime}`);
      setTimeImageUrl(`${BASE_URL}/${res.data}`);
      console.log(`${BASE_URL}/${res.data}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : '시간 이미지 추출 실패');
    } finally {
      setLoadingTime(false);
    }
  };

  const handleChangeVideo = (state: VideoPlayerState) => {
    setFrameNumber(Math.floor(state.currentTime * 30).toString());

    console.log(
      `현재 시간: ${state.currentTime}, 프레임 번호: ${Math.floor(
        state.currentTime * 29.97
      )}`
    );
    setVideoTime(
      new Date(state.currentTime * 1000).toISOString().substring(11, 23)
    );
  };

  return (
    <div className="flex min-h-screen justify-center items-center gap-4">
      <div className="bg-black rounded-lg p-4">
        <VideoPlayer source={PATH} onChange={handleChangeVideo} />
      </div>
      <div className="flex gap-4 flex-col w-full max-w-3xl">
        <div>
          <button
            className="px-4 py-1 border rounded hover:bg-gray-300 transition"
            onClick={() => navigate('/')}
            type="button"
          >
            뒤로가기
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">프레임 번호</label>
            <input
              type="number"
              className="border rounded px-3 py-2"
              value={frameNumber}
              onChange={(e) => setFrameNumber(e.target.value)}
              placeholder="예: 123"
            />
            <button
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
              onClick={handleExtractFrame}
              disabled={loadingFrame}
            >
              {loadingFrame ? '추출 중...' : '프레임 이미지 추출'}
            </button>
            <div className="w-full max-w-3xl min-h-[200px] flex items-center justify-center border rounded bg-gray-50 mt-2">
              {frameImageUrl ? (
                <img
                  src={frameImageUrl}
                  alt="프레임 추출 이미지"
                  className="max-w-full max-h-[180px] rounded"
                />
              ) : (
                <span className="text-gray-400">
                  여기에 프레임 추출 이미지가 표시됩니다
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <label className="mb-1 text-sm font-medium">
              영상 시간 (hh:mm:ss.ms)
            </label>
            <input
              className="border rounded px-3 py-2"
              value={videoTime}
              onChange={(e) => setVideoTime(e.target.value)}
              placeholder="예: 00:00:10.000"
            />
            <button
              className="mt-2 px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
              onClick={handleExtractTime}
              disabled={loadingTime}
            >
              {loadingTime ? '추출 중...' : '시간 이미지 추출'}
            </button>
            <div className="w-full max-w-3xl min-h-[200px] flex items-center justify-center border rounded bg-gray-50 mt-2">
              {timeImageUrl ? (
                <img
                  src={timeImageUrl}
                  alt="시간 추출 이미지"
                  className="max-w-full max-h-[180px] rounded"
                />
              ) : (
                <span className="text-gray-400">
                  여기에 시간 추출 이미지가 표시됩니다
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
