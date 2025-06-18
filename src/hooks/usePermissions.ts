
import { useUser } from '@/contexts/UserContext';

export type Permission = 
  | 'view_employees'
  | 'add_employees'
  | 'edit_employees'
  | 'delete_employees'
  | 'view_payroll'
  | 'manage_payroll'
  | 'approve_leaves'
  | 'view_analytics'
  | 'system_admin'
  | 'manage_recruitment'
  | 'manage_performance'
  | 'manage_learning';

const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'view_employees',
    'add_employees', 
    'edit_employees',
    'delete_employees',
    'view_payroll',
    'manage_payroll',
    'approve_leaves',
    'view_analytics',
    'system_admin',
    'manage_recruitment',
    'manage_performance',
    'manage_learning'
  ],
  manager: [
    'view_employees',
    'add_employees',
    'edit_employees',
    'approve_leaves',
    'view_analytics',
    'manage_recruitment',
    'manage_performance',
    'manage_learning'
  ],
  employee: [
    'view_employees'
  ]
};

export const usePermissions = () => {
  const { user } = useUser();
  
  const hasPermission = (permission: Permission): boolean => {
    if (!user?.role) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const getUserPermissions = (): Permission[] => {
    if (!user?.role) return [];
    return rolePermissions[user.role] || [];
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions,
    userRole: user?.role
  };
};
