
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Database, Clock, Mail, Shield } from "lucide-react";

const SystemConfig = () => {
  const [configs, setConfigs] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('system_configs')
        .select('*');

      if (error) throw error;

      const configMap = data.reduce((acc, config) => {
        acc[config.config_key] = {
          value: config.config_value,
          description: config.description,
          category: config.category,
          is_public: config.is_public
        };
        return acc;
      }, {});

      setConfigs(configMap);
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch system configurations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('system_configs')
        .upsert({
          config_key: key,
          config_value: value,
          description: configs[key]?.description || '',
          category: configs[key]?.category || 'general'
        });

      if (error) throw error;

      setConfigs(prev => ({
        ...prev,
        [key]: { ...prev[key], value }
      }));

      toast({
        title: "Success",
        description: "Configuration updated successfully"
      });
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
        <p className="text-gray-600">Manage system-wide settings and preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={configs.company_name?.value?.replace(/"/g, '') || ''}
                onChange={(e) => updateConfig('company_name', `"${e.target.value}"`)}
                placeholder="Enter company name"
              />
              <p className="text-sm text-gray-500 mt-1">Display name for your organization</p>
            </div>
            
            <div>
              <Label htmlFor="work_week_hours">Work Week Hours</Label>
              <Input
                id="work_week_hours"
                type="number"
                value={configs.work_week_hours?.value || '40'}
                onChange={(e) => updateConfig('work_week_hours', e.target.value)}
                placeholder="40"
              />
              <p className="text-sm text-gray-500 mt-1">Standard work hours per week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time & Attendance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Time & Attendance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Automatic Clock Out</Label>
              <p className="text-sm text-gray-500">Automatically clock out employees after work hours</p>
            </div>
            <Switch 
              checked={false}
              onCheckedChange={(checked) => updateConfig('auto_clock_out', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>GPS Tracking</Label>
              <p className="text-sm text-gray-500">Enable location tracking for attendance</p>
            </div>
            <Switch 
              checked={false}
              onCheckedChange={(checked) => updateConfig('gps_tracking', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Leave Management Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Leave Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Approval Required</Label>
              <p className="text-sm text-gray-500">Require manager approval for leave requests</p>
            </div>
            <Switch 
              checked={configs.leave_approval_required?.value === 'true' || configs.leave_approval_required?.value === true}
              onCheckedChange={(checked) => updateConfig('leave_approval_required', checked)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="annual_leave_days">Annual Leave Days</Label>
              <Input
                id="annual_leave_days"
                type="number"
                defaultValue="25"
                placeholder="25"
              />
              <p className="text-sm text-gray-500 mt-1">Default annual leave allocation</p>
            </div>
            
            <div>
              <Label htmlFor="sick_leave_days">Sick Leave Days</Label>
              <Input
                id="sick_leave_days"
                type="number"
                defaultValue="10"
                placeholder="10"
              />
              <p className="text-sm text-gray-500 mt-1">Default sick leave allocation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
              <Input
                id="max_login_attempts"
                type="number"
                value={configs.max_login_attempts?.value || '5'}
                onChange={(e) => updateConfig('max_login_attempts', e.target.value)}
                placeholder="5"
              />
              <p className="text-sm text-gray-500 mt-1">Maximum failed login attempts before lockout</p>
            </div>
            
            <div>
              <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
              <Input
                id="session_timeout"
                type="number"
                defaultValue="60"
                placeholder="60"
              />
              <p className="text-sm text-gray-500 mt-1">Automatic session timeout period</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">Require 2FA for all users</p>
            </div>
            <Switch 
              checked={false}
              onCheckedChange={(checked) => updateConfig('require_2fa', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Email Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Leave Request Notifications</Label>
              <p className="text-sm text-gray-500">Send email notifications for leave requests</p>
            </div>
            <Switch 
              checked={true}
              onCheckedChange={(checked) => updateConfig('email_leave_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Payroll Notifications</Label>
              <p className="text-sm text-gray-500">Send email notifications for payroll updates</p>
            </div>
            <Switch 
              checked={false}
              onCheckedChange={(checked) => updateConfig('email_payroll_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={() => toast({ title: "Settings saved successfully" })}>
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default SystemConfig;
