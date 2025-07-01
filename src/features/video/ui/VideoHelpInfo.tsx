export function VideoHelpInfo() {
  return (
    <div className="w-full text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1 p-2 justify-center">
      <span>편집 모드: 사각형 그리기/이동/리사이즈 가능</span>
      <span>뷰 모드: 사각형 조작 불가, 영상 탐색만 가능</span>
      <span>[/] 키: 줌</span>
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
