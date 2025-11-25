import { AlertTriangle, X } from 'lucide-react';
import { theme } from '../styles/theme';
import { useState } from 'react';

interface AlertBannerProps {
  severity: 'critical' | 'warning';
  message: string;
  onDismiss?: () => void;
}

export const AlertBanner = ({ severity, message, onDismiss }: AlertBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const backgroundColor = severity === 'critical'
    ? theme.colors.status.critical
    : theme.colors.status.warning;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className="flex items-center justify-between px-6 animate-slideDown"
      style={{
        height: theme.layout.alertBannerHeight,
        backgroundColor,
        color: '#FFFFFF',
      }}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle size={20} />
        <span className="font-semibold text-sm">{message}</span>
      </div>

      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="p-1 hover:opacity-80 transition-opacity"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
