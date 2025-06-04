
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  className?: string;
}

const MetricCard = ({ title, value, change, icon: Icon, className }: MetricCardProps) => {
  return (
    <div className={cn("bg-white rounded-xl p-6 shadow-sm border border-gray-200", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={cn(
              "text-sm mt-2 flex items-center",
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            )}>
              <span className="mr-1">
                {change.type === 'increase' ? '↗' : '↘'}
              </span>
              {Math.abs(change.value)}% from last month
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
