import * as styles from '../styles/RouteList.css';
import clsx from 'clsx';

interface RouteListProps {
  markerRoutes: string[][];
  editingRouteIndex: number | null;
  onStartEditRoute: (index: number) => void;
  onSaveEditedRoute: () => void;
  onCancelEditRoute: () => void;
  onDeleteRoute: (index: number) => void;
}

export default function RouteList({
  markerRoutes,
  editingRouteIndex,
  onStartEditRoute,
  onSaveEditedRoute,
  onCancelEditRoute,
  onDeleteRoute,
}: RouteListProps) {
  return (
    <>
      {markerRoutes.length > 0 && (
        <div className={styles.listWrapper}>
          <div className={styles.listTitle}>
            경로 목록 ({markerRoutes.length}개)
          </div>

          {markerRoutes.map((route, index) => (
            <div
              key={index}
              className={clsx(
                styles.routeRow,
                editingRouteIndex === index && styles.routeRowEditing
              )}
            >
              <div className={styles.routeInfo}>
                <div className={styles.routeName}>경로 {index + 1}</div>
                <div className={styles.routeDesc}>
                  {route.length}개 마커
                  {editingRouteIndex === index && ' • 편집 중'}
                </div>
              </div>

              {editingRouteIndex !== index ? (
                <div className={styles.buttonGroup}>
                  <button
                    onClick={() => onStartEditRoute(index)}
                    className={clsx(styles.buttonBase, styles.editButton)}
                  >
                    편집
                  </button>
                  <button
                    onClick={() => onDeleteRoute(index)}
                    className={clsx(styles.buttonBase, styles.deleteButton)}
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <div className={styles.buttonGroup}>
                  <button
                    onClick={onSaveEditedRoute}
                    className={clsx(styles.buttonBase, styles.saveButton)}
                  >
                    ✅ 저장
                  </button>
                  <button
                    onClick={onCancelEditRoute}
                    className={clsx(styles.buttonBase, styles.cancelButton)}
                  >
                    ❌ 취소
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
