import React from 'react';

export default function SelectedArea({
  renderRect,
  editMode,
  handleResizeMouseDown,
}: {
  renderRect: { x: number; y: number; w: number; h: number } | null;
  editMode?: boolean;
  handleResizeMouseDown?: (
    dir: 'nw' | 'ne' | 'sw' | 'se',
    e: React.MouseEvent
  ) => void;
}) {
  if (!editMode || !renderRect || renderRect.w <= 0 || renderRect.h <= 0)
    return null;

  return (
    <div
      className="absolute border-2 border-red-500"
      style={{
        left: renderRect.x,
        top: renderRect.y,
        width: renderRect.w,
        height: renderRect.h,
        zIndex: 10,
      }}
    >
      {handleResizeMouseDown &&
        ['nw', 'ne', 'sw', 'se'].map((dir) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            width: 8,
            height: 8,
            background: '#fff',
            border: '2px solid #f00',
            zIndex: 20,
            transition: 'border 0.2s',
          };
          if (dir === 'nw') {
            style.left = -4;
            style.top = -4;
            style.cursor = 'nwse-resize';
          } else if (dir === 'ne') {
            style.right = -4;
            style.top = -4;
            style.cursor = 'nesw-resize';
          } else if (dir === 'sw') {
            style.left = -4;
            style.bottom = -4;
            style.cursor = 'nesw-resize';
          } else if (dir === 'se') {
            style.right = -4;
            style.bottom = -4;
            style.cursor = 'nwse-resize';
          }
          return (
            <div
              key={dir}
              style={style}
              onMouseDown={(e) =>
                handleResizeMouseDown(dir as 'nw' | 'ne' | 'sw' | 'se', e)
              }
            />
          );
        })}
    </div>
  );
}
