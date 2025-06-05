
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';

interface LeaveEvent {
  id: string;
  employee: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface UpcomingLeavesProps {
  leaveEvents: LeaveEvent[];
}

const UpcomingLeaves = ({ leaveEvents }: UpcomingLeavesProps) => {
  const upcomingLeaves = leaveEvents
    .filter(event => new Date(event.startDate) >= new Date() && event.status === 'approved')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Upcoming Leaves</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingLeaves.map(leave => (
            <div key={leave.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-sm">{leave.employee}</span>
              </div>
              <p className="text-xs text-gray-600 mb-1">{leave.department}</p>
              <p className="text-xs font-medium text-gray-900">{leave.leaveType}</p>
              <p className="text-xs text-gray-600">
                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
          {upcomingLeaves.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No upcoming approved leaves
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingLeaves;
