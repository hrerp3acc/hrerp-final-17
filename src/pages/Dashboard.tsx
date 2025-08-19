
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import { useSupabaseAnalytics } from '@/hooks/useSupabaseAnalytics';
import QuickActions from '@/components/Dashboard/QuickActions';
import NotificationCenter from '@/components/Notifications/NotificationCenter';
import AttendanceHeatmap from '@/components/Dashboard/Charts/AttendanceHeatmap';
import RadialPerformanceChart from '@/components/Dashboard/Charts/RadialPerformanceChart';
import DepartmentGrowthChart from '@/components/Dashboard/Charts/DepartmentGrowthChart';
import MultiMetricTimeSeriesChart from '@/components/Dashboard/Charts/MultiMetricTimeSeriesChart';

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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Executive Dashboard
        </h1>
        <div className="text-sm text-muted-foreground">
          Real-time HR Analytics
        </div>
      </div>

      {/* Quick Stats - Simplified */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-chart-1/10">
                <Users className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                <div className="text-xs text-muted-foreground">Total Employees</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-chart-2/10">
                <UserCheck className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.activeEmployees}</div>
                <div className="text-xs text-muted-foreground">Active Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-chart-3/10">
                <TrendingUp className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <div className="text-2xl font-bold">{events.length}</div>
                <div className="text-xs text-muted-foreground">System Events</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-chart-4/10">
                <Clock className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <div className="text-2xl font-bold">{moduleStats.length}</div>
                <div className="text-xs text-muted-foreground">Active Modules</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RadialPerformanceChart />
        <DepartmentGrowthChart />
      </div>

      {/* Advanced Analytics Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        <MultiMetricTimeSeriesChart />
      </div>

      {/* Advanced Analytics Row 3 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AttendanceHeatmap />
        </div>
        
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Notifications Panel */}
          <NotificationCenter />
        </div>
      </div>

      {/* Department Stats - Enhanced */}
      <Card className="bg-gradient-to-r from-muted/50 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Department Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.departmentStats.map((dept, index) => (
              <div 
                key={index} 
                className="text-center p-4 rounded-lg border bg-card hover:shadow-md transition-all"
              >
                <div className="text-2xl font-bold text-primary">{dept.count}</div>
                <div className="text-sm font-medium">{dept.department}</div>
                <div className="text-xs text-muted-foreground">employees</div>
              </div>
            ))}
            
            {moduleStats.map((module, index) => (
              <div 
                key={`module-${index}`} 
                className="text-center p-4 rounded-lg border bg-card/50 hover:shadow-md transition-all"
              >
                <div className="text-2xl font-bold text-chart-3">{module.count}</div>
                <div className="text-sm font-medium capitalize">{module.module}</div>
                <div className="text-xs text-muted-foreground">events</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
