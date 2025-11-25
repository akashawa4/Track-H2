import { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { theme } from '../styles/theme';
import { TruckData } from '../types';

interface LiveMapProps {
  truckData: TruckData | null;
}

// Track if setOptions has been called (module-level to prevent multiple calls)
let optionsSet = false;

export const LiveMap = ({ truckData }: LiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const actualRouteRef = useRef<google.maps.Polyline | null>(null);
  const expectedRouteRef = useRef<google.maps.Polyline | null>(null);
  const geofenceRef = useRef<google.maps.Polygon | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (initRef.current) return;
    initRef.current = true;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.warn('Google Maps API key not found. Make sure VITE_GOOGLE_MAPS_API_KEY is set in your .env file and the dev server is restarted.');
      console.log('Available env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
      console.log('VITE_GOOGLE_MAPS_API_KEY value:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
      return;
    }

    console.log('Google Maps API key loaded successfully');

    // Set API options only once
    if (!optionsSet) {
      setOptions({
        apiKey,
        version: 'weekly',
      });
      optionsSet = true;
    }

    // Load the Maps library
    importLibrary('maps').then(() => {
      if (mapRef.current && !googleMapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.006 },
          zoom: 12,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry',
              stylers: [{ color: '#1B263B' }],
            },
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#AAB6C5' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#0D1B2A' }],
            },
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
        });

        googleMapRef.current = map;
        setMapLoaded(true);
      }
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
    });
  }, []);

  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current || !truckData) return;

    const map = googleMapRef.current;
    const { gps, status, route } = truckData;

    const markerColor =
      status === 'OK'
        ? theme.colors.status.safe
        : status === 'WARNING'
        ? theme.colors.status.warning
        : theme.colors.status.critical;

    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        position: { lat: gps.lat, lng: gps.lng },
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });
    } else {
      markerRef.current.setPosition({ lat: gps.lat, lng: gps.lng });
      markerRef.current.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: markerColor,
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
      });
    }

    map.setCenter({ lat: gps.lat, lng: gps.lng });

    if (route.actual && route.actual.length > 0) {
      if (actualRouteRef.current) {
        actualRouteRef.current.setMap(null);
      }
      actualRouteRef.current = new google.maps.Polyline({
        path: route.actual,
        geodesic: true,
        strokeColor: theme.colors.status.action,
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
      });
    }

    if (route.expected && route.expected.length > 0) {
      if (expectedRouteRef.current) {
        expectedRouteRef.current.setMap(null);
      }
      expectedRouteRef.current = new google.maps.Polyline({
        path: route.expected,
        geodesic: true,
        strokeColor: theme.colors.text.secondary,
        strokeOpacity: 0.5,
        strokeWeight: 2,
        strokePattern: [10, 5],
        map,
      });
    }

    if (route.geofence && route.geofence.length > 0) {
      if (geofenceRef.current) {
        geofenceRef.current.setMap(null);
      }
      geofenceRef.current = new google.maps.Polygon({
        paths: route.geofence,
        strokeColor: theme.colors.status.warning,
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: theme.colors.status.warning,
        fillOpacity: 0.1,
        map,
      });
    }
  }, [mapLoaded, truckData]);

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        borderRadius: theme.borderRadius.card,
        backgroundColor: theme.colors.background.panel,
      }}
    >
      <div ref={mapRef} className="w-full h-full" />
      {!mapLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: theme.colors.text.secondary }}
        >
          Loading map...
        </div>
      )}
    </div>
  );
};
