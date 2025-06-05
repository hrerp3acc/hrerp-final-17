
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';
import AttendanceStats from '@/components/Attendance/AttendanceStats';
import AttendanceFilters from '@/components/Attendance/AttendanceFilters';
import AttendanceTable from '@/components/Attendance/AttendanceTable';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const attendanceData = [
    {
      id: '1',
      employee: 'Sarah Johnson',
      department: 'Marketing',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      totalHours: '9:00',
      status: 'present',
      overtime: '1:00'
    },
    {
      id: '2',
      employee: 'Michael Chen',
      department: 'Engineering',
      checkIn: '08:30 AM',
      checkOut: '05:30 PM',
      totalHours: '9:00',
      status: 'present',
      overtime: '1:00'
    },
    {
      id: '3',
      employee: 'Emily Rodriguez',
      department: 'HR',
      checkIn: '09:15 AM',
      checkOut: '06:15 PM',
      totalHours: '9:00',
      status: 'late',
      overtime: '1:00'
    },
    {
      id: '4',
      employee: 'David Kim',
      department: 'Finance',
      checkIn: '-',
      checkOut: '-',
      totalHours: '0:00',
      status: 'absent',
      overtime: '0:00'
    }
  ];

  const filteredData = attendanceData.filter(record => {
    const matchesSearch = record.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const attendanceStats = {
    present: attendanceData.filter(r => r.status === 'present').length,
    absent: attendanceData.filter(r => r.status === 'absent').length,
    late: attendanceData.filter(r => r.status === 'late').length,
    total: attendanceData.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">Track and manage employee attendance</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <AttendanceStats stats={attendanceStats} />

      {/* Filters */}
      <AttendanceFilters
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Attendance Table */}
      <AttendanceTable data={filteredData} selectedDate={selectedDate} />
    </div>
  );
};

export default Attendance;
