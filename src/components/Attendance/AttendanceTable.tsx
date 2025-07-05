
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employee: string;
  department: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  status: string;
  overtime: string;
}

interface AttendanceTableProps {
  dateRange: {
    start: string;
    end: string;
  };
  selectedDepartment: string;
  selectedStatus: string;
  limit?: number;
}

const AttendanceTable = ({ dateRange, selectedDepartment, selectedStatus, limit }: AttendanceTableProps) => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: AttendanceRecord[] = [
      {
        id: '1',
        employee: 'John Doe',
        department: 'IT',
        checkIn: '09:00 AM',
        checkOut: '05:30 PM',
        totalHours: '8.5',
        status: 'present',
        overtime: '0.5'
      },
      {
        id: '2',
        employee: 'Jane Smith',
        department: 'HR',
        checkIn: '09:15 AM',
        checkOut: '05:00 PM',
        totalHours: '7.75',
        status: 'late',
        overtime: '0'
      },
      {
        id: '3',
        employee: 'Mike Johnson',
        department: 'Finance',
        checkIn: '-',
        checkOut: '-',
        totalHours: '0',
        status: 'absent',
        overtime: '0'
      }
    ];

    // Filter data based on props
    let filteredData = mockData;
    
    if (selectedDepartment !== 'all') {
      filteredData = filteredData.filter(record => 
        record.department.toLowerCase() === selectedDepartment.toLowerCase()
      );
    }
    
    if (selectedStatus !== 'all') {
      filteredData = filteredData.filter(record => record.status === selectedStatus);
    }
    
    if (limit) {
      filteredData = filteredData.slice(0, limit);
    }

    setData(filteredData);
    setLoading(false);
  }, [dateRange, selectedDepartment, selectedStatus, limit]);

  const getStatusBadge = (status: string) => {
    const styles = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      'half-day': 'bg-blue-100 text-blue-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleRecordSelect = (record: AttendanceRecord) => {
    console.log('Selected record:', record);
  };

  if (loading) {
    return <div>Loading attendance records...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Attendance Records - {dateRange.start} to {dateRange.end}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Check In</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Check Out</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Total Hours</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Overtime</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record) => (
                <tr 
                  key={record.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRecordSelect(record)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{record.employee}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{record.department}</td>
                  <td className="py-3 px-4 text-gray-900">{record.checkIn}</td>
                  <td className="py-3 px-4 text-gray-900">{record.checkOut}</td>
                  <td className="py-3 px-4 text-gray-900">{record.totalHours}</td>
                  <td className="py-3 px-4 text-gray-900">{record.overtime}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit record:', record.id);
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No attendance records found for the selected criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
