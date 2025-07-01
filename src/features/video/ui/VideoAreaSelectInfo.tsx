import { useVideoStore } from '@pages/playback/store/videoStore';

export default function VideoAreaSelectInfo() {
  const { selectedArea } = useVideoStore();

  const w = Math.round(selectedArea?.w || 0);
  const h = Math.round(selectedArea?.h || 0);

  const isEmpty = !selectedArea || (w === 0 && h === 0);

  const x = isEmpty ? 0 : Math.round(selectedArea?.x || 0);
  const y = isEmpty ? 0 : Math.round(selectedArea?.y || 0);

  return (
    <div className="flex gap-4 text-xs text-gray-700 bg-gray-50 px-4 py-2 border border-gray-200 shadow-sm">
      <span>
        X: <span className="font-mono">{x}px</span>
      </span>
      <span>
        Y: <span className="font-mono">{y}px</span>
      </span>
      <span>
        W: <span className="font-mono">{w}px</span>
      </span>
      <span>
        H: <span className="font-mono">{h}px</span>
      </span>
    </div>
  );
}
