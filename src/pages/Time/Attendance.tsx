
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Users, Clock, CheckCircle } from 'lucide-react';
import AttendanceStats from '@/components/Attendance/AttendanceStats';
import AttendanceFilters from '@/components/Attendance/AttendanceFilters';
import DetailsPanel from '@/components/Common/DetailsPanel';
import { useAttendance } from '@/hooks/useAttendance';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  
  const { 
    attendanceRecords, 
    loading, 
    checkIn, 
    checkOut, 
    getTodaysAttendance,
    getAttendanceStats,
    refetchAttendance 
  } = useAttendance();
  
  const { employees } = useSupabaseEmployees();
  const [todaysRecord, setTodaysRecord] = useState<any>(null);

  useEffect(() => {
    const fetchTodaysRecord = async () => {
      const record = getTodaysAttendance();
      setTodaysRecord(record);
    };
    fetchTodaysRecord();
  }, []);

  useEffect(() => {
    refetchAttendance();
  }, [selectedDate]);

  // Transform attendance records to include employee info
  const transformedRecords = attendanceRecords.map(record => {
    const employee = employees.find(emp => emp.id === record.employee_id);
    return {
      ...record,
      employee: employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown',
      employeeId: employee?.employee_id || '',
      department: employee ? 
        (employees.find(e => e.department_id === employee.department_id) ? 'Department' : 'No Department') : 
        'No Department'
    };
  });

  const filteredData = transformedRecords.filter(record => {
    const matchesSearch = record.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const attendanceStats = getAttendanceStats();

  const handleAttendanceSelect = (record: any) => {
    setSelectedAttendance(record);
  };

  const handleCheckIn = async () => {
    await checkIn();
    const record = getTodaysAttendance();
    setTodaysRecord(record);
  };

  const handleCheckOut = async () => {
    await checkOut();
    const record = getTodaysAttendance();
    setTodaysRecord(record);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            {!todaysRecord ? (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCheckIn}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Check In
              </Button>
            ) : !todaysRecord.check_out_time ? (
              <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleCheckOut}>
                <Clock className="w-4 h-4 mr-2" />
                Check Out
              </Button>
            ) : (
              <Button disabled className="bg-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Button>
            )}
          </div>
        </div>

        {/* Today's Status */}
        {todaysRecord && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Today's Attendance</h3>
                <p className="text-blue-700">
                  Check-in: {todaysRecord.check_in_time} 
                  {todaysRecord.check_out_time && ` • Check-out: ${todaysRecord.check_out_time}`}
                  {todaysRecord.total_hours && ` • Total: ${todaysRecord.total_hours}h`}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                todaysRecord.status === 'present' ? 'bg-green-100 text-green-800' :
                todaysRecord.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {todaysRecord.status}
              </span>
            </div>
          </div>
        )}

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
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
            <p className="text-gray-600 mb-6">
              Attendance records will appear here once employees start checking in.
            </p>
            {!todaysRecord && (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCheckIn}>
                <Calendar className="w-4 h-4 mr-2" />
                Check In Now
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Employee</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Check In</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Check Out</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Total Hours</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record) => (
                    <tr 
                      key={record.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleAttendanceSelect(record)}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{record.employee}</p>
                          <p className="text-sm text-gray-600">{record.employeeId}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {record.check_in_time || '-'}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {record.check_out_time || '-'}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {record.total_hours ? `${record.total_hours}h` : '-'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          record.status === 'present' ? 'bg-green-100 text-green-800' :
                          record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
                    <p className="font-medium">{selectedAttendance.check_in_time || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check Out</p>
                    <p className="font-medium">{selectedAttendance.check_out_time || '-'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Hours</p>
                    <p className="font-medium">{selectedAttendance.total_hours ? `${selectedAttendance.total_hours}h` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Break Duration</p>
                    <p className="font-medium">{selectedAttendance.break_duration || '0h'}</p>
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
                  <p className="font-medium">{new Date(selectedAttendance.date).toLocaleDateString()}</p>
                </div>

                {selectedAttendance.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium">{selectedAttendance.notes}</p>
                  </div>
                )}
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
