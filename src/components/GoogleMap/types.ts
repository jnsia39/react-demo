export interface VideoInfo {
  id: string;
  name: string;
  url: string;
  duration?: number;
  thumbnail?: string;
  size: number;
}

export interface MarkerData {
  id: string;
  position: google.maps.LatLngLiteral;
  videos: VideoInfo[];
}

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: Date;
}
