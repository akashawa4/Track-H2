import { Gauge } from 'lucide-react';
import { SensorCard } from './SensorCard';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { theme } from '../styles/theme';

interface PressureCardProps {
  value: number;
  threshold: number;
  unit: string;
  history: number[];
}

export const PressureCard = ({ value, threshold, unit, history }: PressureCardProps) => {
  const getStatus = (): 'safe' | 'warning' | 'critical' => {
    const warningThreshold = threshold * 1.1;
    const criticalThreshold = threshold * 1.2;

    if (value >= criticalThreshold) return 'critical';
    if (value >= warningThreshold) return 'warning';
    return 'safe';
  };

  const chartData = history.slice(-20).map((val, idx) => ({ value: val, index: idx }));

  // Ensure we always have at least one data point to prevent Recharts errors
  const safeChartData = chartData.length > 0 ? chartData : [{ value, index: 0 }];

  return (
    <SensorCard
      icon={<Gauge size={24} />}
      label="Tank Pressure"
      value={value.toFixed(1)}
      unit={unit}
      status={getStatus()}
      subtitle={`Threshold: ${threshold} ${unit}`}
    >
      <div style={{ width: '100%', marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
        <LineChart
          width={220}
          height={40}
          data={safeChartData}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <Line
            type="monotone"
            dataKey="value"
            stroke={theme.colors.status.action}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </div>
    </SensorCard>
  );
};
