
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuickStats from '@/components/Dashboard/QuickStats';
import QuickActions from '@/components/Dashboard/QuickActions';
import RecentActivities from '@/components/Dashboard/RecentActivities';
import MetricCard from '@/components/Dashboard/MetricCard';
import NavigationBreadcrumb from '@/components/Common/NavigationBreadcrumb';
import CrossModuleLinks from '@/components/Common/CrossModuleLinks';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import { useAttendance } from '@/hooks/useAttendance';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { useTimesheets } from '@/hooks/useTimesheets';
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileText,
  Target
} from 'lucide-react';

const Dashboard = () => {
  const { employees, getEmployeeStats, loading: employeesLoading } = useSupabaseEmployees();
  const { attendanceRecords, getTodaysAttendance } = useAttendance();
  const { activeEntry, getTimeStats } = useTimeTracking();
  const { timesheets } = useTimesheets();

  const employeeStats = getEmployeeStats();
  const timeStats = getTimeStats();
  const todaysAttendance = getTodaysAttendance();

  const dashboardMetrics = [
    {
      title: "Total Employees",
      value: employeeStats.total.toString(),
      change: "+2 this month",
      trend: "up" as const,
      icon: Users,
      color: "blue"
    },
    {
      title: "Today's Hours",
      value: timeStats.today.toFixed(1),
      change: "vs 8h target",
      trend: timeStats.today >= 8 ? "up" as const : "down" as const,
      icon: Clock,
      color: "green"
    },
    {
      title: "Pending Timesheets",
      value: timesheets.filter(t => t.status === 'draft').length.toString(),
      change: "needs approval",
      trend: "neutral" as const,
      icon: FileText,
      color: "orange"
    },
    {
      title: "Active Employees",
      value: employeeStats.active.toString(),
      change: `${((employeeStats.active / employeeStats.total) * 100).toFixed(1)}% active`,
      trend: "up" as const,
      icon: Target,
      color: "purple"
    }
  ];

  return (
    <div className="space-y-6">
      <NavigationBreadcrumb />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            trend={metric.trend}
            icon={metric.icon}
            color={metric.color}
          />
        ))}
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Time Tracking Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeEntry ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Timer Running</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500">
                <AlertCircle className="w-4 h-4" />
                <span>No Active Timer</span>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Today: {timeStats.today.toFixed(1)} hours tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Team Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Active</span>
                <span className="text-sm font-medium">{employeeStats.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Inactive</span>
                <span className="text-sm font-medium">{employeeStats.inactive}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total</span>
                <span className="text-sm font-bold">{employeeStats.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Weekly Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">This Week</span>
                <span className="text-sm font-medium">{timeStats.week.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Daily Average</span>
                <span className="text-sm font-medium">{timeStats.average.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Target: 40h</span>
                <span className="text-sm font-bold text-green-600">
                  {((timeStats.week / 40) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <QuickStats />
          <CrossModuleLinks 
            currentModule="dashboard"
            relatedModules={['employees', 'time', 'reports']}
          />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
