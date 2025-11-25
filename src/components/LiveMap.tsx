import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Polygon,
  CircleMarker,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { theme } from '../styles/theme';
import { TruckData } from '../types';

interface LiveMapProps {
  truckData: TruckData | null;
}

// Configure default Leaflet marker assets (Vite does not resolve them automatically)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const fallbackCenter = { lat: 40.7128, lng: -74.006 };

const ChangeView = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

export const LiveMap = ({ truckData }: LiveMapProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const requestUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported in this browser.');
      return;
    }

    setLocating(true);
    setGeoError(null);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
        setIsTracking(true);
      },
      (error) => {
        setGeoError(error.message || 'Unable to retrieve your location.');
        setLocating(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
    setWatchId(id);
  }, []);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  useEffect(() => {
    requestUserLocation();
  }, [requestUserLocation]);

  const mapCenter = useMemo(() => {
    if (userLocation) return userLocation;
    if (truckData?.gps) return truckData.gps;
    return fallbackCenter;
  }, [truckData?.gps, userLocation]);

  const markerColor =
    truckData?.status === 'OK'
      ? theme.colors.status.safe
      : truckData?.status === 'WARNING'
      ? theme.colors.status.warning
      : theme.colors.status.critical;

  const actualRoute = truckData?.route?.actual?.map((point) => [point.lat, point.lng]) || [];
  const expectedRoute = truckData?.route?.expected?.map((point) => [point.lat, point.lng]) || [];
  const geofence = truckData?.route?.geofence?.map((point) => [point.lat, point.lng]) || [];

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        borderRadius: theme.borderRadius.card,
        backgroundColor: theme.colors.background.panel,
      }}
    >
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={13}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={mapCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {truckData && (
          <CircleMarker
            center={[truckData.gps.lat, truckData.gps.lng]}
            radius={10}
            pathOptions={{
              color: markerColor,
              fillColor: markerColor,
              fillOpacity: 0.9,
            }}
          />
        )}

        {actualRoute.length > 0 && (
          <Polyline
            positions={actualRoute as [number, number][]}
            pathOptions={{
              color: theme.colors.status.action,
              weight: 3,
            }}
          />
        )}

        {expectedRoute.length > 0 && (
          <Polyline
            positions={expectedRoute as [number, number][]}
            pathOptions={{
              color: theme.colors.text.secondary,
              weight: 2,
              dashArray: '10, 6',
            }}
          />
        )}

        {geofence.length > 0 && (
          <Polygon
            positions={geofence as [number, number][]}
            pathOptions={{
              color: theme.colors.status.warning,
              fillColor: theme.colors.status.warning,
              fillOpacity: 0.1,
            }}
          />
        )}

        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={120}
              pathOptions={{
                color: theme.colors.status.safe,
                fillColor: theme.colors.status.safe,
                fillOpacity: 0.15,
              }}
            />
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={8}
              pathOptions={{
                color: theme.colors.status.safe,
                fillColor: theme.colors.status.safe,
                fillOpacity: 0.9,
              }}
            />
          </>
        )}
      </MapContainer>

      {(locating || geoError) && (
        <div
          className="absolute top-2 right-2 px-3 py-2 rounded-md text-sm"
          style={{
            backgroundColor: theme.colors.background.card,
            color: geoError ? theme.colors.status.warning : theme.colors.text.secondary,
            boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
          }}
        >
          {geoError ? `Location error: ${geoError}` : 'Fetching your location...'}
        </div>
      )}
      <button
        type="button"
        onClick={requestUserLocation}
        disabled={locating}
        className="absolute top-3 left-3 px-4 py-2 rounded-md text-sm font-semibold"
        style={{
          backgroundColor: theme.colors.status.action,
          color: '#0b1326',
          opacity: locating ? 0.7 : 1,
          boxShadow: '0 4px 8px rgba(0,0,0,0.35)',
          zIndex: 999,
        }}
      >
        {isTracking ? 'Re-center to me' : locating ? 'Locating...' : 'Use my location'}
      </button>
    </div>
  );
};
