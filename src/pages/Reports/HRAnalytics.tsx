
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseEmployees } from "@/hooks/useSupabaseEmployees";
import { useAttendance } from "@/hooks/useAttendance";
import { usePerformanceManagement } from "@/hooks/usePerformanceManagement";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, Clock, Target } from "lucide-react";

const HRAnalytics = () => {
  const { employees, getEmployeeStats } = useSupabaseEmployees();
  const { attendanceRecords } = useAttendance();
  const { goals } = usePerformanceManagement();

  const employeeStats = getEmployeeStats();

  const departmentData = employeeStats.byDepartment.map(dept => ({
    name: dept.department,
    employees: dept.count
  }));

  const attendanceData = [
    { month: 'Jan', attendance: 95 },
    { month: 'Feb', attendance: 92 },
    { month: 'Mar', attendance: 88 },
    { month: 'Apr', attendance: 94 },
    { month: 'May', attendance: 91 },
    { month: 'Jun', attendance: 89 }
  ];

  const performanceData = [
    { category: 'Completed', value: goals.filter(g => g.status === 'completed').length, color: '#10b981' },
    { category: 'In Progress', value: goals.filter(g => g.status === 'in_progress').length, color: '#3b82f6' },
    { category: 'Not Started', value: goals.filter(g => g.status === 'not_started').length, color: '#f59e0b' },
    { category: 'On Hold', value: goals.filter(g => g.status === 'on_hold').length, color: '#ef4444' }
  ];

  const hireTrendData = [
    { month: 'Jan', hires: 5, departures: 2 },
    { month: 'Feb', hires: 3, departures: 1 },
    { month: 'Mar', hires: 7, departures: 3 },
    { month: 'Apr', hires: 4, departures: 2 },
    { month: 'May', hires: 6, departures: 1 },
    { month: 'Jun', hires: 8, departures: 4 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">HR Analytics</h1>
        <p className="text-gray-600">Comprehensive HR metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold">{employeeStats.total}</p>
                <p className="text-sm text-green-600">+5.2% from last month</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold">91.5%</p>
                <p className="text-sm text-red-600">-2.1% from last month</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Performance Score</p>
                <p className="text-2xl font-bold">87.3</p>
                <p className="text-sm text-green-600">+3.4% from last month</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retention Rate</p>
                <p className="text-2xl font-bold">94.2%</p>
                <p className="text-sm text-green-600">+1.8% from last month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="employees" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Goals Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hiring vs Departures</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hireTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hires" fill="#10b981" name="Hires" />
                <Bar dataKey="departures" fill="#ef4444" name="Departures" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Engineering</span>
                <span className="font-medium">92.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sales</span>
                <span className="font-medium">89.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Marketing</span>
                <span className="font-medium">87.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>HR</span>
                <span className="font-medium">85.4%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Safety Training</span>
                <span className="font-medium text-green-600">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Compliance Training</span>
                <span className="font-medium text-green-600">95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Technical Skills</span>
                <span className="font-medium text-yellow-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Leadership Development</span>
                <span className="font-medium text-red-600">62%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diversity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Gender Balance</span>
                <span className="font-medium">52% / 48%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Age Diversity</span>
                <span className="font-medium">Balanced</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Cultural Diversity</span>
                <span className="font-medium">High</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Leadership Diversity</span>
                <span className="font-medium">45%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRAnalytics;
