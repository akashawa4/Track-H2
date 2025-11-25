import { Thermometer } from 'lucide-react';
import { SensorCard } from './SensorCard';

interface TemperatureCardProps {
  value: number;
  ambient?: number;
  unit: string;
}

export const TemperatureCard = ({ value, ambient, unit }: TemperatureCardProps) => {
  const getStatus = (): 'safe' | 'warning' | 'critical' => {
    if (value > 80) return 'critical';
    if (value > 60) return 'warning';
    return 'safe';
  };

  return (
    <SensorCard
      icon={<Thermometer size={24} />}
      label="Temperature"
      value={value.toFixed(1)}
      unit={`°${unit}`}
      status={getStatus()}
      subtitle={ambient !== undefined ? `Ambient: ${ambient.toFixed(1)}°${unit}` : undefined}
    />
  );
};
