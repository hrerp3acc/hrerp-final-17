
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Settings, BarChart3 } from 'lucide-react';
import AttendanceTable from '@/components/Attendance/AttendanceTable';
import AttendanceStats from '@/components/Attendance/AttendanceStats';
import AttendanceFilters from '@/components/Attendance/AttendanceFilters';
import AttendanceDeviceManager from '@/components/Time/AttendanceDeviceManager';

const Attendance = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock stats data
  const mockStats = {
    present: 45,
    absent: 5,
    late: 8,
    total: 58
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Track and manage employee attendance records</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Records</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Devices</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AttendanceStats stats={mockStats} />
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceFilters
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
              />
              <div className="mt-4">
                <AttendanceTable
                  dateRange={dateRange}
                  selectedDepartment={selectedDepartment}
                  selectedStatus={selectedStatus}
                  limit={10}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceFilters
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
              />
              <div className="mt-6">
                <AttendanceTable
                  dateRange={dateRange}
                  selectedDepartment={selectedDepartment}
                  selectedStatus={selectedStatus}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceDeviceManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceStats stats={mockStats} showDetailed />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Department-wise attendance analytics will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
