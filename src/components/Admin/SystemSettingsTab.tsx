
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { SystemSettings } from '@/utils/adminUtils';
import { Settings } from 'lucide-react';

const SystemSettingsTab = () => {
  const { toast } = useToast();

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

  const handleSettingsUpdate = () => {
    console.log('Updating system settings:', systemSettings);
    toast({
      title: "Settings Updated",
      description: "System settings have been saved successfully.",
    });
  };

  return (
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
  );
};

export default SystemSettingsTab;
