import { useState, useEffect } from 'react';
import { theme } from './styles/theme';
import { useTruckData } from './hooks/useTruckData';
import { Header } from './components/Header';
import { AlertBanner } from './components/AlertBanner';
import { LiveMap } from './components/LiveMap';
import { LeakCard } from './components/LeakCard';
import { PressureCard } from './components/PressureCard';
import { TemperatureCard } from './components/TemperatureCard';
import { ConnectivityCard } from './components/ConnectivityCard';
import { AdvancedPanels } from './components/AdvancedPanels';
import { EventTimeline } from './components/EventTimeline';

function App() {
  const [selectedTruck, setSelectedTruck] = useState('truck-001');
  const [showAlert, setShowAlert] = useState(true);
  const trucks = ['truck-001', 'truck-002', 'truck-003'];

  const { truckData, connectionStatus } = useTruckData(selectedTruck);

  const getAlertMessage = () => {
    if (!truckData) return null;

    if (truckData.tank.leak.detected) {
      return {
        severity: 'critical' as const,
        message: 'CRITICAL: Hydrogen leak detected - Immediate action required',
      };
    }

    if (truckData.tank.pressure.value > truckData.tank.pressure.threshold * 1.2) {
      return {
        severity: 'critical' as const,
        message: 'CRITICAL: Tank pressure exceeds safe limits',
      };
    }

    if (truckData.tank.pressure.value > truckData.tank.pressure.threshold * 1.1) {
      return {
        severity: 'warning' as const,
        message: 'WARNING: Tank pressure approaching threshold',
      };
    }

    return null;
  };

  const alert = getAlertMessage();

  useEffect(() => {
    if (alert) {
      setShowAlert(true);
    }
  }, [alert]);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.colors.background.primary,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <Header
        selectedTruck={selectedTruck}
        trucks={trucks}
        onTruckChange={setSelectedTruck}
        connectionStatus={connectionStatus}
        lastUpdate={truckData?.system.lastUpdate || Date.now()}
      />

      {alert && showAlert && (
        <AlertBanner
          severity={alert.severity}
          message={alert.message}
          onDismiss={() => setShowAlert(false)}
        />
      )}

      <main style={{ padding: theme.spacing.page }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[600px]">
          <div className="lg:col-span-3 h-full">
            <LiveMap truckData={truckData} />
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <LeakCard
              detected={truckData?.tank.leak.detected || false}
              ppm={truckData?.tank.leak.ppm}
            />
            <PressureCard
              value={truckData?.tank.pressure.value || 0}
              threshold={truckData?.tank.pressure.threshold || 100}
              unit={truckData?.tank.pressure.unit || 'bar'}
              history={truckData?.tank.pressure.history || []}
            />
            <TemperatureCard
              value={truckData?.tank.temp.value || 0}
              ambient={truckData?.tank.temp.ambient}
              unit={truckData?.tank.temp.unit || 'C'}
            />
            <ConnectivityCard
              signal={truckData?.system.signal || 0}
              voltage={truckData?.system.voltage || 0}
              uptime={truckData?.system.uptime || 0}
            />
          </div>
        </div>

        <AdvancedPanels truckData={truckData} />
        <EventTimeline events={truckData?.events || []} />
      </main>
    </div>
  );
}

export default App;
