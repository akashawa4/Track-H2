export interface TruckData {
  id: string;
  name: string;
  status: 'OK' | 'WARNING' | 'CRITICAL';
  gps: {
    lat: number;
    lng: number;
    speed: number;
    heading: number;
  };
  tank: {
    leak: {
      detected: boolean;
      ppm?: number;
    };
    pressure: {
      value: number;
      threshold: number;
      unit: string;
      history: number[];
    };
    temp: {
      value: number;
      ambient?: number;
      unit: string;
    };
  };
  system: {
    signal: number;
    voltage: number;
    uptime: number;
    lastUpdate: number;
  };
  route: {
    actual: { lat: number; lng: number }[];
    expected: { lat: number; lng: number }[];
    geofence: { lat: number; lng: number }[];
  };
  events: Event[];
}

export interface Event {
  id: string;
  timestamp: number;
  type: 'leak' | 'pressure' | 'temperature' | 'route' | 'system' | 'info';
  severity: 'critical' | 'warning' | 'info';
  message: string;
}

export type ConnectionStatus = 'online' | 'weak' | 'offline';
