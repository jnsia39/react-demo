import { useImageBlobUrl } from '../useImageBlobUrl';

interface VirtualImageCellProps {
  item: string | undefined;
  isSelected: boolean;
  onClick: (item: string) => void;
  imagesPerRow: number;
  baseUrl: string;
  index: number;
}

export default function VirtualImageCell({
  item,
  isSelected,
  onClick,
  imagesPerRow,
  baseUrl,
  index,
}: VirtualImageCellProps) {
  const blobUrl = useImageBlobUrl(item ? `${baseUrl}/${item}` : undefined);

  return (
    <div
      key={index}
      className={`flex flex-col items-center border cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => item && onClick(item)}
    >
      {blobUrl ? (
        <img
          src={blobUrl}
          alt={item || 'Fetching'}
          loading="lazy"
          className={`w-full ${
            imagesPerRow === 16 ? 'h-16' : 'h-32'
          } object-cover`}
        />
      ) : (
        <div
          className={`w-full ${
            imagesPerRow === 16 ? 'h-16' : 'h-32'
          } object-cover justify-center items-center flex text-xs`}
        >
          {item?.substring(6, 12) || 'Loading'}
        </div>
      )}
    </div>
  );
}
