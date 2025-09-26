import useMarkerDetails from '../hooks/useMarkerDetails';
import { MarkerData } from '../types';
import * as styles from '../styles/MarkerDetails.css';
import clsx from 'clsx';

interface MarkerDetailsProps {
  marker: MarkerData;
  deleteMarker: (markerId: string) => void;
  removeVideoFromMarker: (markerId: string, videoId: string) => void;
}

export default function MarkerDetails({
  marker,
  deleteMarker,
  removeVideoFromMarker,
}: MarkerDetailsProps) {
  const { id, position, videos } = marker;

  const {
    memo,
    editingMemo,
    isEditingMemo,
    address,
    saveMemo,
    startMemoEdit,
    cancelMemoEdit,
    onChangeMemo,
  } = useMarkerDetails({ marker });

  return (
    <div className={styles.detailsWrapper}>
      <div className={styles.coordsBox}>
        좌표: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}
      </div>

      {/* 메모 입력 필드 */}
      <div className={styles.memoBox}>
        <div className={styles.memoHeaderRow}>
          <span>📝 메모</span>
          {!isEditingMemo && (
            <button className={styles.memoEditButton} onClick={startMemoEdit}>
              편집
            </button>
          )}
        </div>
        {isEditingMemo ? (
          <>
            <textarea
              value={editingMemo}
              onChange={(e) => onChangeMemo(e.target.value)}
              placeholder="메모를 입력하세요..."
              className={styles.memoTextarea}
              autoFocus
            />
            <div className={styles.memoEditActions}>
              <button onClick={saveMemo} className={styles.memoSaveButton}>
                저장
              </button>
              <button
                onClick={cancelMemoEdit}
                className={styles.memoCancelButton}
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <div
            className={clsx(styles.memoView, !memo && styles.memoViewEmpty)}
            title="클릭하여 편집"
          >
            {memo}
          </div>
        )}
      </div>

      {address && (
        <div className={styles.addressBox}>
          <div className={styles.addressTitle}>주소</div>
          <div>{address}</div>
        </div>
      )}

      {videos.length > 0 && (
        <div className={styles.videosBox}>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
            연결된 비디오 ({videos.length})
          </h4>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {videos.map((video) => (
              <div
                key={video.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  padding: '5px',
                  backgroundColor: 'white',
                  borderRadius: '3px',
                  border: '1px solid #ddd',
                }}
              >
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt={video.name}
                    style={{
                      width: '40px',
                      height: '30px',
                      objectFit: 'cover',
                      borderRadius: '2px',
                      marginRight: '8px',
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {video.name}
                  </div>
                </div>
                <button
                  onClick={() => removeVideoFromMarker(id, video.id)}
                  style={{
                    padding: '2px 6px',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    marginLeft: '5px',
                  }}
                >
                  제거
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => deleteMarker(id)}
        style={{
          padding: '5px 10px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      >
        마커 삭제
      </button>
    </div>
  );
}
