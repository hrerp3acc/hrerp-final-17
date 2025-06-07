
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { NotificationSettings } from '@/utils/adminUtils';
import { Bell } from 'lucide-react';

const NotificationSettingsTab = () => {
  const { toast } = useToast();

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

  const handleNotificationUpdate = () => {
    console.log('Updating notification settings:', notifications);
    toast({
      title: "Notifications Updated",
      description: "Notification preferences have been saved successfully.",
    });
  };

  return (
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
  );
};

export default NotificationSettingsTab;
