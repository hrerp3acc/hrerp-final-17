
import { useDashboard } from '@/hooks/useDashboard';
import { useInterconnectivity } from '@/hooks/useInterconnectivity';
import MetricCard from '@/components/Dashboard/MetricCard';
import QuickActions from '@/components/Dashboard/QuickActions';
import RecentActivities from '@/components/Dashboard/RecentActivities';
import AttendanceChart from '@/components/Dashboard/Charts/AttendanceChart';
import PerformanceChart from '@/components/Dashboard/Charts/PerformanceChart';
import { Users, Calendar, Briefcase, TrendingUp, Clock, Award } from 'lucide-react';

const Dashboard = () => {
  const { stats, recentActivities, loading, refreshDashboard } = useDashboard();
  useInterconnectivity(); // Enable cross-module synchronization

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button 
          onClick={refreshDashboard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Employees"
          value={stats?.totalEmployees || 0}
          icon={Users}
          trend={`${stats?.recentHires || 0} new this month`}
          color="blue"
        />
        <MetricCard
          title="Active Employees"
          value={stats?.activeEmployees || 0}
          icon={Users}
          trend={`${Math.round(((stats?.activeEmployees || 0) / (stats?.totalEmployees || 1)) * 100)}% active`}
          color="green"
        />
        <MetricCard
          title="Pending Leaves"
          value={stats?.pendingLeaves || 0}
          icon={Calendar}
          trend="Awaiting approval"
          color="yellow"
        />
        <MetricCard
          title="Open Positions"
          value={stats?.openPositions || 0}
          icon={Briefcase}
          trend="Active job postings"
          color="purple"
        />
        <MetricCard
          title="Avg Attendance"
          value={`${stats?.avgAttendance || 0}h`}
          icon={Clock}
          trend="Daily average"
          color="indigo"
        />
        <MetricCard
          title="Completed Trainings"
          value={stats?.completedTrainings || 0}
          icon={Award}
          trend="This month"
          color="emerald"
        />
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <PerformanceChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <RecentActivities activities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;
