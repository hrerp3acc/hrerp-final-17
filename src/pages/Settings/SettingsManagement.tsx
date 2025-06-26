
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';
import { 
  User, Bell, Palette, Globe, Shield, 
  Monitor, Moon, Sun, Save, RefreshCw 
} from 'lucide-react';

const SettingsManagement = () => {
  const { settings, loading, updateSettings } = useSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async (updates: any) => {
    setSaving(true);
    try {
      await updateSettings(updates);
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and system configuration</p>
        </div>
        <Badge variant="outline">
          <RefreshCw className="w-4 h-4 mr-1" />
          Auto-save enabled
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Enter your phone number" />
              </div>
              
              <Button onClick={() => handleSaveSettings({})} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={settings?.notification_preferences?.email}
                  onCheckedChange={(checked) => 
                    handleSaveSettings({
                      notification_preferences: {
                        ...settings?.notification_preferences,
                        email: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                </div>
                <Switch 
                  checked={settings?.notification_preferences?.push}
                  onCheckedChange={(checked) => 
                    handleSaveSettings({
                      notification_preferences: {
                        ...settings?.notification_preferences,
                        push: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Leave Request Updates</Label>
                  <p className="text-sm text-gray-500">Get notified about leave request changes</p>
                </div>
                <Switch 
                  checked={settings?.notification_preferences?.leave_requests}
                  onCheckedChange={(checked) => 
                    handleSaveSettings({
                      notification_preferences: {
                        ...settings?.notification_preferences,
                        leave_requests: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Performance Review Alerts</Label>
                  <p className="text-sm text-gray-500">Notifications about performance evaluations</p>
                </div>
                <Switch 
                  checked={settings?.notification_preferences?.performance_reviews}
                  onCheckedChange={(checked) => 
                    handleSaveSettings({
                      notification_preferences: {
                        ...settings?.notification_preferences,
                        performance_reviews: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payroll Updates</Label>
                  <p className="text-sm text-gray-500">Get notified about payroll processing</p>
                </div>
                <Switch 
                  checked={settings?.notification_preferences?.payroll_updates}
                  onCheckedChange={(checked) => 
                    handleSaveSettings({
                      notification_preferences: {
                        ...settings?.notification_preferences,
                        payroll_updates: checked
                      }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={settings?.theme === 'light' ? 'default' : 'outline'}
                    className="flex items-center space-x-2 p-4"
                    onClick={() => handleSaveSettings({ theme: 'light' })}
                  >
                    <Sun className="w-4 h-4" />
                    <span>Light</span>
                  </Button>
                  <Button
                    variant={settings?.theme === 'dark' ? 'default' : 'outline'}
                    className="flex items-center space-x-2 p-4"
                    onClick={() => handleSaveSettings({ theme: 'dark' })}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Dark</span>
                  </Button>
                  <Button
                    variant={settings?.theme === 'system' ? 'default' : 'outline'}
                    className="flex items-center space-x-2 p-4"
                    onClick={() => handleSaveSettings({ theme: 'system' })}
                  >
                    <Monitor className="w-4 h-4" />
                    <span>System</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Preferences</CardTitle>
              <CardDescription>Set your language and timezone preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={settings?.language} 
                  onValueChange={(value) => handleSaveSettings({ language: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={settings?.timezone} 
                  onValueChange={(value) => handleSaveSettings({ timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="flex space-x-2">
                  <Input type="password" placeholder="••••••••" disabled />
                  <Button variant="outline">Change Password</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Active Sessions</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">Chrome on Windows • Active now</p>
                    </div>
                    <Badge variant="secondary">Current</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
