import { useEffect, useState } from 'react';
import { theme } from '../styles/theme';

interface TimeAgoProps {
  timestamp: number;
}

export const TimeAgo = ({ timestamp }: TimeAgoProps) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeAgo(`${minutes}m ago`);
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`${hours}h ago`);
      } else {
        const days = Math.floor(seconds / 86400);
        setTimeAgo(`${days}d ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
      Last updated: {timeAgo}
    </span>
  );
};
