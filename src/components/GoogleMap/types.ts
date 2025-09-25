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
  title: string;
  description: string;
  address?: string;
  timestamp?: Date;
  videos: VideoInfo[];
  type?: 'default' | 'important' | 'warning' | 'info';
}

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: Date;
}