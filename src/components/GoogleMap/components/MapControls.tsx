interface MapControlsProps {
  isConnectMode: boolean;
  connectedMarkersCount: number;
  editingRouteIndex: number | null;
  markerRoutesCount: number;
  markerRoutes: string[][];
  onToggleConnectMode: () => void;
  onCreateRoute: () => void;
  onCancelConnection: () => void;
  onStartEditRoute: (index: number) => void;
  onSaveEditedRoute: () => void;
  onCancelEditRoute: () => void;
  onDeleteRoute: (index: number) => void;
  onClearAllRoutes: () => void;
}

export default function MapControls({
  isConnectMode,
  connectedMarkersCount,
  editingRouteIndex,
  markerRoutesCount,
  markerRoutes,
  onToggleConnectMode,
  onCreateRoute,
  onCancelConnection,
  onStartEditRoute,
  onSaveEditedRoute,
  onCancelEditRoute,
  onDeleteRoute,
  onClearAllRoutes,
}: MapControlsProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '320px',
      }}
    >
      {/* Global Styles */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Main Controls */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={onToggleConnectMode}
          style={{
            padding: '10px 16px',
            backgroundColor: isConnectMode ? '#F59E0B' : '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: isConnectMode
              ? '0 4px 12px rgba(245, 158, 11, 0.4)'
              : '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
          }}
        >
          🔗 연결 모드 {isConnectMode ? 'ON' : 'OFF'}
        </button>

        {connectedMarkersCount > 1 && (
          <button
            onClick={onCreateRoute}
            style={{
              padding: '10px 16px',
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              animation: 'pulse 2s infinite',
            }}
          >
            ✨ 경로 생성 ({connectedMarkersCount}개)
          </button>
        )}

        {isConnectMode && connectedMarkersCount > 0 && (
          <button
            onClick={onCancelConnection}
            style={{
              padding: '10px 16px',
              backgroundColor: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
            }}
          >
            ❌ 연결 취소
          </button>
        )}
      </div>

      {/* Route List */}
      {markerRoutesCount > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              fontWeight: '600',
              color: '#111827',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🗺️ 경로 목록 ({markerRoutesCount}개)
          </div>

          {markerRoutes.map((route, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor:
                  editingRouteIndex === index ? '#FEF3C7' : '#F8FAFC',
                borderRadius: '8px',
                border:
                  editingRouteIndex === index
                    ? '2px solid #F59E0B'
                    : '1px solid #E2E8F0',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827',
                  }}
                >
                  🛤️ 경로 {index + 1}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    marginTop: '2px',
                  }}
                >
                  {route.length}개 마커
                  {editingRouteIndex === index && ' • 편집 중'}
                </div>
              </div>

              {editingRouteIndex !== index ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onStartEditRoute(index)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: '#F59E0B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    ✏️ 편집
                  </button>
                  <button
                    onClick={() => onDeleteRoute(index)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    🗑️ 삭제
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={onSaveEditedRoute}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    ✅ 저장
                  </button>
                  <button
                    onClick={onCancelEditRoute}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: '#6B7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    ❌ 취소
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={onClearAllRoutes}
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              backgroundColor: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '8px',
              fontWeight: '500',
            }}
          >
            🧹 모든 경로 삭제
          </button>
        </div>
      )}
    </div>
  );
}
