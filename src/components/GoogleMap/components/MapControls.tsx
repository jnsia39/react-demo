import * as styles from '../styles/MapControls.css';
import clsx from 'clsx';

interface MapControlsProps {
  isTrackingMode: boolean;
  connectedMarkersCount: number;
  onToggleTrackingMode: () => void;
  onCreateRoute: () => void;
  onCancelConnection: () => void;
}

export default function MapControls({
  isTrackingMode,
  connectedMarkersCount,
  onToggleTrackingMode,
  onCreateRoute,
  onCancelConnection,
}: MapControlsProps) {
  return (
    <div className={styles.controlsWrapper}>
      <button
        onClick={onToggleTrackingMode}
        className={clsx(
          styles.buttonBase,
          isTrackingMode ? styles.trackingOn : styles.trackingOff
        )}
      >
        추적 모드 {isTrackingMode ? 'ON' : 'OFF'}
      </button>

      {connectedMarkersCount > 1 && (
        <button
          onClick={onCreateRoute}
          className={clsx(styles.buttonBase, styles.createRoute)}
        >
          경로 생성 ({connectedMarkersCount}개)
        </button>
      )}

      {isTrackingMode && connectedMarkersCount > 0 && (
        <button
          onClick={onCancelConnection}
          className={clsx(styles.buttonBase, styles.cancelConnection)}
        >
          연결 취소
        </button>
      )}
    </div>
  );
}
