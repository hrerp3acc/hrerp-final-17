
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import UserManagementDialog from '@/components/Admin/UserManagementDialog';
import SecuritySettings from '@/components/Admin/SecuritySettings';
import { 
  SystemUser, 
  SystemSettings, 
  SecurityPolicy, 
  NotificationSettings,
  fetchSystemUsers,
  formatLastLogin
} from '@/utils/adminUtils';
import { 
  Settings, Users, Shield, Database, Bell, Mail, Search, 
  Plus, Edit, Trash2, UserX, RefreshCw, Download, Upload
} from 'lucide-react';

const AdminManagement = () => {
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  
  // State management
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<SystemUser[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('all');
  const [userFilterStatus, setUserFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Dialog states
  const [userDialog, setUserDialog] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    user?: SystemUser;
  }>({ isOpen: false, mode: 'add' });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    companyName: 'Your Company',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    workWeekStart: 'monday',
    businessHours: {
      start: '09:00',
      end: '17:00'
    },
    emailDomain: 'company.com',
    defaultLeaveBalance: 20,
    probationPeriod: 90
  });

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

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    leaveRequestAlerts: true,
    attendanceAlerts: true,
    payrollReminders: true,
    systemMaintenance: true,
    securityAlerts: true
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

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users when search term or filters change
  useEffect(() => {
    let filtered = systemUsers;

    // Search filter
    if (userSearchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (user.department || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (user.position || '').toLowerCase().includes(userSearchTerm.toLowerCase())
      );
    }

    // Role filter
    if (userFilterRole !== 'all') {
      filtered = filtered.filter(user => user.role === userFilterRole);
    }

    // Status filter
    if (userFilterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === userFilterStatus);
    }

    setFilteredUsers(filtered);
  }, [systemUsers, userSearchTerm, userFilterRole, userFilterStatus]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const users = await fetchSystemUsers();
      setSystemUsers(users);
      console.log('Loaded users:', users);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSave = (userData: Partial<SystemUser>) => {
    if (userDialog.mode === 'add') {
      const newUser = userData as SystemUser;
      setSystemUsers(prev => [...prev, newUser]);
    } else {
      setSystemUsers(prev => 
        prev.map(user => 
          user.id === userData.id ? { ...user, ...userData } : user
        )
      );
    }
  };

  const handleUserDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    console.log('Deleting user:', userId);
    setSystemUsers(prev => prev.filter(user => user.id !== userId));
    
    toast({
      title: "User Deleted",
      description: "User has been successfully deleted.",
    });
  };

  const handleUserStatusToggle = async (userId: string) => {
    const user = systemUsers.find(u => u.id === userId);
    if (!user) return;

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    console.log(`Changing user ${userId} status to:`, newStatus);
    
    setSystemUsers(prev => 
      prev.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      )
    );

    toast({
      title: "Status Updated",
      description: `User has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
    });
  };

  const handleSettingsUpdate = () => {
    console.log('Updating system settings:', systemSettings);
    toast({
      title: "Settings Updated",
      description: "System settings have been saved successfully.",
    });
  };

  const handleNotificationUpdate = () => {
    console.log('Updating notification settings:', notifications);
    toast({
      title: "Notifications Updated",
      description: "Notification preferences have been saved successfully.",
    });
  };

  const exportUserData = () => {
    const csvContent = [
      'Name,Email,Role,Department,Position,Status,Last Login',
      ...filteredUsers.map(user => 
        `${user.name},${user.email},${user.role},${user.department || ''},${user.position || ''},${user.status},${formatLastLogin(user.lastLogin)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "User data has been downloaded as CSV.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600">Manage system settings and user access</p>
        </div>
      </div>

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

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">User Management</h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportUserData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={() => setUserDialog({ isOpen: true, mode: 'add' })}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* User Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="userSearch">Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="userSearch"
                      placeholder="Search by name, email, department..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="roleFilter">Filter by Role</Label>
                  <Select value={userFilterRole} onValueChange={setUserFilterRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="statusFilter">Filter by Status</Label>
                  <Select value={userFilterStatus} onValueChange={setUserFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={loadUsers} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                System Users ({filteredUsers.length} of {systemUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatLastLogin(user.lastLogin)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserDialog({ 
                              isOpen: true, 
                              mode: 'edit', 
                              user 
                            })}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserStatusToggle(user.id)}
                          >
                            {user.status === 'active' ? '⏸' : '▶'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserDelete(user.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {userSearchTerm || userFilterRole !== 'all' || userFilterStatus !== 'all' 
                    ? 'No users match the current filters.' 
                    : 'No users found.'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>System Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={systemSettings.companyName}
                      onChange={(e) => setSystemSettings({...systemSettings, companyName: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="workWeekStart">Work Week Starts</Label>
                    <Select value={systemSettings.workWeekStart} onValueChange={(value) => setSystemSettings({...systemSettings, workWeekStart: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="businessStart">Business Hours Start</Label>
                      <Input
                        id="businessStart"
                        type="time"
                        value={systemSettings.businessHours.start}
                        onChange={(e) => setSystemSettings({
                          ...systemSettings,
                          businessHours: {...systemSettings.businessHours, start: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessEnd">Business Hours End</Label>
                      <Input
                        id="businessEnd"
                        type="time"
                        value={systemSettings.businessHours.end}
                        onChange={(e) => setSystemSettings({
                          ...systemSettings,
                          businessHours: {...systemSettings.businessHours, end: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSettingsUpdate} className="bg-blue-600 hover:bg-blue-700">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <SecuritySettings 
            policy={securityPolicy}
            onUpdatePolicy={setSecurityPolicy}
          />
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">General Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <Switch 
                        id="emailNotifications" 
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <Switch 
                        id="smsNotifications" 
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <Switch 
                        id="pushNotifications" 
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">System Alerts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="leaveRequestAlerts">Leave Request Alerts</Label>
                      <Switch 
                        id="leaveRequestAlerts" 
                        checked={notifications.leaveRequestAlerts}
                        onCheckedChange={(checked) => setNotifications({...notifications, leaveRequestAlerts: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="attendanceAlerts">Attendance Alerts</Label>
                      <Switch 
                        id="attendanceAlerts" 
                        checked={notifications.attendanceAlerts}
                        onCheckedChange={(checked) => setNotifications({...notifications, attendanceAlerts: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="payrollReminders">Payroll Reminders</Label>
                      <Switch 
                        id="payrollReminders" 
                        checked={notifications.payrollReminders}
                        onCheckedChange={(checked) => setNotifications({...notifications, payrollReminders: checked})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleNotificationUpdate} className="bg-blue-600 hover:bg-blue-700">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Management Dialog */}
      <UserManagementDialog
        user={userDialog.user}
        isOpen={userDialog.isOpen}
        onClose={() => setUserDialog({ isOpen: false, mode: 'add' })}
        onSave={handleUserSave}
        mode={userDialog.mode}
      />
    </div>
  );
};

export default AdminManagement;
