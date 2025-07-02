import VideoUploader from '../../../features/video/ui/VideoUploader';
import useVideoList from '@entities/video/model/useVideoList';

export default function VideoPlaylist({
  selectedVideo,
  onSelect,
}: {
  selectedVideo: string | null;
  onSelect: (id: string) => void;
}) {
  const { data: videoList } = useVideoList();

  if (!videoList) {
    return (
      <div className="text-gray-400 text-sm py-4 text-center">
        비디오 목록을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white text-[15px]">
      <div className="py-2 border-b border-gray-100 px-4">
        <VideoUploader />
      </div>
      <div className="px-4 pt-4 pb-2 font-semibold text-gray-700 text-base tracking-tight select-none">
        비디오 목록
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {videoList.length === 0 ? (
          <div className="text-gray-400 text-sm py-4 text-center">
            등록된 비디오가 없습니다
          </div>
        ) : (
          <ul>
            {videoList.map((video: any) => (
              <li
                key={video}
                className={`group flex items-center gap-3 px-2 py-2 mb-1 cursor-pointer select-none transition-colors relative
                  ${
                    selectedVideo === video
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'hover:bg-blue-50 text-gray-700'
                  }
                `}
                style={{ borderRadius: 0, boxShadow: 'none', border: 'none' }}
                onClick={() => onSelect(video)}
              >
                {/* 왼쪽 파란색 바 */}
                {selectedVideo === video && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-sm" />
                )}
                {/* 썸네일/아이콘 */}
                <span className="flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-400 rounded mr-1">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="truncate w-full z-10">{video}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
