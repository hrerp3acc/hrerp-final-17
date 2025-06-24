
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Calendar, Clock, TrendingUp, AlertTriangle, Target, BookOpen } from 'lucide-react';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';
import { useLearningDevelopment } from '@/hooks/useLearningDevelopment';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { useDashboard } from '@/hooks/useDashboard';

const QuickStats = () => {
  const { getEmployeeStats } = useSupabaseEmployees();
  const { goals } = usePerformanceManagement();
  const { enrollments, courses } = useLearningDevelopment();
  const { getTimeStats } = useTimeTracking();
  const { stats } = useDashboard();

  const employeeStats = getEmployeeStats();
  const timeStats = getTimeStats();

  // Calculate performance metrics
  const activeGoals = goals.filter(g => g.status !== 'completed').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  
  // Calculate learning metrics
  const activeEnrollments = enrollments.filter(e => e.status === 'enrolled').length;
  const completedCourses = enrollments.filter(e => e.status === 'completed').length;

  const quickStats = [
    {
      title: 'Active Employees',
      value: employeeStats.active.toString(),
      change: `${employeeStats.total} total`,
      changeType: 'neutral' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Today\'s Hours',
      value: timeStats.today.toFixed(1) + 'h',
      change: `${timeStats.week.toFixed(1)}h this week`,
      changeType: timeStats.today >= 8 ? 'positive' as const : 'negative' as const,
      icon: Clock,
      color: 'green'
    },
    {
      title: 'Active Goals',
      value: activeGoals.toString(),
      change: `${completedGoals} completed`,
      changeType: completedGoals > activeGoals ? 'positive' as const : 'neutral' as const,
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Learning Progress',
      value: activeEnrollments.toString(),
      change: `${completedCourses} completed`,
      changeType: completedCourses > 0 ? 'positive' as const : 'neutral' as const,
      icon: BookOpen,
      color: 'orange'
    },
    {
      title: 'Pending Leaves',
      value: (stats?.pendingLeaves || 0).toString(),
      change: 'Awaiting approval',
      changeType: 'neutral' as const,
      icon: Calendar,
      color: 'yellow'
    },
    {
      title: 'Open Positions',
      value: (stats?.openPositions || 0).toString(),
      change: 'Active recruiting',
      changeType: 'neutral' as const,
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStats.map((stat) => (
            <div key={stat.title} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className={`text-xs ${getChangeColor(stat.changeType)}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStats;
