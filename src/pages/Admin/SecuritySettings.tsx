
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Key, AlertTriangle, Eye, Download } from "lucide-react";

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [ipRestrictionEnabled, setIpRestrictionEnabled] = useState(false);
  const [auditLogEnabled, setAuditLogEnabled] = useState(true);

  const securityLogs = [
    {
      id: 1,
      action: "User Login",
      user: "john.doe@company.com",
      timestamp: "2024-01-15 10:30:00",
      ip: "192.168.1.100",
      status: "Success",
      details: "Successful login from web browser"
    },
    {
      id: 2,
      action: "Password Change",
      user: "jane.smith@company.com",
      timestamp: "2024-01-15 09:15:00",
      ip: "192.168.1.101",
      status: "Success",
      details: "Password updated successfully"
    },
    {
      id: 3,
      action: "Failed Login Attempt",
      user: "unknown@example.com",
      timestamp: "2024-01-15 08:45:00",
      ip: "203.0.113.5",
      status: "Failed",
      details: "Invalid credentials - 3rd attempt"
    },
    {
      id: 4,
      action: "Data Export",
      user: "admin@company.com",
      timestamp: "2024-01-14 16:20:00",
      ip: "192.168.1.50",
      status: "Success",
      details: "Employee data exported to CSV"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600">Configure security policies and monitor system access</p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Score</p>
                <p className="text-2xl font-bold text-green-600">85%</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Key className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Logins</p>
                <p className="text-2xl font-bold text-red-600">7</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">2FA Enabled</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Authentication Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">Require 2FA for all user accounts</p>
            </div>
            <Switch 
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="password_min_length">Minimum Password Length</Label>
              <Input
                id="password_min_length"
                type="number"
                defaultValue="8"
                placeholder="8"
              />
            </div>
            
            <div>
              <Label htmlFor="password_expiry">Password Expiry (days)</Label>
              <Input
                id="password_expiry"
                type="number"
                defaultValue="90"
                placeholder="90"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Password Complexity</Label>
              <p className="text-sm text-gray-500">Require uppercase, lowercase, numbers, and symbols</p>
            </div>
            <Switch 
              checked={true}
              onCheckedChange={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Access Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>IP Address Restrictions</Label>
              <p className="text-sm text-gray-500">Limit access to specific IP addresses</p>
            </div>
            <Switch 
              checked={ipRestrictionEnabled}
              onCheckedChange={setIpRestrictionEnabled}
            />
          </div>
          
          {ipRestrictionEnabled && (
            <div>
              <Label htmlFor="allowed_ips">Allowed IP Addresses</Label>
              <Input
                id="allowed_ips"
                placeholder="192.168.1.0/24, 10.0.0.0/8"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">Enter IP addresses or ranges separated by commas</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
              <Input
                id="session_timeout"
                type="number"
                defaultValue="30"
                placeholder="30"
              />
            </div>
            
            <div>
              <Label htmlFor="max_concurrent_sessions">Max Concurrent Sessions</Label>
              <Input
                id="max_concurrent_sessions"
                type="number"
                defaultValue="3"
                placeholder="3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit & Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Audit & Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Audit Logging</Label>
              <p className="text-sm text-gray-500">Log all user actions and system events</p>
            </div>
            <Switch 
              checked={auditLogEnabled}
              onCheckedChange={setAuditLogEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Real-time Alerts</Label>
              <p className="text-sm text-gray-500">Send alerts for suspicious activities</p>
            </div>
            <Switch 
              checked={true}
              onCheckedChange={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Security Events</span>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{log.action}</h4>
                      <p className="text-sm text-gray-600">{log.user}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(log.status)}>
                    {log.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Time: </span>
                    {log.timestamp}
                  </div>
                  <div>
                    <span className="font-medium">IP: </span>
                    {log.ip}
                  </div>
                  <div>
                    <span className="font-medium">Details: </span>
                    {log.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
