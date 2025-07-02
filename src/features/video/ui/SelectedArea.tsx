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
      className="absolute border-2 border-blue-500 bg-blue-200/10"
      style={{
        left: renderRect.x,
        top: renderRect.y,
        width: renderRect.w,
        height: renderRect.h,
        zIndex: 10,
        boxSizing: 'border-box',
      }}
    >
      {handleResizeMouseDown &&
        ['nw', 'ne', 'sw', 'se'].map((dir) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            width: 12,
            height: 12,
            background: '#fff',
            border: '2px solid #3b82f6', // blue-500
            borderRadius: 4,
            zIndex: 20,
            transition: 'border 0.2s',
            boxShadow: '0 1px 4px #3b82f622',
          };
          if (dir === 'nw') {
            style.left = -6;
            style.top = -6;
            style.cursor = 'nwse-resize';
          } else if (dir === 'ne') {
            style.right = -6;
            style.top = -6;
            style.cursor = 'nesw-resize';
          } else if (dir === 'sw') {
            style.left = -6;
            style.bottom = -6;
            style.cursor = 'nesw-resize';
          } else if (dir === 'se') {
            style.right = -6;
            style.bottom = -6;
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
