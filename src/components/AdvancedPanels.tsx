import { useState } from 'react';
import { Activity, CloudRain, Wrench, Bell } from 'lucide-react';
import { theme } from '../styles/theme';
import { TruckData } from '../types';

interface AdvancedPanelsProps {
  truckData: TruckData | null;
}

type TabType = 'tank' | 'environment' | 'diagnostics' | 'alerts';

export const AdvancedPanels = ({ truckData }: AdvancedPanelsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('tank');

  const tabs = [
    { id: 'tank' as TabType, label: 'Tank Health', icon: Activity },
    { id: 'environment' as TabType, label: 'Environment', icon: CloudRain },
    { id: 'diagnostics' as TabType, label: 'Diagnostics', icon: Wrench },
    { id: 'alerts' as TabType, label: 'Alerts', icon: Bell },
  ];

  return (
    <div
      className="w-full mt-4"
      style={{
        backgroundColor: theme.colors.background.card,
        borderRadius: theme.borderRadius.card,
        padding: theme.spacing.cardPadding,
      }}
    >
      <div className="flex border-b" style={{ borderColor: theme.colors.border }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-6 py-3 transition-all"
              style={{
                color: activeTab === tab.id
                  ? theme.colors.text.primary
                  : theme.colors.text.secondary,
                borderBottom: activeTab === tab.id
                  ? `2px solid ${theme.colors.status.action}`
                  : '2px solid transparent',
                fontWeight: activeTab === tab.id ? 600 : 400,
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="py-4">
        {activeTab === 'tank' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Pressure Status"
                value={truckData ? `${truckData.tank.pressure.value} ${truckData.tank.pressure.unit}` : 'N/A'}
              />
              <InfoItem
                label="Temperature"
                value={truckData ? `${truckData.tank.temp.value}°${truckData.tank.temp.unit}` : 'N/A'}
              />
              <InfoItem
                label="Leak Detection"
                value={truckData?.tank.leak.detected ? 'LEAK DETECTED' : 'Normal'}
                status={truckData?.tank.leak.detected ? 'critical' : 'safe'}
              />
              <InfoItem
                label="Capacity Utilization"
                value="78%"
              />
            </div>
          </div>
        )}

        {activeTab === 'environment' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Ambient Temp" value={truckData?.tank.temp.ambient ? `${truckData.tank.temp.ambient}°C` : 'N/A'} />
              <InfoItem label="Humidity" value="45%" />
              <InfoItem label="Atmospheric Pressure" value="1013 hPa" />
              <InfoItem label="Vibration Level" value="Low" status="safe" />
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="System Voltage" value={truckData ? `${truckData.system.voltage}V` : 'N/A'} />
              <InfoItem label="Signal Strength" value={truckData ? `${truckData.system.signal}%` : 'N/A'} />
              <InfoItem label="GPS Accuracy" value="High" status="safe" />
              <InfoItem label="Sensor Health" value="All OK" status="safe" />
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-2">
            {truckData?.events.filter(e => e.severity !== 'info').slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: theme.colors.background.panel,
                  borderLeft: `3px solid ${
                    event.severity === 'critical'
                      ? theme.colors.status.critical
                      : theme.colors.status.warning
                  }`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ color: theme.colors.text.primary }}>{event.message}</span>
                  <span className="text-xs" style={{ color: theme.colors.text.secondary }}>
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {(!truckData || truckData.events.filter(e => e.severity !== 'info').length === 0) && (
              <div className="text-center py-6" style={{ color: theme.colors.text.secondary }}>
                No active alerts
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  status?: 'safe' | 'warning' | 'critical';
}

const InfoItem = ({ label, value, status }: InfoItemProps) => {
  const statusColor = status === 'critical'
    ? theme.colors.status.critical
    : status === 'warning'
    ? theme.colors.status.warning
    : status === 'safe'
    ? theme.colors.status.safe
    : theme.colors.text.primary;

  return (
    <div
      className="p-3 rounded-lg"
      style={{ backgroundColor: theme.colors.background.panel }}
    >
      <div className="text-sm mb-1" style={{ color: theme.colors.text.secondary }}>
        {label}
      </div>
      <div className="font-semibold" style={{ color: statusColor }}>
        {value}
      </div>
    </div>
  );
};
