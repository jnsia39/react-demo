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
    <div className="flex flex-col h-full">
      <div className="py-2">
        <VideoUploader />
      </div>
      <div className="flex-1 overflow-y-auto">
        {videoList.length === 0 ? (
          <div className="text-gray-400 text-sm py-4 text-center">
            등록된 비디오가 없습니다
          </div>
        ) : (
          <ul className="divide-y bg-white">
            {videoList.map((video: any) => (
              <li
                key={video}
                className={`px-4 py-2 flex items-center border mb-2 cursor-pointer hover:bg-blue-50 transition ${
                  selectedVideo === video
                    ? 'bg-blue-100 font-bold text-blue-700'
                    : ''
                }`}
                onClick={() => onSelect(video)}
              >
                <span className="truncate">{video}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="mt-2 px-4 py-2 bg-red-600 text-white hover:bg-blue-700 transition">
        초기화
      </button>
    </div>
  );
}
