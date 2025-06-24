
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Users, TrendingUp, Calendar, DollarSign, UserPlus, UserMinus, Clock, Target } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useDashboard } from '@/hooks/useDashboard';
import { useMemo } from 'react';

const WorkforceAnalytics = () => {
  const { employees } = useEmployees();
  const { stats } = useDashboard();

  const workforceGrowthData = useMemo(() => {
    const currentDate = new Date();
    const months = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Calculate employees hired up to this month
      const employeesUpToMonth = employees.filter(emp => {
        const startDate = emp.start_date ? new Date(emp.start_date) : new Date(emp.created_at);
        return startDate <= date;
      }).length;
      
      months.push({
        month: monthName,
        total: employeesUpToMonth,
        active: Math.floor(employeesUpToMonth * 0.95) // Assuming 95% retention
      });
    }
    
    return months;
  }, [employees]);

  const departmentData = useMemo(() => {
    const deptCounts = employees.reduce((acc, emp) => {
      const dept = emp.department_id || 'Unassigned';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deptCounts).map(([dept, count]) => ({
      department: dept === 'Unassigned' ? 'Unassigned' : `Dept ${dept.substring(0, 8)}`,
      count
    }));
  }, [employees]);

  const statusData = useMemo(() => {
    const statusCounts = employees.reduce((acc, emp) => {
      acc[emp.status] = (acc[emp.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = {
      active: '#10b981',
      inactive: '#ef4444', 
      pending: '#f59e0b'
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: colors[status as keyof typeof colors] || '#6b7280'
    }));
  }, [employees]);

  const avgTenure = useMemo(() => {
    if (employees.length === 0) return 0;
    
    const totalMonths = employees.reduce((sum, emp) => {
      const startDate = emp.start_date ? new Date(emp.start_date) : new Date(emp.created_at);
      const now = new Date();
      const months = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
      return sum + Math.max(0, months);
    }, 0);
    
    return Math.round(totalMonths / employees.length);
  }, [employees]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>Total Employees</span>
            </CardTitle>
            <CardDescription>As of today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{employees.length}</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>{employees.filter(e => e.status === 'active').length} active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-gray-500" />
              <span>New Hires</span>
            </CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.recentHires || 0}</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Last 30 days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserMinus className="w-4 h-4 text-gray-500" />
              <span>Attrition Rate</span>
            </CardTitle>
            <CardDescription>This year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {employees.length > 0 ? Math.round((employees.filter(e => e.status === 'inactive').length / employees.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-red-400" />
              <span>{employees.filter(e => e.status === 'inactive').length} inactive</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Avg. Tenure</span>
            </CardTitle>
            <CardDescription>Company average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgTenure}mo</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Target className="w-4 h-4 text-purple-400" />
              <span>Average months</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList>
          <TabsTrigger value="employees">Employee Trends</TabsTrigger>
          <TabsTrigger value="diversity">Department Distribution</TabsTrigger>
          <TabsTrigger value="performance">Employee Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Growth Trends</CardTitle>
              <CardDescription>Monthly employee count and growth patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {workforceGrowthData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={workforceGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Total Employees"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="active" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Active Employees"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>No employee data available for trends</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diversity">
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Employee distribution across departments</CardDescription>
            </CardHeader>
            <CardContent>
              {departmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4" />
                  <p>No department data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Employee Status Distribution</CardTitle>
              <CardDescription>Current employee status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>No status data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkforceAnalytics;
