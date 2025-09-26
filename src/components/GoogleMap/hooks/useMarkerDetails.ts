import { useEffect, useState } from 'react';
import { MarkerData } from '../types';

export default function useMarkerDetails({
  marker,
}: {
  marker: MarkerData | null;
}) {
  const [memo, setMemo] = useState<string>('');
  const [editingMemo, setEditingMemo] = useState<string>('');
  const [isEditingMemo, setIsEditingMemo] = useState(false);

  const [address, setAddress] = useState<string>('');

  const startMemoEdit = () => {
    setIsEditingMemo(true);
  };

  const cancelMemoEdit = () => {
    if (marker) {
      setEditingMemo(memo);
      setIsEditingMemo(false);
    }
  };

  const saveMemo = () => {
    setMemo(editingMemo);
    setIsEditingMemo(false);
  };

  const handleChangeMemo = (newMemo: string) => {
    setEditingMemo(newMemo);
  };

  const getAddressFromCoord = async () => {
    if (!marker) return;

    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat: marker.position.lat, lng: marker.position.lng },
      });

      if (response.results && response.results[0]) {
        const address = response.results[0].formatted_address;
        setAddress(address);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  useEffect(() => {
    getAddressFromCoord();
  }, [marker]);

  return {
    memo,
    editingMemo,
    isEditingMemo,
    address,
    saveMemo,
    startMemoEdit,
    cancelMemoEdit,
    onChangeMemo: handleChangeMemo,
  };
}
