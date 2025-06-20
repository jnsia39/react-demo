export default function VideoCommandDescription() {
  return (
    <div className="w-full text-xs text-gray-400 mt-2 flex flex-wrap gap-x-4 gap-y-1 justify-center">
      <span>
        <b>Space</b>: 재생/일시정지
      </span>
      <span>
        <b>←/→</b>: 5초 이동
      </span>
      <span>
        <b>↑/↓</b>: 볼륨
      </span>
      <span>
        <b>+/–</b>: 속도
      </span>
      <span>
        <b>B/N</b>: 1프레임 뒤로/앞으로 (30fps 기준)
      </span>
      <span>
        <b>M</b>: 음소거
      </span>
      <span>
        <b>F</b>: 전체화면
      </span>
    </div>
  );
}
