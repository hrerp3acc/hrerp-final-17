
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: LucideIcon;
  color?: string;
  className?: string;
}

const MetricCard = ({ title, value, trend, change, icon: Icon, color = 'blue', className }: MetricCardProps) => {
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

  const getColorClasses = (colorName: string) => {
    switch (colorName) {
      case 'green':
        return 'bg-green-50 text-green-600';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600';
      case 'purple':
        return 'bg-purple-50 text-purple-600';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-600';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-600';
      case 'blue':
      default:
        return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <div className={cn("bg-white rounded-xl p-6 shadow-sm border border-gray-200", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-gray-500 mt-2">
              {trend}
            </p>
          )}
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
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", getColorClasses(color))}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
