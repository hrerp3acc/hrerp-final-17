
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
import { useDashboard } from '@/hooks/useDashboard';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';
import { useLearningDevelopment } from '@/hooks/useLearningDevelopment';
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileText,
  Target,
  BookOpen,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const { employees, getEmployeeStats, loading: employeesLoading } = useSupabaseEmployees();
  const { attendanceRecords, getTodaysAttendance } = useAttendance();
  const { activeEntry, getTimeStats } = useTimeTracking();
  const { timesheets } = useTimesheets();
  const { stats, recentActivities } = useDashboard();
  const { goals } = usePerformanceManagement();
  const { enrollments, courses } = useLearningDevelopment();

  const employeeStats = getEmployeeStats();
  const timeStats = getTimeStats();
  const todaysAttendance = getTodaysAttendance();

  // Calculate performance metrics
  const activeGoals = goals.filter(g => g.status !== 'completed').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const goalCompletionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  // Calculate learning metrics
  const activeEnrollments = enrollments.filter(e => e.status === 'enrolled').length;
  const completedCourses = enrollments.filter(e => e.status === 'completed').length;
  const totalCourses = courses.length;

  // Calculate pending items
  const pendingTimesheets = timesheets.filter(t => t.status === 'draft').length;
  const submittedTimesheets = timesheets.filter(t => t.status === 'submitted').length;

  const dashboardMetrics = [
    {
      title: "Total Employees",
      value: employeeStats.total.toString(),
      change: {
        value: employeeStats.active > 0 ? Math.round(((employeeStats.active / employeeStats.total) * 100) - 90) : 0,
        type: employeeStats.active / employeeStats.total > 0.9 ? "increase" as const : "decrease" as const
      },
      trend: employeeStats.active / employeeStats.total > 0.9 ? "up" as const : "down" as const,
      icon: Users,
      color: "blue"
    },
    {
      title: "Active Goals",
      value: activeGoals.toString(),
      change: {
        value: goalCompletionRate,
        type: goalCompletionRate > 70 ? "increase" as const : goalCompletionRate > 40 ? "neutral" as const : "decrease" as const
      },
      trend: goalCompletionRate > 70 ? "up" as const : "neutral" as const,
      icon: Target,
      color: "green"
    },
    {
      title: "Pending Reviews",
      value: pendingTimesheets.toString(),
      change: {
        value: submittedTimesheets,
        type: submittedTimesheets > pendingTimesheets ? "increase" as const : "neutral" as const
      },
      trend: submittedTimesheets > pendingTimesheets ? "up" as const : "neutral" as const,
      icon: FileText,
      color: "orange"
    },
    {
      title: "Learning Progress",
      value: `${completedCourses}/${totalCourses}`,
      change: {
        value: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0,
        type: completedCourses > activeEnrollments ? "increase" as const : "neutral" as const
      },
      trend: "up" as const,
      icon: BookOpen,
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
            <p className="text-sm text-gray-500 mt-1">
              Weekly: {timeStats.week.toFixed(1)}/40 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Active Goals</span>
                <span className="text-sm font-medium">{activeGoals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Completed</span>
                <span className="text-sm font-medium text-green-600">{completedGoals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-bold">{goalCompletionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Learning & Development</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Available Courses</span>
                <span className="text-sm font-medium">{totalCourses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Enrolled</span>
                <span className="text-sm font-medium text-blue-600">{activeEnrollments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Completed</span>
                <span className="text-sm font-bold text-green-600">{completedCourses}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats?.totalEmployees || employeeStats.total}</div>
                <div className="text-sm text-gray-600">Total Employees</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats?.activeEmployees || employeeStats.active}</div>
                <div className="text-sm text-gray-600">Active Employees</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats?.pendingLeaves || 0}</div>
                <div className="text-sm text-gray-600">Pending Leaves</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats?.upcomingReviews || pendingTimesheets}</div>
                <div className="text-sm text-gray-600">Pending Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Status</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Sync</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Real-time</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Updated</span>
                <span className="text-xs text-gray-600">Just now</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Sessions</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {activeEntry ? '1 Active' : 'None'}
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
          <RecentActivities activities={recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
