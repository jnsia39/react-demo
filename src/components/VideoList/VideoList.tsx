import React, { useRef, useCallback } from 'react';
import { VideoFile } from './types';
import useVideoList from './hooks/useVideoList';
import useVideoDragPreview from './hooks/useVideoDragPreview';
import { formatFileSize, formatDuration } from './utils/videoUtils';
import * as styles from './styles/VideoList.css';
import clsx from 'clsx';

interface VideoListProps {
  onVideoSelect?: (video: VideoFile) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export default function VideoList({
  onVideoSelect,
  onDragStart,
  onDragEnd,
}: VideoListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    videos,
    selectedVideo,
    isLoadingDefault,
    videoPlayerRef,
    handleFileUpload,
    handleDrop,
    handleDeleteVideo,
    handleVideoClick,
  } = useVideoList({ onVideoSelect });

  const { handleDragStart: onVideoDragStart, handleDragEnd: onVideoDragEnd } =
    useVideoDragPreview({ onDragStart, onDragEnd });

  const onFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFileUpload(event.target.files);
      event.target.value = '';
    },
    [handleFileUpload]
  );

  const onDropZoneDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleDrop(event.dataTransfer.files);
    },
    [handleDrop]
  );

  const onDropZoneDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>비디오 파일 목록</h2>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={onFileInputChange}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={styles.addButton}
        >
          비디오 파일 추가
        </button>
      </div>

      {/* Content */}
      <div
        className={styles.content}
        onDrop={onDropZoneDrop}
        onDragOver={onDropZoneDragOver}
      >
        {isLoadingDefault ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>샘플 비디오 로딩 중...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p className={styles.emptyTitle}>비디오 파일이 없습니다</p>
            <p className={styles.emptyDescription}>
              파일을 추가하거나 여기로 드래그하세요
            </p>
          </div>
        ) : (
          <div className={styles.videoListContainer}>
            <div className={styles.hint}>비디오를 지도로 드래그하세요</div>

            {videos.map((video) => (
              <div
                key={video.id}
                draggable
                onDragStart={(e) => onVideoDragStart(e, video)}
                onDragEnd={onVideoDragEnd}
                onClick={() => handleVideoClick(video)}
                className={clsx(
                  styles.videoItem,
                  selectedVideo?.id === video.id && styles.videoItemSelected
                )}
                onMouseEnter={(e) => {
                  if (selectedVideo?.id !== video.id) {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedVideo?.id !== video.id) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div className={styles.thumbnail}>
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className={styles.thumbnailImage}
                    />
                  ) : (
                    <div className={styles.thumbnailPlaceholder}>
                      No Preview
                    </div>
                  )}
                </div>

                <div className={styles.videoInfo}>
                  <div className={styles.videoName}>{video.name}</div>
                  <div className={styles.videoMeta}>
                    <span>{formatFileSize(video.size)}</span>
                    <span>{formatDuration(video.duration)}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteVideo(video.id);
                  }}
                  className={styles.deleteButton}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      {selectedVideo && (
        <div className={styles.preview}>
          <h3 className={styles.previewTitle}>
            미리보기: {selectedVideo.name}
          </h3>
          <video
            ref={videoPlayerRef}
            src={selectedVideo.url}
            className={styles.videoPlayer}
            controls
          />
        </div>
      )}
    </div>
  );
}

export type { VideoFile };
