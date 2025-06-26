
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import { useAuth } from '@/contexts/AuthContext';
import { User } from 'lucide-react';

interface EmployeeProfileSetupProps {
  isOpen: boolean;
  onComplete: (employeeData: any) => void;
}

const EmployeeProfileSetup = ({ isOpen, onComplete }: EmployeeProfileSetupProps) => {
  const { user } = useAuth();
  const { departments } = useSupabaseEmployees();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    departmentId: '',
    position: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onComplete({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        department_id: formData.departmentId || null,
        position: formData.position || null,
      });
    } catch (error) {
      console.error('Error setting up profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Complete Your Profile</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            To use the HR system, we need to set up your employee profile.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john.doe@company.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Select value={formData.departmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, departmentId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select department (optional)" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Software Engineer (optional)"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Setting up...' : 'Complete Setup'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeProfileSetup;
