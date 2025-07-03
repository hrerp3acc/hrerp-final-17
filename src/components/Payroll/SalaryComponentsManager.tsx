
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type SalaryComponent = Tables<'salary_components'>;

interface SalaryComponentsManagerProps {
  employeeId: string;
}

const SalaryComponentsManager = ({ employeeId }: SalaryComponentsManagerProps) => {
  const [components, setComponents] = useState<SalaryComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [editingComponent, setEditingComponent] = useState<SalaryComponent | null>(null);
  const { toast } = useToast();

  const fetchComponents = async () => {
    try {
      const { data, error } = await supabase
        .from('salary_components')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComponents(data || []);
    } catch (error) {
      console.error('Error fetching salary components:', error);
      toast({
        title: "Error",
        description: "Failed to fetch salary components",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, [employeeId]);

  const deleteComponent = async (componentId: string) => {
    if (!window.confirm('Are you sure you want to delete this salary component?')) return;

    try {
      const { error } = await supabase
        .from('salary_components')
        .delete()
        .eq('id', componentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Salary component deleted successfully",
      });
      
      fetchComponents();
    } catch (error) {
      console.error('Error deleting salary component:', error);
      toast({
        title: "Error",
        description: "Failed to delete salary component",
        variant: "destructive"
      });
    }
  };

  const calculateTotalEarnings = () => {
    return components
      .filter(c => c.component_type === 'earning')
      .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  };

  const calculateTotalDeductions = () => {
    return components
      .filter(c => c.component_type === 'deduction')
      .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  };

  if (loading) {
    return <div>Loading salary components...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Salary Components</h3>
        <Dialog open={showAddComponent} onOpenChange={setShowAddComponent}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Salary Component</DialogTitle>
            </DialogHeader>
            <ComponentForm 
              employeeId={employeeId}
              onClose={() => setShowAddComponent(false)}
              onSuccess={() => {
                fetchComponents();
                setShowAddComponent(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-2xl font-bold">${calculateTotalEarnings().toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Total Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-red-600" />
              <span className="text-2xl font-bold">${calculateTotalDeductions().toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Net Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-2xl font-bold">
                ${(calculateTotalEarnings() - calculateTotalDeductions()).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Components List */}
      <div className="space-y-4">
        {components.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No salary components configured</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          components.map((component) => (
            <Card key={component.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <DollarSign className={`w-6 h-6 ${
                    component.component_type === 'earning' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div>
                    <h4 className="font-medium">{component.component_name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Badge variant={component.component_type === 'earning' ? 'default' : 'destructive'}>
                        {component.component_type}
                      </Badge>
                      {component.is_fixed ? (
                        <span>${Number(component.amount).toFixed(2)}</span>
                      ) : (
                        <span>{component.percentage}%</span>
                      )}
                      {component.is_taxable && <Badge variant="outline">Taxable</Badge>}
                    </div>
                    <p className="text-xs text-gray-500">
                      Effective: {new Date(component.effective_from).toLocaleDateString()}
                      {component.effective_to && ` - ${new Date(component.effective_to).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingComponent(component)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteComponent(component.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingComponent} onOpenChange={() => setEditingComponent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Salary Component</DialogTitle>
          </DialogHeader>
          {editingComponent && (
            <ComponentForm 
              employeeId={employeeId}
              component={editingComponent}
              onClose={() => setEditingComponent(null)}
              onSuccess={() => {
                fetchComponents();
                setEditingComponent(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ComponentFormProps {
  employeeId: string;
  component?: SalaryComponent;
  onClose: () => void;
  onSuccess: () => void;
}

const ComponentForm = ({ employeeId, component, onClose, onSuccess }: ComponentFormProps) => {
  const [formData, setFormData] = useState({
    component_name: component?.component_name || '',
    component_type: component?.component_type || 'earning',
    amount: component?.amount?.toString() || '0',
    percentage: component?.percentage?.toString() || '',
    is_fixed: component?.is_fixed ?? true,
    is_taxable: component?.is_taxable ?? true,
    effective_from: component?.effective_from || new Date().toISOString().split('T')[0],
    effective_to: component?.effective_to || ''
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const componentData = {
        employee_id: employeeId,
        component_name: formData.component_name,
        component_type: formData.component_type,
        amount: parseFloat(formData.amount),
        percentage: formData.percentage ? parseFloat(formData.percentage) : null,
        is_fixed: formData.is_fixed,
        is_taxable: formData.is_taxable,
        effective_from: formData.effective_from,
        effective_to: formData.effective_to || null
      };

      let error;
      if (component) {
        const result = await supabase
          .from('salary_components')
          .update(componentData)
          .eq('id', component.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('salary_components')
          .insert([componentData]);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Salary component ${component ? 'updated' : 'added'} successfully`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving salary component:', error);
      toast({
        title: "Error",
        description: `Failed to ${component ? 'update' : 'add'} salary component`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="component_name">Component Name</Label>
        <Input
          id="component_name"
          value={formData.component_name}
          onChange={(e) => setFormData(prev => ({ ...prev, component_name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="component_type">Type</Label>
        <Select value={formData.component_type} onValueChange={(value) => setFormData(prev => ({ ...prev, component_type: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="earning">Earning</SelectItem>
            <SelectItem value="deduction">Deduction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.is_fixed}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_fixed: checked }))}
        />
        <Label>Fixed Amount (vs Percentage)</Label>
      </div>

      {formData.is_fixed ? (
        <div>
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            required
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="percentage">Percentage (%)</Label>
          <Input
            id="percentage"
            type="number"
            step="0.01"
            value={formData.percentage}
            onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
            required
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.is_taxable}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_taxable: checked }))}
        />
        <Label>Taxable</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="effective_from">Effective From</Label>
          <Input
            id="effective_from"
            type="date"
            value={formData.effective_from}
            onChange={(e) => setFormData(prev => ({ ...prev, effective_from: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="effective_to">Effective To (Optional)</Label>
          <Input
            id="effective_to"
            type="date"
            value={formData.effective_to}
            onChange={(e) => setFormData(prev => ({ ...prev, effective_to: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : (component ? 'Update' : 'Add')}
        </Button>
      </div>
    </form>
  );
};

export default SalaryComponentsManager;
