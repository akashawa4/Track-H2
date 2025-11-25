import { ReactNode } from 'react';
import { theme } from '../styles/theme';

interface SensorCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  status?: 'safe' | 'warning' | 'critical';
  subtitle?: string;
  children?: ReactNode;
}

export const SensorCard = ({
  icon,
  label,
  value,
  unit,
  status = 'safe',
  subtitle,
  children,
}: SensorCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'safe':
        return theme.colors.status.safe;
      case 'warning':
        return theme.colors.status.warning;
      case 'critical':
        return theme.colors.status.critical;
    }
  };

  const statusColor = getStatusColor();

  return (
    <div
      className="relative overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: theme.colors.background.card,
        borderRadius: theme.borderRadius.card,
        padding: theme.spacing.cardPadding,
        border: `2px solid ${status === 'safe' ? theme.colors.border : statusColor}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div style={{ color: statusColor }}>{icon}</div>
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: statusColor,
            animation: status === 'critical' ? 'pulse 2s infinite' : 'none',
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        <div
          className="font-bold text-center"
          style={{
            fontSize: theme.typography.sizes.value,
            color: theme.colors.text.primary,
          }}
        >
          {value}
          {unit && (
            <span className="ml-1 text-xl" style={{ color: theme.colors.text.secondary }}>
              {unit}
            </span>
          )}
        </div>
        {subtitle && (
          <div
            className="text-sm mt-1"
            style={{ color: theme.colors.text.secondary }}
          >
            {subtitle}
          </div>
        )}
      </div>

      <div
        className="text-sm font-medium"
        style={{ color: theme.colors.text.secondary }}
      >
        {label}
      </div>

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
};
