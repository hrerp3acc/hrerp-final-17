
import { useAuth } from '@/contexts/AuthContext';

type Permission = 
  | 'view_analytics'
  | 'manage_employees'
  | 'manage_departments'
  | 'view_reports'
  | 'manage_system';

export const usePermissions = () => {
  const { user } = useAuth();

  const getUserRole = (): 'admin' | 'manager' | 'employee' => {
    if (user?.user_metadata?.role) {
      return user.user_metadata.role;
    }
    return 'employee';
  };

  const hasPermission = (permission: Permission): boolean => {
    const role = getUserRole();
    
    switch (permission) {
      case 'view_analytics':
        return ['admin', 'manager'].includes(role);
      case 'manage_employees':
        return ['admin', 'manager'].includes(role);
      case 'manage_departments':
        return role === 'admin';
      case 'view_reports':
        return ['admin', 'manager'].includes(role);
      case 'manage_system':
        return role === 'admin';
      default:
        return false;
    }
  };

  return {
    hasPermission,
    userRole: getUserRole()
  };
};
