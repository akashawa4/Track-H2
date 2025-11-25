import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';
import { TruckData, ConnectionStatus } from '../types';

// Mock pressure data for each truck
const mockPressureData: Record<string, TruckData['tank']['pressure']> = {
  'truck-001': {
    value: 75,
    threshold: 100,
    unit: 'bar',
    history: [70, 72, 74, 75, 76, 75, 74],
  },
  'truck-002': {
    value: 95,
    threshold: 100,
    unit: 'bar',
    history: [92, 93, 94, 95, 96, 95, 95],
  },
  'truck-003': {
    value: 120,
    threshold: 100,
    unit: 'bar',
    history: [100, 105, 110, 115, 120, 120, 120],
  },
};

// Mock data for everything except temperature and gas leak
const mockTruckData: Record<string, Omit<TruckData, 'tank'>> = {
  'truck-001': {
    id: 'truck-001',
    name: 'Truck 001',
    status: 'OK',
    gps: { lat: 40.7128, lng: -74.006, speed: 45, heading: 180 },
    system: {
      signal: 85,
      voltage: 13.2,
      uptime: 3600,
      lastUpdate: Date.now(),
    },
    route: {
      actual: [
        { lat: 40.7128, lng: -74.006 },
        { lat: 40.7150, lng: -74.010 },
        { lat: 40.7180, lng: -74.015 },
      ],
      expected: [
        { lat: 40.7128, lng: -74.006 },
        { lat: 40.7160, lng: -74.012 },
        { lat: 40.7200, lng: -74.020 },
      ],
      geofence: [
        { lat: 40.7080, lng: -73.9950 },
        { lat: 40.7250, lng: -73.9950 },
        { lat: 40.7250, lng: -74.0250 },
        { lat: 40.7080, lng: -74.0250 },
      ],
    },
    events: [
      { id: '1', timestamp: Date.now() - 300000, type: 'route_update', message: 'Route updated', severity: 'info' },
      { id: '2', timestamp: Date.now() - 600000, type: 'pressure_check', message: 'Tank pressure nominal', severity: 'info' },
      { id: '3', timestamp: Date.now() - 1200000, type: 'start', message: 'Vehicle started', severity: 'info' },
    ],
  },
  'truck-002': {
    id: 'truck-002',
    name: 'Truck 002',
    status: 'WARNING',
    gps: { lat: 40.7580, lng: -73.9855, speed: 35, heading: 90 },
    system: {
      signal: 65,
      voltage: 12.8,
      uptime: 7200,
      lastUpdate: Date.now(),
    },
    route: {
      actual: [
        { lat: 40.7580, lng: -73.9855 },
        { lat: 40.7600, lng: -73.9880 },
      ],
      expected: [
        { lat: 40.7580, lng: -73.9855 },
        { lat: 40.7650, lng: -73.9900 },
      ],
      geofence: [],
    },
    events: [
      { id: '1', timestamp: Date.now() - 120000, type: 'pressure_high', message: 'High pressure warning', severity: 'warning' },
    ],
  },
  'truck-003': {
    id: 'truck-003',
    name: 'Truck 003',
    status: 'CRITICAL',
    gps: { lat: 40.6892, lng: -74.0445, speed: 0, heading: 0 },
    system: {
      signal: 25,
      voltage: 11.5,
      uptime: 14400,
      lastUpdate: Date.now(),
    },
    route: {
      actual: [{ lat: 40.6892, lng: -74.0445 }],
      expected: [
        { lat: 40.6892, lng: -74.0445 },
        { lat: 40.6950, lng: -74.0500 },
      ],
      geofence: [],
    },
    events: [
      { id: '1', timestamp: Date.now() - 30000, type: 'leak_detected', message: 'Hydrogen leak detected', severity: 'critical' },
      { id: '2', timestamp: Date.now() - 60000, type: 'pressure_critical', message: 'Critical pressure level', severity: 'critical' },
    ],
  },
};

// Helper function to get the latest sensor data entry
const getLatestSensorData = (sensorData: Record<string, any>) => {
  if (!sensorData) return null;

  // Get all entries and find the one with the latest timestamp
  const entries = Object.entries(sensorData);
  if (entries.length === 0) return null;

  let latestEntry: [string, any] | null = null;
  let latestTimestamp = 0;

  for (const [key, value] of entries) {
    const timestamp = value?.timestamp || 0;
    if (timestamp > latestTimestamp) {
      latestTimestamp = timestamp;
      latestEntry = [key, value];
    }
  }

  return latestEntry ? latestEntry[1] : null;
};

export const useTruckData = (truckId: string) => {
  const [truckData, setTruckData] = useState<TruckData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('offline');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!truckId) {
      setLoading(false);
      return;
    }

    // Get mock data for the selected truck
    const mockData = mockTruckData[truckId] || mockTruckData['truck-001'];

    // Reference to sensorData in Firebase Realtime Database
    const sensorDataRef = ref(database, 'sensorData');

    // Listen for real-time updates from sensorData
    const unsubscribe = onValue(
      sensorDataRef,
      (snapshot) => {
        const sensorData = snapshot.val();
        const latestData = getLatestSensorData(sensorData);

        // Extract temperature and MQ8 (gas leak) from Firebase
        const temperature = latestData?.temperature ?? 0;
        const mq8Value = latestData?.mq8 ?? 0;

        // MQ8 threshold for leak detection (adjust as needed)
        // Typically MQ-8 sensors detect hydrogen at higher values
        const LEAK_THRESHOLD = 50; // Adjust based on your sensor calibration
        const leakDetected = mq8Value > LEAK_THRESHOLD;

        // Get mock pressure data for this truck
        const mockPressure = mockPressureData[truckId] || mockPressureData['truck-001'];

        // Combine Firebase sensor data with mock data
        const combinedData: TruckData = {
          ...mockData,
          tank: {
            // Real data from Firebase
            temp: {
              value: temperature,
              ambient: 22, // Mock ambient temperature
              unit: 'C',
            },
            leak: {
              detected: leakDetected,
              ppm: mq8Value,
            },
            // Mock pressure data
            pressure: mockPressure,
          },
        };

        setTruckData(combinedData);

        // Update connection status based on signal strength (from mock data)
        const signal = mockData.system.signal || 0;
        if (signal >= 70) {
          setConnectionStatus('online');
        } else if (signal >= 30) {
          setConnectionStatus('weak');
        } else {
          setConnectionStatus('offline');
        }

        setLoading(false);
      },
      (error) => {
        console.error('Error fetching sensor data from Firebase:', error);
        // Fallback to mock data if Firebase fails
        const mockData = mockTruckData[truckId] || mockTruckData['truck-001'];
        const mockPressure = mockPressureData[truckId] || mockPressureData['truck-001'];
        setTruckData({
          ...mockData,
          tank: {
            temp: {
              value: 0,
              ambient: 22,
              unit: 'C',
            },
            leak: {
              detected: false,
              ppm: 0,
            },
            pressure: mockPressure,
          },
        });
        setConnectionStatus('offline');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount or truckId change
    return () => {
      off(sensorDataRef);
    };
  }, [truckId]);

  return { truckData, connectionStatus, loading };
};
