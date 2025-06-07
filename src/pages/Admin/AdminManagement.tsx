
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissions } from '@/hooks/usePermissions';
import AdminHeader from '@/components/Admin/AdminHeader';
import UserManagementTab from '@/components/Admin/UserManagementTab';
import SystemSettingsTab from '@/components/Admin/SystemSettingsTab';
import NotificationSettingsTab from '@/components/Admin/NotificationSettingsTab';
import SecuritySettings from '@/components/Admin/SecuritySettings';
import { SecurityPolicy } from '@/utils/adminUtils';
import { Users, Settings, Shield, Bell, UserX } from 'lucide-react';

const AdminManagement = () => {
  const { hasPermission } = usePermissions();

  const [securityPolicy, setSecurityPolicy] = useState<SecurityPolicy>({
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: false,
    passwordExpiry: false,
    expiryDays: 90,
    twoFactorAuth: false,
    singleSignOn: false,
    sessionTimeout: true,
    timeoutHours: 4,
    maxLoginAttempts: 5,
    lockoutDuration: 15
  });

  // Check permissions
  if (!hasPermission('system_admin')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the administration panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader />

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>User Management</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>System Settings</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UserManagementTab />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SystemSettingsTab />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings 
            policy={securityPolicy}
            onUpdatePolicy={setSecurityPolicy}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminManagement;
