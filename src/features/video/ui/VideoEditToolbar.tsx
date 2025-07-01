import VideoAreaSelectInfo from '@features/video/ui/VideoAreaSelectInfo';

interface VideoAreaHeaderProps {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  rect: { x: number; y: number; w: number; h: number } | null;
}

export function VideoEditToolbar({
  editMode,
  setEditMode,
  rect,
}: VideoAreaHeaderProps) {
  return (
    <div className="flex w-full justify-between items-center">
      <button
        className={`px-4 py-1.5 rounded-lg font-semibold border shadow-sm transition-colors duration-150 text-sm ${
          editMode
            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
        }`}
        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? '편집 모드 ON' : '편집 모드 OFF'}
      </button>
      <VideoAreaSelectInfo rect={rect} />
    </div>
  );
}
