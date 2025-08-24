
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const { toast } = useToast();

  // Fetch real attendance data from Supabase
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('attendance_records')
          .select(`
            *,
            employees (
              first_name,
              last_name,
              departments (
                name
              )
            )
          `)
          .gte('date', dateRange.start)
          .lte('date', dateRange.end)
          .order('date', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data: records, error } = await query;

        if (error) throw error;

        // Transform data to match component interface
        const transformedData: AttendanceRecord[] = (records || []).map(record => ({
          id: record.id,
          employee: `${record.employees?.first_name || 'Unknown'} ${record.employees?.last_name || ''}`.trim(),
          department: record.employees?.departments?.name || 'Unknown',
          checkIn: record.check_in_time ? new Date(`1970-01-01T${record.check_in_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
          checkOut: record.check_out_time ? new Date(`1970-01-01T${record.check_out_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
          totalHours: record.total_hours?.toString() || '0',
          status: record.status || 'present',
          overtime: record.total_hours && record.total_hours > 8 ? (record.total_hours - 8).toFixed(1) : '0'
        }));

        // Apply filters
        let filteredData = transformedData;
        
        if (selectedDepartment !== 'all') {
          filteredData = filteredData.filter(record => 
            record.department.toLowerCase().includes(selectedDepartment.toLowerCase())
          );
        }
        
        if (selectedStatus !== 'all') {
          filteredData = filteredData.filter(record => record.status === selectedStatus);
        }

        setData(filteredData);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch attendance records",
          variant: "destructive"
        });
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [dateRange, selectedDepartment, selectedStatus, limit, toast]);

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
