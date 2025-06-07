
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { SecurityPolicy, AuditLog, fetchAuditLogs } from '@/utils/adminUtils';
import { Lock, Key, Shield, AlertTriangle, Download, Trash2 } from 'lucide-react';

interface SecuritySettingsProps {
  policy: SecurityPolicy;
  onUpdatePolicy: (policy: SecurityPolicy) => void;
}

const SecuritySettings = ({ policy, onUpdatePolicy }: SecuritySettingsProps) => {
  const { toast } = useToast();
  const [localPolicy, setLocalPolicy] = useState<SecurityPolicy>(policy);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [logsLoaded, setLogsLoaded] = useState(false);

  const handlePolicyUpdate = () => {
    console.log('Updating security policy:', localPolicy);
    onUpdatePolicy(localPolicy);
    toast({
      title: "Security Policy Updated",
      description: "Security settings have been saved successfully.",
    });
  };

  const loadAuditLogs = async () => {
    if (logsLoaded) return;
    
    setIsLoading(true);
    try {
      const logs = await fetchAuditLogs();
      setAuditLogs(logs);
      setLogsLoaded(true);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to load audit logs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportAuditLogs = () => {
    const csvContent = [
      'Timestamp,Action,User,Details,IP Address',
      ...auditLogs.map(log => 
        `${log.timestamp},${log.action},${log.userEmail},"${log.details}",${log.ipAddress || 'N/A'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Audit logs have been downloaded as CSV.",
    });
  };

  const clearOldLogs = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filteredLogs = auditLogs.filter(log => 
      new Date(log.timestamp) > thirtyDaysAgo
    );
    
    setAuditLogs(filteredLogs);
    toast({
      title: "Logs Cleared",
      description: `Removed ${auditLogs.length - filteredLogs.length} old log entries.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Password Policy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="minLength">Minimum Length</Label>
              <Input
                id="minLength"
                type="number"
                min="6"
                max="20"
                value={localPolicy.passwordMinLength}
                onChange={(e) => setLocalPolicy({
                  ...localPolicy,
                  passwordMinLength: parseInt(e.target.value) || 8
                })}
                className="mt-1"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase">Require Uppercase Letters</Label>
                <Switch
                  id="uppercase"
                  checked={localPolicy.requireUppercase}
                  onCheckedChange={(checked) => setLocalPolicy({
                    ...localPolicy,
                    requireUppercase: checked
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="numbers">Require Numbers</Label>
                <Switch
                  id="numbers"
                  checked={localPolicy.requireNumbers}
                  onCheckedChange={(checked) => setLocalPolicy({
                    ...localPolicy,
                    requireNumbers: checked
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="symbols">Require Special Characters</Label>
                <Switch
                  id="symbols"
                  checked={localPolicy.requireSymbols}
                  onCheckedChange={(checked) => setLocalPolicy({
                    ...localPolicy,
                    requireSymbols: checked
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="expiry">Password Expiry</Label>
                <Switch
                  id="expiry"
                  checked={localPolicy.passwordExpiry}
                  onCheckedChange={(checked) => setLocalPolicy({
                    ...localPolicy,
                    passwordExpiry: checked
                  })}
                />
              </div>
              {localPolicy.passwordExpiry && (
                <div>
                  <Label htmlFor="expiryDays">Expiry Days</Label>
                  <Input
                    id="expiryDays"
                    type="number"
                    min="30"
                    max="365"
                    value={localPolicy.expiryDays}
                    onChange={(e) => setLocalPolicy({
                      ...localPolicy,
                      expiryDays: parseInt(e.target.value) || 90
                    })}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Authentication Settings */}
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
              <Switch
                id="twoFactor"
                checked={localPolicy.twoFactorAuth}
                onCheckedChange={(checked) => setLocalPolicy({
                  ...localPolicy,
                  twoFactorAuth: checked
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="singleSignOn">Single Sign-On (SSO)</Label>
              <Switch
                id="singleSignOn"
                checked={localPolicy.singleSignOn}
                onCheckedChange={(checked) => setLocalPolicy({
                  ...localPolicy,
                  singleSignOn: checked
                })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sessionTimeout">Session Timeout</Label>
                <Switch
                  id="sessionTimeout"
                  checked={localPolicy.sessionTimeout}
                  onCheckedChange={(checked) => setLocalPolicy({
                    ...localPolicy,
                    sessionTimeout: checked
                  })}
                />
              </div>
              {localPolicy.sessionTimeout && (
                <div>
                  <Label htmlFor="timeoutHours">Timeout Hours</Label>
                  <Input
                    id="timeoutHours"
                    type="number"
                    min="1"
                    max="24"
                    value={localPolicy.timeoutHours}
                    onChange={(e) => setLocalPolicy({
                      ...localPolicy,
                      timeoutHours: parseInt(e.target.value) || 4
                    })}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="maxAttempts">Max Login Attempts</Label>
              <Input
                id="maxAttempts"
                type="number"
                min="3"
                max="10"
                value={localPolicy.maxLoginAttempts}
                onChange={(e) => setLocalPolicy({
                  ...localPolicy,
                  maxLoginAttempts: parseInt(e.target.value) || 5
                })}
              />
            </div>

            <div>
              <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                min="5"
                max="60"
                value={localPolicy.lockoutDuration}
                onChange={(e) => setLocalPolicy({
                  ...localPolicy,
                  lockoutDuration: parseInt(e.target.value) || 15
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handlePolicyUpdate} className="bg-blue-600 hover:bg-blue-700">
          <Shield className="w-4 h-4 mr-2" />
          Update Security Policy
        </Button>
      </div>

      {/* Security Audit Log */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Security Audit Log</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={loadAuditLogs} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Refresh Logs'}
              </Button>
              {auditLogs.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={exportAuditLogs}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearOldLogs}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Old
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {auditLogs.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{log.action}</p>
                    <p className="text-xs text-gray-600">
                      User: {log.userEmail} | {log.details}
                    </p>
                    {log.ipAddress && (
                      <p className="text-xs text-gray-500">IP: {log.ipAddress}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              {logsLoaded ? 'No audit logs found.' : 'Click "Refresh Logs" to load security audit logs.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
