import { useEffect, useState } from 'react';

export default function useRoutes() {
  const [isTrackingMode, setIsTrackingMode] = useState(false);
  const [connectedMarkers, setConnectedMarkers] = useState<string[]>([]);
  const [markerRoutes, setMarkerRoutes] = useState<string[][]>([]);

  const [editingRouteIndex, setEditingRouteIndex] = useState<number | null>(
    null
  );
  const [editingRoute, setEditingRoute] = useState<string[]>([]);

  const isEditing = editingRouteIndex !== null;

  // 경로 편집 시작
  const startEditRoute = (index: number) => {
    setIsTrackingMode(true);
    setEditingRouteIndex(index);
    setEditingRoute([...markerRoutes[index]]);
    setConnectedMarkers([]);
  };

  // 경로 편집 저장
  const saveEditedRoute = () => {
    if (editingRouteIndex !== null && editingRoute.length > 1) {
      const newRoutes = [...markerRoutes];
      newRoutes[editingRouteIndex] = [...editingRoute];
      setMarkerRoutes(newRoutes);
      setEditingRouteIndex(null);
      setEditingRoute([]);
    }
  };

  // 경로 편집 취소
  const cancelEditRoute = () => {
    setEditingRouteIndex(null);
    setEditingRoute([]);
  };

  const cancelConnection = () => {
    setConnectedMarkers([]);
  };

  const toggleMarkerWhileTracking = (markerId: string) => {
    if (!isTrackingMode) return;

    if (isEditing) {
      toggleMarkerInEditRoute(markerId);
    } else {
      toggleMarkerInConnectedMarkers(markerId);
    }
  };

  // 편집 중인 경로에서 마커 토글
  const toggleMarkerInEditRoute = (markerId: string) => {
    if (editingRoute.includes(markerId)) {
      setEditingRoute((prev) => prev.filter((id) => id !== markerId));
    } else {
      setEditingRoute((prev) => [...prev, markerId]);
    }
  };

  const toggleMarkerInConnectedMarkers = (markerId: string) => {
    if (connectedMarkers.includes(markerId)) {
      setConnectedMarkers((prev) => prev.filter((id) => id !== markerId));
    } else {
      setConnectedMarkers((prev) => [...prev, markerId]);
    }
  };

  // 연결된 마커들로 경로 생성
  const createRoute = () => {
    if (connectedMarkers.length > 1) {
      setMarkerRoutes((prev) => [...prev, [...connectedMarkers]]);
      setConnectedMarkers([]);
    }
  };

  const deleteMarkerFromRoutes = (targetId: string) => {
    // 연결된 마커 목록에서도 제거
    setConnectedMarkers((prev) =>
      prev.filter((markerId) => markerId !== targetId)
    );

    // 저장된 경로에서도 제거
    setMarkerRoutes((prev) =>
      prev
        .map((route) => route.filter((markerId) => markerId !== targetId))
        .filter((route) => route.length > 1)
    );
  };

  const toggleTrackingMode = () => {
    setIsTrackingMode(!isTrackingMode);
  };

  // 경로 삭제
  const deleteRoute = (index: number) => {
    setMarkerRoutes((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!isTrackingMode) {
      createRoute();
      setConnectedMarkers([]);
    }

    console.log(isTrackingMode);
  }, [isTrackingMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsTrackingMode(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsTrackingMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return {
    isTrackingMode,
    editingRouteIndex,
    editingRoute,
    startEditRoute,
    saveEditedRoute,
    cancelEditRoute,
    connectedMarkers,
    markerRoutes,
    toggleTrackingMode,
    createRoute,
    deleteRoute,
    deleteMarkerFromRoutes,
    toggleMarkerWhileTracking,
    cancelConnection,
  };
}
