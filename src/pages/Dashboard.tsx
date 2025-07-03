
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Clock, TrendingUp, Building, UserCheck, AlertCircle } from "lucide-react";
import { useSupabaseEmployees } from "@/hooks/useSupabaseEmployees";
import { useSupabaseAnalytics } from "@/hooks/useSupabaseAnalytics";
import { useEffect } from "react";

const Dashboard = () => {
  const { employees, departments, loading: employeesLoading, getEmployeeStats } = useSupabaseEmployees();
  const { trackEvent, getModuleStats, loading: analyticsLoading } = useSupabaseAnalytics();

  useEffect(() => {
    // Track dashboard visit
    trackEvent('page_visit', { page: 'dashboard' }, 'dashboard');
  }, []);

  const stats = getEmployeeStats();
  const moduleStats = getModuleStats();

  if (employeesLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your HR management system</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
              <Building className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inactive}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.byDepartment.map((dept, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{dept.department}</span>
                  <span className="text-sm text-gray-600">{dept.count} employees</span>
                </div>
              ))}
              {stats.byDepartment.length === 0 && (
                <p className="text-gray-500 text-center">No department data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">{stat.module}</span>
                  <span className="text-sm text-gray-600">{stat.count} events</span>
                </div>
              ))}
              {moduleStats.length === 0 && (
                <p className="text-gray-500 text-center">No activity data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium">Add Employee</h3>
                <p className="text-sm text-gray-600">Add a new team member</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium">Leave Requests</h3>
                <p className="text-sm text-gray-600">Manage leave applications</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium">Analytics</h3>
                <p className="text-sm text-gray-600">View performance metrics</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
