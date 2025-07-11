import { useMemo } from 'react';

const BASE_URL = import.meta.env.VITE_AWS_URL;

export default function ImageDetails({
  source,
  size,
}: {
  source: string | null;
  size: string;
}) {
  const imageMeta = useMemo(() => {
    return {
      name: source,
      type: 'PNG',
      resolution: `720x720`,
      size: size,
    };
  }, [source]);

  return (
    <div className="border p-4 bg-white flex flex-col">
      {source && imageMeta ? (
        <>
          <div className="flex flex-col items-center mb-4">
            <img
              src={`${BASE_URL}/${source}`}
              alt={source}
              className="w-60 h-48 object-contain bg-gray-100 border mb-2"
            />
          </div>
          <ul className="text-sm space-y-2">
            {Object.entries(imageMeta)
              .filter(([k]) => k !== 'filePath')
              .map(([k, v]) => (
                <li key={k} className="flex justify-between border-b py-1">
                  <span className="font-semibold text-gray-700 capitalize">
                    {k}
                  </span>
                  <span className="text-gray-900 text-right ml-2 break-all whitespace-pre-line">
                    {String(v)}
                  </span>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <div className="flex flex-1 flex-col justify-center items-center text-gray-400">
          <span className="text-2xl mb-2">🖼️</span>
          <div>
            이미지를 클릭하면
            <br />
            메타데이터가 표시됩니다.
          </div>
        </div>
      )}
    </div>
  );
}
