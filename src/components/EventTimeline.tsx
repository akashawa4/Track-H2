import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { theme } from '../styles/theme';
import { Event } from '../types';

interface EventTimelineProps {
  events: Event[];
}

export const EventTimeline = ({ events }: EventTimelineProps) => {
  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'leak':
      case 'pressure':
      case 'temperature':
        return AlertTriangle;
      case 'route':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getEventColor = (severity: Event['severity']) => {
    switch (severity) {
      case 'critical':
        return theme.colors.status.critical;
      case 'warning':
        return theme.colors.status.warning;
      default:
        return theme.colors.status.action;
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div
      className="w-full mt-4 p-4"
      style={{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.card,
      }}
    >
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: theme.colors.text.primary }}
      >
        Event Timeline
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {events.length === 0 ? (
          <div
            className="text-center py-8"
            style={{ color: theme.colors.text.secondary }}
          >
            No events recorded
          </div>
        ) : (
          events.map((event) => {
            const Icon = getEventIcon(event.type);
            const color = getEventColor(event.severity);

            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.background.card,
                }}
              >
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {event.message}
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    {formatTime(event.timestamp)}
                  </div>
                </div>

                <div
                  className="text-xs px-2 py-1 rounded flex-shrink-0"
                  style={{
                    backgroundColor: `${color}20`,
                    color,
                  }}
                >
                  {event.severity.toUpperCase()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
