import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface UseUserLocationReturn {
  userLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  accuracy: number | null;
}

const DEFAULT_LOCATION: Location = {
  lat: 37.402,
  lng: 127.108,
};

export default function useUserLocation(): UseUserLocationReturn {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('브라우저가 위치 정보를 지원하지 않습니다.');
      setUserLocation(DEFAULT_LOCATION);
      setIsLoading(false);
      return;
    }

    let watchId: number;
    let bestAccuracy = Infinity;
    let stabilizationTimer: NodeJS.Timeout;

    const handleSuccess = (position: GeolocationPosition) => {
      const currentAccuracy = position.coords.accuracy;

      // 더 정확한 위치가 들어오면 업데이트
      if (currentAccuracy < bestAccuracy) {
        bestAccuracy = currentAccuracy;

        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setAccuracy(currentAccuracy);
        setIsLoading(false);
        setError(null);

        // 정확도가 충분히 좋으면 (50m 이내) 감시 중단
        if (currentAccuracy <= 50) {
          clearTimeout(stabilizationTimer);
          stabilizationTimer = setTimeout(() => {
            if (watchId) {
              navigator.geolocation.clearWatch(watchId);
            }
          }, 2000); // 2초 후 중단
        }
      }
    };

    const handleError = (err: GeolocationPositionError) => {
      console.warn('위치 정보를 가져올 수 없습니다:', err);
      setError(err.message);
      setUserLocation(DEFAULT_LOCATION);
      setIsLoading(false);
    };

    // watchPosition으로 지속적으로 정확한 위치 추적
    watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true, // GPS 사용
        timeout: 27000, // 27초까지 대기
        maximumAge: 0, // 캐시 사용 안 함
      }
    );

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (stabilizationTimer) {
        clearTimeout(stabilizationTimer);
      }
    };
  }, []);

  return { userLocation, isLoading, error, accuracy };
}
