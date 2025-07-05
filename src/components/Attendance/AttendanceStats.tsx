
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

interface AttendanceStatsProps {
  stats: {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
  showDetailed?: boolean;
}

const AttendanceStats = ({ stats, showDetailed = false }: AttendanceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          {showDetailed && (
            <p className="text-xs text-muted-foreground">All employees</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          {showDetailed && (
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}% attendance rate
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Late</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
          {showDetailed && (
            <p className="text-xs text-muted-foreground">Late arrivals</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Absent</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          {showDetailed && (
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0}% absence rate
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStats;
