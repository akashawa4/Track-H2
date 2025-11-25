import { AlertTriangle } from 'lucide-react';
import { SensorCard } from './SensorCard';

interface LeakCardProps {
  detected: boolean;
  ppm?: number;
}

export const LeakCard = ({ detected, ppm }: LeakCardProps) => {
  return (
    <SensorCard
      icon={<AlertTriangle size={24} />}
      label="Hydrogen Leak (MQ-8)"
      value={detected ? 'LEAK DETECTED' : 'NO LEAK'}
      subtitle={ppm !== undefined ? `${ppm} PPM` : undefined}
      status={detected ? 'critical' : 'safe'}
    />
  );
};
