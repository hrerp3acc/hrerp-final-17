
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  Calendar, 
  BarChart3, 
  Target, 
  Award,
  DollarSign,
  FileText,
  Settings
} from 'lucide-react';

interface CrossModuleLinksProps {
  currentModule: string;
  relatedModules?: string[];
}

const CrossModuleLinks = ({ currentModule, relatedModules }: CrossModuleLinksProps) => {
  const navigate = useNavigate();

  const moduleMap = {
    employees: {
      icon: Users,
      label: 'Employees',
      links: [
        { path: '/time/attendance', label: 'View Attendance', icon: Clock },
        { path: '/performance', label: 'Performance Reviews', icon: Target },
        { path: '/payroll', label: 'Payroll Records', icon: DollarSign },
        { path: '/leave/calendar', label: 'Leave Calendar', icon: Calendar }
      ]
    },
    time: {
      icon: Clock,
      label: 'Time Management',
      links: [
        { path: '/employees', label: 'Employee Directory', icon: Users },
        { path: '/payroll', label: 'Payroll Processing', icon: DollarSign },
        { path: '/reports', label: 'Time Reports', icon: BarChart3 },
        { path: '/leave/my-leaves', label: 'Leave Management', icon: Calendar }
      ]
    },
    leave: {
      icon: Calendar,
      label: 'Leave Management',
      links: [
        { path: '/time/attendance', label: 'Attendance Records', icon: Clock },
        { path: '/employees', label: 'Employee Directory', icon: Users },
        { path: '/reports', label: 'Leave Reports', icon: BarChart3 },
        { path: '/payroll', label: 'Payroll Impact', icon: DollarSign }
      ]
    },
    performance: {
      icon: Target,
      label: 'Performance',
      links: [
        { path: '/employees', label: 'Employee Profiles', icon: Users },
        { path: '/learning', label: 'Training Programs', icon: Award },
        { path: '/reports', label: 'Performance Reports', icon: BarChart3 },
        { path: '/recruitment', label: 'Recruitment Needs', icon: Users }
      ]
    },
    payroll: {
      icon: DollarSign,
      label: 'Payroll',
      links: [
        { path: '/employees', label: 'Employee Data', icon: Users },
        { path: '/time/timesheets', label: 'Timesheets', icon: FileText },
        { path: '/time/attendance', label: 'Attendance Records', icon: Clock },
        { path: '/reports', label: 'Payroll Reports', icon: BarChart3 }
      ]
    },
    reports: {
      icon: BarChart3,
      label: 'Reports',
      links: [
        { path: '/employees', label: 'Employee Data', icon: Users },
        { path: '/time/tracking', label: 'Time Data', icon: Clock },
        { path: '/leave/calendar', label: 'Leave Data', icon: Calendar },
        { path: '/performance', label: 'Performance Data', icon: Target }
      ]
    },
    admin: {
      icon: Settings,
      label: 'Administration',
      links: [
        { path: '/employees', label: 'Manage Employees', icon: Users },
        { path: '/reports', label: 'System Reports', icon: BarChart3 },
        { path: '/compliance', label: 'Compliance', icon: Award },
        { path: '/analytics/workforce', label: 'Analytics', icon: BarChart3 }
      ]
    }
  };

  const currentModuleInfo = moduleMap[currentModule as keyof typeof moduleMap];
  
  if (!currentModuleInfo) return null;

  const linksToShow = relatedModules 
    ? currentModuleInfo.links.filter(link => 
        relatedModules.some(module => link.path.includes(module))
      )
    : currentModuleInfo.links.slice(0, 4);

  if (linksToShow.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <currentModuleInfo.icon className="w-5 h-5" />
          <span>Related Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {linksToShow.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto p-3"
              onClick={() => navigate(link.path)}
            >
              <link.icon className="w-4 h-4 mr-2" />
              <span className="text-sm">{link.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CrossModuleLinks;
