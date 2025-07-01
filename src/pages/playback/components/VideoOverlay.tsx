import React from 'react';
import { useVideoAreaSelect } from '../../../features/video/model/useVideoAreaSelect';
import { useVideoStore } from '@pages/playback/store/videoStore';
import { useVideoPan } from '../../../features/video/model/useVideoPan';

interface VideoOverlayProps {
  editMode: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  zoom: number;
  children: React.ReactNode;
}

export function VideoOverlay({
  videoRef,
  editMode,
  zoom,
  children,
}: VideoOverlayProps) {
  const { finalRect, setFinalRect, panOffset, setPanOffset } = useVideoStore();
  const {
    containerRef,
    containerSize,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    renderRect,
    handleResizeMouseDown,
  } = useVideoAreaSelect({ videoRef, editMode, finalRect, setFinalRect });

  const { getPanMouseDown } = useVideoPan({
    zoom,
    panOffset,
    setPanOffset,
    editMode,
    containerSize,
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {children}
      <div
        className="absolute select-none w-full h-full"
        style={{
          pointerEvents: 'auto',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          cursor: editMode ? 'crosshair' : 'grab',
          zIndex: 1000,
        }}
        onMouseDown={editMode ? handleMouseDown : getPanMouseDown()}
        onMouseMove={editMode ? handleMouseMove : undefined}
        onMouseUp={editMode ? handleMouseUp : undefined}
      >
        {renderRect && renderRect.w > 0 && renderRect.h > 0 && (
          <div
            className={`absolute border-2 ${
              editMode ? 'border-red-500' : 'border-gray-400'
            } ${editMode ? '' : 'pointer-events-none'}`}
            style={{
              left: renderRect.x,
              top: renderRect.y,
              width: renderRect.w,
              height: renderRect.h,
              zIndex: 10,
              transition: 'opacity 0.2s, background 0.2s',
            }}
          >
            {editMode &&
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
        )}
      </div>
    </div>
  );
}
