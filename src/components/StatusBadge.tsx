import { theme } from '../styles/theme';
import { ConnectionStatus } from '../types';

interface StatusBadgeProps {
  status: ConnectionStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return theme.colors.status.safe;
      case 'weak':
        return theme.colors.status.warning;
      case 'offline':
        return theme.colors.status.critical;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'weak':
        return 'Weak Signal';
      case 'offline':
        return 'Offline';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: getStatusColor() }}
      />
      <span className="text-sm" style={{ color: theme.colors.text.primary }}>
        {getStatusText()}
      </span>
    </div>
  );
};
