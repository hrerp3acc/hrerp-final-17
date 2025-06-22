
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  Calendar, 
  FileText, 
  UserPlus, 
  CheckSquare,
  BarChart3,
  Settings
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add Employee',
      description: 'Create new employee profile',
      icon: UserPlus,
      onClick: () => navigate('/employees/add'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Time Tracking',
      description: 'Start or stop time tracking',
      icon: Clock,
      onClick: () => navigate('/time/tracking'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Apply for Leave',
      description: 'Submit leave application',
      icon: Calendar,
      onClick: () => navigate('/leave/apply'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Check Attendance',
      description: 'Mark your attendance',
      icon: CheckSquare,
      onClick: () => navigate('/time/attendance'),
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'View Employees',
      description: 'Browse employee directory',
      icon: Users,
      onClick: () => navigate('/employees'),
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Reports',
      description: 'Generate reports',
      icon: BarChart3,
      onClick: () => navigate('/reports'),
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Timesheets',
      description: 'Manage timesheets',
      icon: FileText,
      onClick: () => navigate('/time/timesheets'),
      color: 'bg-teal-500 hover:bg-teal-600'
    },
    {
      title: 'Admin Panel',
      description: 'System administration',
      icon: Settings,
      onClick: () => navigate('/admin'),
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex flex-col items-center justify-center space-y-2 text-white border-0 ${action.color}`}
              onClick={action.onClick}
            >
              <action.icon className="w-6 h-6" />
              <div className="text-center">
                <div className="text-xs font-medium">{action.title}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
