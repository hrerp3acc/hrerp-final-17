
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Wifi, WifiOff, Plus, Settings, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type AttendanceDevice = Tables<'attendance_devices'>;

const AttendanceDeviceManager = () => {
  const [devices, setDevices] = useState<AttendanceDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const { toast } = useToast();

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance devices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const toggleDeviceStatus = async (deviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('attendance_devices')
        .update({ is_active: !currentStatus })
        .eq('id', deviceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Device ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      
      fetchDevices();
    } catch (error) {
      console.error('Error updating device status:', error);
      toast({
        title: "Error",
        description: "Failed to update device status",
        variant: "destructive"
      });
    }
  };

  const deleteDevice = async (deviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;

    try {
      const { error } = await supabase
        .from('attendance_devices')
        .delete()
        .eq('id', deviceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Device deleted successfully",
      });
      
      fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
      toast({
        title: "Error",
        description: "Failed to delete device",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading devices...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Attendance Devices</h3>
        <Dialog open={showAddDevice} onOpenChange={setShowAddDevice}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Attendance Device</DialogTitle>
            </DialogHeader>
            <AddDeviceForm 
              onClose={() => setShowAddDevice(false)}
              onSuccess={() => {
                fetchDevices();
                setShowAddDevice(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No devices configured yet</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          devices.map((device) => (
            <Card key={device.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{device.device_name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {device.is_active ? (
                      <Wifi className="w-4 h-4 text-green-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-gray-400" />
                    )}
                    <Badge variant={device.is_active ? "default" : "secondary"}>
                      {device.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Type: {device.device_type}</p>
                  <p className="text-sm text-gray-600">Location: {device.location}</p>
                  {device.ip_address && (
                    <p className="text-sm text-gray-600">IP: {String(device.ip_address)}</p>
                  )}
                  {device.last_sync && (
                    <p className="text-sm text-gray-600">
                      Last Sync: {new Date(device.last_sync).toLocaleString()}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={device.is_active || false}
                      onCheckedChange={() => toggleDeviceStatus(device.id, device.is_active || false)}
                    />
                    <Label className="text-sm">Active</Label>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteDevice(device.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

interface AddDeviceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddDeviceForm = ({ onClose, onSuccess }: AddDeviceFormProps) => {
  const [formData, setFormData] = useState({
    device_name: '',
    device_type: 'biometric',
    location: '',
    ip_address: ''
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('attendance_devices')
        .insert([{
          device_name: formData.device_name,
          device_type: formData.device_type,
          location: formData.location,
          ip_address: formData.ip_address || null,
          is_active: true
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Device added successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error adding device:', error);
      toast({
        title: "Error",
        description: "Failed to add device",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="device_name">Device Name</Label>
        <Input
          id="device_name"
          value={formData.device_name}
          onChange={(e) => setFormData(prev => ({ ...prev, device_name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="device_type">Device Type</Label>
        <Select value={formData.device_type} onValueChange={(value) => setFormData(prev => ({ ...prev, device_type: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="biometric">Biometric</SelectItem>
            <SelectItem value="card">Card Reader</SelectItem>
            <SelectItem value="mobile">Mobile App</SelectItem>
            <SelectItem value="web">Web Portal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="ip_address">IP Address (Optional)</Label>
        <Input
          id="ip_address"
          value={formData.ip_address}
          onChange={(e) => setFormData(prev => ({ ...prev, ip_address: e.target.value }))}
          placeholder="192.168.1.100"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Adding...' : 'Add Device'}
        </Button>
      </div>
    </form>
  );
};

export default AttendanceDeviceManager;
