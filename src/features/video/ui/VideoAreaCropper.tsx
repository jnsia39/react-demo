import { useVideoStore } from '@pages/playback/store/videoStore';
import { RefObject, useState } from 'react';

interface VideoAreaCropperProps {
  videoRef: RefObject<HTMLVideoElement>;
}

export default function VideoAreaCropper({ videoRef }: VideoAreaCropperProps) {
  const [croppedUrl, setCroppedUrl] = useState<string>('');

  const { selectedArea } = useVideoStore();

  const handleExtract = () => {
    if (!selectedArea || !videoRef.current) return;
    const video = videoRef.current;

    const sx = (selectedArea.x / 100) * video.videoWidth;
    const sy = (selectedArea.y / 100) * video.videoHeight;
    const sw = (selectedArea.w / 100) * video.videoWidth;
    const sh = (selectedArea.h / 100) * video.videoHeight;

    // 캔버스 생성 및 크기 지정
    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 비디오에서 해당 영역을 캔버스로 복사
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

    // 이미지 URL 생성
    setCroppedUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div className="flex flex-col items-center w-full gap-2">
      <button
        className="px-4 py-2 bg-blue-600 text-white disabled:bg-gray-300 cursor-pointer hover:bg-blue-700 transition-colors"
        onClick={handleExtract}
        disabled={!selectedArea || selectedArea.w === 0 || selectedArea.h === 0}
      >
        선택 영역 이미지로 추출
      </button>
      <div className="w-full h-full border flex flex-1 items-center justify-center bg-white">
        {croppedUrl ? (
          <img
            src={croppedUrl}
            alt="추출된 영역 미리보기"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        ) : (
          <div className="flex w-full h-full min-h-[200px] justify-center items-center text-gray-400">
            미리보기 없음
          </div>
        )}
      </div>
      <a
        href={croppedUrl}
        download={
          selectedArea
            ? `cropped_${Math.round(selectedArea.x)}_${Math.round(
                selectedArea.y
              )}_${Math.round(selectedArea.w)}x${Math.round(
                selectedArea.h
              )}.png`
            : 'cropped.png'
        }
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        이미지 다운로드
      </a>
    </div>
  );
}
