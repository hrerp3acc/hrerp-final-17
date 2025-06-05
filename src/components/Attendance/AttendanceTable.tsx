
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
  data: AttendanceRecord[];
  selectedDate: string;
}

const AttendanceTable = ({ data, selectedDate }: AttendanceTableProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records - {new Date(selectedDate).toLocaleDateString()}</CardTitle>
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
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
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
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
