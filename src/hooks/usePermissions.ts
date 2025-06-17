
import { useAuth } from '@/contexts/AuthContext';

type Permission = 
  | 'view_analytics'
  | 'manage_employees'
  | 'edit_employees'
  | 'delete_employees'
  | 'manage_departments'
  | 'view_reports'
  | 'view_payroll'
  | 'manage_system'
  | 'system_admin';

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
      case 'edit_employees':
      case 'delete_employees':
        return ['admin', 'manager'].includes(role);
      case 'manage_departments':
        return role === 'admin';
      case 'view_reports':
        return ['admin', 'manager'].includes(role);
      case 'view_payroll':
        return ['admin', 'manager'].includes(role);
      case 'manage_system':
      case 'system_admin':
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
