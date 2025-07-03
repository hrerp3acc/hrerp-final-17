
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import { useSupabaseAnalytics } from '@/hooks/useSupabaseAnalytics';
import QuickActions from '@/components/Dashboard/QuickActions';
import NotificationCenter from '@/components/Notifications/NotificationCenter';

const Dashboard = () => {
  const { employees, loading: employeesLoading, getEmployeeStats } = useSupabaseEmployees();
  const { events, loading: analyticsLoading, getModuleStats } = useSupabaseAnalytics();
  
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departmentStats: [] as Array<{ department: string; count: number }>
  });

  useEffect(() => {
    if (!employeesLoading) {
      const employeeStats = getEmployeeStats();
      setStats({
        totalEmployees: employeeStats.total,
        activeEmployees: employeeStats.active,
        departmentStats: employeeStats.byDepartment
      });
    }
  }, [employees, employeesLoading, getEmployeeStats]);

  const moduleStats = getModuleStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moduleStats.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Department Distribution */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.departmentStats.map((dept, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <span className="text-sm text-gray-600">{dept.count} employees</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Panel */}
        <div className="lg:col-span-1">
          <NotificationCenter />
        </div>
      </div>

      {/* Module Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Module Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moduleStats.map((module, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <h4 className="font-medium capitalize">{module.module}</h4>
                <p className="text-2xl font-bold text-blue-600">{module.count}</p>
                <p className="text-xs text-gray-500">events</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
