import { Wifi, Battery, Clock } from 'lucide-react';
import { theme } from '../styles/theme';

interface ConnectivityCardProps {
  signal: number;
  voltage: number;
  uptime: number;
}

export const ConnectivityCard = ({ signal, voltage, uptime }: ConnectivityCardProps) => {
  const getSignalBars = () => {
    const bars = Math.ceil((signal / 100) * 4);
    return Array.from({ length: 4 }, (_, i) => i < bars);
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatus = (): 'safe' | 'warning' | 'critical' => {
    if (signal < 30 || voltage < 11) return 'critical';
    if (signal < 50 || voltage < 11.5) return 'warning';
    return 'safe';
  };

  const statusColor = getStatus() === 'safe'
    ? theme.colors.status.safe
    : getStatus() === 'warning'
    ? theme.colors.status.warning
    : theme.colors.status.critical;

  return (
    <div
      className="relative overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: theme.colors.background.card,
        borderRadius: theme.borderRadius.card,
        padding: theme.spacing.cardPadding,
        border: `2px solid ${getStatus() === 'safe' ? theme.colors.border : statusColor}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div style={{ color: statusColor }}>
          <Wifi size={24} />
        </div>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: statusColor }}
        />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wifi size={16} style={{ color: theme.colors.text.secondary }} />
            <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
              Signal Strength
            </span>
          </div>
          <div className="flex items-center gap-1">
            {getSignalBars().map((active, idx) => (
              <div
                key={idx}
                className="w-2 rounded-sm transition-colors"
                style={{
                  height: `${(idx + 1) * 5}px`,
                  backgroundColor: active ? statusColor : theme.colors.border,
                }}
              />
            ))}
            <span className="ml-2 font-bold" style={{ color: theme.colors.text.primary }}>
              {signal}%
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Battery size={16} style={{ color: theme.colors.text.secondary }} />
            <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
              Voltage
            </span>
          </div>
          <div className="font-bold" style={{ color: theme.colors.text.primary }}>
            {voltage.toFixed(2)}V
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} style={{ color: theme.colors.text.secondary }} />
            <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
              Uptime
            </span>
          </div>
          <div className="font-bold" style={{ color: theme.colors.text.primary }}>
            {formatUptime(uptime)}
          </div>
        </div>
      </div>

      <div
        className="text-sm font-medium mt-4"
        style={{ color: theme.colors.text.secondary }}
      >
        Connectivity & Power
      </div>
    </div>
  );
};
