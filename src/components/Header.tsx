import { User } from 'lucide-react';
import { theme } from '../styles/theme';
import { ConnectionStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { TimeAgo } from './TimeAgo';

interface HeaderProps {
  selectedTruck: string;
  trucks: string[];
  onTruckChange: (truckId: string) => void;
  connectionStatus: ConnectionStatus;
  lastUpdate: number;
}

export const Header = ({
  selectedTruck,
  trucks,
  onTruckChange,
  connectionStatus,
  lastUpdate,
}: HeaderProps) => {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6"
      style={{
        height: theme.layout.headerHeight,
        backgroundColor: theme.colors.background.primary,
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <div>
        <h1
          className="text-xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          H₂ Transport Monitor
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={selectedTruck}
          onChange={(e) => onTruckChange(e.target.value)}
          className="px-4 py-2 rounded-lg text-sm font-medium outline-none cursor-pointer"
          style={{
            backgroundColor: theme.colors.background.panel,
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.button,
          }}
        >
          {trucks.map((truck) => (
            <option key={truck} value={truck}>
              {truck}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-6">
        <StatusBadge status={connectionStatus} />
        <TimeAgo timestamp={lastUpdate} />
        <button
          className="p-2 rounded-lg hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: theme.colors.background.panel,
            color: theme.colors.text.primary,
          }}
        >
          <User size={20} />
        </button>
      </div>
    </header>
  );
};
