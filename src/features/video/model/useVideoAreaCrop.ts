import { useVideoStore } from '@pages/playback/store/videoStore';
import { useState } from 'react';

export default function useVideoAreaCrop({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  const [croppedUrl, setCroppedUrl] = useState<string>('');

  const { selectedArea, zoom, panOffset } = useVideoStore();

  const handleExtract = () => {
    if (!selectedArea || !videoRef.current) return;
    const video = videoRef.current;

    // 오버레이(화면) 크기와 비디오 실제 크기
    const overlayW = video.clientWidth;
    const overlayH = video.clientHeight;
    const videoW = video.videoWidth;
    const videoH = video.videoHeight;

    // 1. 오버레이 내에서 비디오가 실제로 차지하는 크기 계산 (contain 기준)
    const scale = Math.min(overlayW / videoW, overlayH / videoH) * zoom;
    const displayW = videoW * scale;
    const displayH = videoH * scale;
    const displayLeft = (overlayW - displayW) / 2 + panOffset.x;
    const displayTop = (overlayH - displayH) / 2 + panOffset.y;

    // 2. 선택 영역 px로 변환
    const areaX = (selectedArea.x / 100) * overlayW;
    const areaY = (selectedArea.y / 100) * overlayH;
    const areaW = (selectedArea.w / 100) * overlayW;
    const areaH = (selectedArea.h / 100) * overlayH;

    // 3. 선택 영역이 비디오 내부에서 어디에 위치하는지 계산
    const relX = areaX - displayLeft;
    const relY = areaY - displayTop;

    // 4. 원본 비디오 좌표로 환산
    const sx = relX / scale;
    const sy = relY / scale;
    const sw = areaW / scale;
    const sh = areaH / scale;

    // 캔버스 생성 및 크기 지정
    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

    setCroppedUrl(canvas.toDataURL('image/png'));
  };

  return {
    croppedUrl,
    handleExtract,
  };
}
