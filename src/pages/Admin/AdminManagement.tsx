
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Settings, Users, Shield, Database, Bell, Mail, Lock, Key } from 'lucide-react';

const AdminManagement = () => {
  const { toast } = useToast();
  const [systemSettings, setSystemSettings] = useState({
    companyName: 'Your Company',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    workWeekStart: 'monday',
    businessHours: {
      start: '09:00',
      end: '17:00'
    }
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    leaveRequestAlerts: true,
    attendanceAlerts: true,
    payrollReminders: true
  });

  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-06-05'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2024-06-04'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'Employee',
      status: 'Active',
      lastLogin: '2024-06-03'
    }
  ];

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
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Reset Password</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Password Policy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="minLength">Minimum Length (8 chars)</Label>
                  <Switch id="minLength" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase">Require Uppercase</Label>
                  <Switch id="uppercase" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers">Require Numbers</Label>
                  <Switch id="numbers" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols">Require Symbols</Label>
                  <Switch id="symbols" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="expiry">Password Expiry (90 days)</Label>
                  <Switch id="expiry" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>Authentication</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                  <Switch id="twoFactor" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="singleSignOn">Single Sign-On (SSO)</Label>
                  <Switch id="singleSignOn" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sessionTimeout">Session Timeout (4 hours)</Label>
                  <Switch id="sessionTimeout" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="loginAttempts">Lock after 5 failed attempts</Label>
                  <Switch id="loginAttempts" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Failed login attempt</p>
                    <p className="text-sm text-gray-600">user: invalid@email.com</p>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Password changed</p>
                    <p className="text-sm text-gray-600">user: john.doe@company.com</p>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">User role updated</p>
                    <p className="text-sm text-gray-600">sarah.johnson promoted to Manager</p>
                  </div>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
};

export default AdminManagement;
