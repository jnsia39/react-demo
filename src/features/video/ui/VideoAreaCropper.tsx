import { useVideoStore } from '@pages/playback/store/videoStore';
import { RefObject } from 'react';
import useVideoAreaCrop from '../model/useVideoAreaCrop';

interface VideoAreaCropperProps {
  videoRef: RefObject<HTMLVideoElement>;
}

export default function VideoAreaCropper({ videoRef }: VideoAreaCropperProps) {
  const { selectedArea } = useVideoStore();

  const { croppedUrl, handleExtract } = useVideoAreaCrop({
    videoRef,
  });

  return (
    <div className="flex flex-col items-center w-full gap-2">
      <button
        className="px-4 py-2 bg-blue-600 text-white disabled:bg-gray-300 cursor-pointer hover:bg-blue-700 transition-colors border"
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
        className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors border"
      >
        이미지 다운로드
      </a>
    </div>
  );
}
