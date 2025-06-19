import VirtualImageCell from './VirtualImageCell';

interface VirtualImageRowProps {
  rowItems: (string | undefined)[];
  startIndex: number;
  imagesPerRow: number;
  selectedImage: string | null;
  onClick: (item: string) => void;
  baseUrl: string;
}

export default function VirtualImageRow({
  rowItems,
  startIndex,
  imagesPerRow,
  selectedImage,
  onClick,
  baseUrl,
}: VirtualImageRowProps) {
  return (
    <div
      className={
        imagesPerRow === 16
          ? `grid grid-cols-16 gap-2`
          : `grid grid-cols-8 gap-2`
      }
    >
      {rowItems.map((item, index) => (
        <VirtualImageCell
          key={startIndex + index}
          item={item}
          isSelected={selectedImage === item}
          onClick={onClick}
          imagesPerRow={imagesPerRow}
          baseUrl={baseUrl}
          index={startIndex + index}
        />
      ))}
    </div>
  );
}
