
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, BookOpen, Target, Clock, UserPlus, Award } from 'lucide-react';

interface Activity {
  id: string;
  type: 'leave' | 'hire' | 'training' | 'performance' | 'time' | 'goal' | 'enrollment';
  description: string;
  timestamp: string;
  employee_name?: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'leave': return Calendar;
      case 'hire': return User;
      case 'training': return BookOpen;
      case 'performance': return Target;
      case 'time': return Clock;
      case 'goal': return Target;
      case 'enrollment': return Award;
      default: return User;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'leave': return 'bg-blue-100 text-blue-800';
      case 'hire': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      case 'performance': return 'bg-orange-100 text-orange-800';
      case 'time': return 'bg-indigo-100 text-indigo-800';
      case 'goal': return 'bg-yellow-100 text-yellow-800';
      case 'enrollment': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activities</p>
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-900 truncate">
                        {activity.description}
                      </p>
                      <Badge className={getActivityColor(activity.type)} variant="secondary">
                        {activity.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      {activity.employee_name && (
                        <p className="text-xs text-gray-500">{activity.employee_name}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
