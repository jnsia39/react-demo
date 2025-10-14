/**
 * 픽셀 좌표를 위경도로 변환
 */
export function convertPixelToLatLng(
  map: google.maps.Map,
  clientX: number,
  clientY: number
): google.maps.LatLngLiteral | null {
  const bounds = map.getBounds();
  if (!bounds) return null;

  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  const mapDiv = map.getDiv();
  const rect = mapDiv.getBoundingClientRect();

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const worldX = x / rect.width;
  const worldY = y / rect.height;

  const lat = sw.lat() + (ne.lat() - sw.lat()) * (1 - worldY);
  const lng = sw.lng() + (ne.lng() - sw.lng()) * worldX;

  return { lat, lng };
}
