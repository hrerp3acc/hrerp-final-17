
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: LucideIcon;
  className?: string;
}

const MetricCard = ({ title, value, change, icon: Icon, className }: MetricCardProps) => {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'increase':
        return '↗';
      case 'decrease':
        return '↘';
      case 'neutral':
        return '→';
      default:
        return '→';
    }
  };

  return (
    <div className={cn("bg-white rounded-xl p-6 shadow-sm border border-gray-200", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={cn(
              "text-sm mt-2 flex items-center",
              getChangeColor(change.type)
            )}>
              <span className="mr-1">
                {getChangeIcon(change.type)}
              </span>
              {change.type === 'neutral' 
                ? 'No change from last month'
                : `${Math.abs(change.value)}% from last month`
              }
            </p>
          )}
        </div>
        <div className="ml-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
