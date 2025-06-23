import { baseApi } from '@shared/lib/axios/axios';
import { useState } from 'react';
import 'video.js/dist/video-js.css';
import VideoPlayer from '../../widgets/video-player/VideoPlayer';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PATH = `${BASE_URL}/stream.m3u8`;

export default function Playback() {
  const [source, setSource] = useState('');

  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  const start = async () => {
    const result = await baseApi.post(`/api/v1/files/video`);

    console.log('Video started:', result.data);

    setSource(PATH);
  };

  const stop = async () => {
    const result = await baseApi.post(`/api/v1/files/video/stop`);

    console.log('Video stopped:', result);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex gap-4 my-2">
        <button
          className="px-6 py-3 border rounded-lg shadow transition cursor-pointer"
          onClick={goHome}
        >
          뒤로가기
        </button>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
          onClick={start}
        >
          Start - 비디오 인코딩 시작
        </button>
        <button
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition cursor-pointer"
          onClick={stop}
        >
          End - 초기 상태로 되돌리기 (인코딩 된 파일 모두 삭제)
        </button>
      </div>
      <main className="flex flex-col items-center w-full">
        <div className="bg-black rounded-xl shadow-lg p-8 flex flex-col items-center">
          <VideoPlayer source={source} />
        </div>
      </main>
    </div>
  );
}
