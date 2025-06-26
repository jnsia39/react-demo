// blurWorker.js
// 예시: 단순히 입력 버퍼를 그대로 반환 (실제 블러 처리는 원하는 대로 구현)
self.onmessage = function (e) {
  const { id, buffer, x, y, width, height, radius } = e.data;
  // TODO: buffer를 가공(블러 등)하는 로직을 여기에 구현
  // 아래는 원본 버퍼를 그대로 반환하는 예시
  self.postMessage({ id, buffer }, [buffer]);
};
