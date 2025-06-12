
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Users } from 'lucide-react';
import AttendanceStats from '@/components/Attendance/AttendanceStats';
import AttendanceFilters from '@/components/Attendance/AttendanceFilters';
import DetailsPanel from '@/components/Common/DetailsPanel';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  const filteredData = attendanceData.filter(record => {
    const matchesSearch = record.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const attendanceStats = {
    present: attendanceData.filter(record => record.status === 'present').length,
    absent: attendanceData.filter(record => record.status === 'absent').length,
    late: attendanceData.filter(record => record.status === 'late').length,
    total: attendanceData.length
  };

  const handleAttendanceSelect = (record: any) => {
    setSelectedAttendance(record);
  };

  const handleMarkAttendance = () => {
    // This would typically open a modal to mark attendance
    console.log('Mark attendance clicked');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
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
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleMarkAttendance}>
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

        {/* Attendance Table or Empty State */}
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
          <p className="text-gray-600 mb-6">
            Attendance records will appear here once employees start checking in.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleMarkAttendance}>
            <Calendar className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      <div>
        <DetailsPanel
          title="Attendance Details"
          isEmpty={!selectedAttendance}
          emptyMessage="Select an attendance record to view detailed information"
        >
          {selectedAttendance && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedAttendance.employee}</h3>
              <p className="text-gray-600">{selectedAttendance.department} Department</p>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Check In</p>
                    <p className="font-medium">{selectedAttendance.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check Out</p>
                    <p className="font-medium">{selectedAttendance.checkOut}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Hours</p>
                    <p className="font-medium">{selectedAttendance.totalHours}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Overtime</p>
                    <p className="font-medium">{selectedAttendance.overtime}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    selectedAttendance.status === 'present' ? 'bg-green-100 text-green-800' :
                    selectedAttendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedAttendance.status}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedDate}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full">Edit Record</Button>
                <Button className="w-full" variant="outline">View History</Button>
                <Button className="w-full" variant="outline">Generate Report</Button>
              </div>
            </div>
          )}
        </DetailsPanel>
      </div>
    </div>
  );
};

export default Attendance;
