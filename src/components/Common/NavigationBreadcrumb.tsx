
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { useLocation, Link } from 'react-router-dom';
import { Home, Users, Clock, Calendar, BarChart, Settings, FileText, Award, DollarSign, Target } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ElementType;
}

const NavigationBreadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getRouteInfo = (segment: string, index: number): BreadcrumbItem => {
    const fullPath = '/' + pathSegments.slice(0, index + 1).join('/');
    
    const routeMap: Record<string, BreadcrumbItem> = {
      '': { label: 'Dashboard', href: '/', icon: Home },
      'employees': { label: 'Employees', href: '/employees', icon: Users },
      'add': { label: 'Add Employee', icon: Users },
      'org-chart': { label: 'Organization Chart', icon: Users },
      'time': { label: 'Time Management', icon: Clock },
      'tracking': { label: 'Time Tracking', icon: Clock },
      'attendance': { label: 'Attendance', icon: Clock },
      'timesheets': { label: 'Timesheets', icon: FileText },
      'leave': { label: 'Leave Management', icon: Calendar },
      'my-leaves': { label: 'My Leaves', icon: Calendar },
      'apply': { label: 'Apply for Leave', icon: Calendar },
      'calendar': { label: 'Leave Calendar', icon: Calendar },
      'analytics': { label: 'Analytics', icon: BarChart },
      'workforce': { label: 'Workforce Analytics', icon: BarChart },
      'planning': { label: 'Planning', icon: Target },
      'compliance': { label: 'Compliance', icon: Award },
      'performance': { label: 'Performance', icon: Target },
      'recruitment': { label: 'Recruitment', icon: Users },
      'learning': { label: 'Learning & Development', icon: Award },
      'payroll': { label: 'Payroll', icon: DollarSign },
      'reports': { label: 'Reports', icon: BarChart },
      'admin': { label: 'Administration', icon: Settings }
    };

    const info = routeMap[segment] || { label: segment.charAt(0).toUpperCase() + segment.slice(1) };
    
    // Don't provide href for the last segment (current page)
    if (index === pathSegments.length - 1) {
      return { ...info, href: undefined };
    }
    
    return { ...info, href: info.href || fullPath };
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/', icon: Home },
    ...pathSegments.map((segment, index) => getRouteInfo(segment, index))
  ];

  // Remove duplicate dashboard items
  const filteredItems = breadcrumbItems.filter((item, index) => 
    index === 0 || item.label !== 'Dashboard'
  );

  if (filteredItems.length <= 1) return null;

  return (
    <div className="mb-4">
      <Breadcrumb>
        <BreadcrumbList>
          {filteredItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href} className="flex items-center space-x-1">
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center space-x-1">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default NavigationBreadcrumb;
