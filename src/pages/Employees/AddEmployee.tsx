import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LocationInput from '@/components/ui/LocationInput';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';

const AddEmployee = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addEmployee, departments, loading } = useSupabaseEmployees();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    position: '',
    location: '',
    startDate: '',
    salary: '',
    employeeId: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    address: '',
    notes: '',
    panNumber: '' // New field for PAN number
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validatePanNumber = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const checkForDuplicates = async () => {
    // In a real implementation, you would check against the database
    // For now, we'll implement basic validation
    if (formData.panNumber && !validatePanNumber(formData.panNumber)) {
      throw new Error('Invalid PAN number format. Please enter a valid PAN number.');
    }
    
    // Check for duplicate email (basic validation)
    if (!formData.email.trim()) {
      throw new Error('Email is required');
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "Last name is required.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required.",
        variant: "destructive"
      });
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }

    // PAN number validation
    if (formData.panNumber && !validatePanNumber(formData.panNumber)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid PAN number (Format: ABCDE1234F).",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.departmentId) {
      toast({
        title: "Validation Error",
        description: "Department is required.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for duplicates
      await checkForDuplicates();
      
      // Generate employee ID if not provided
      const employeeId = formData.employeeId || `EMP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const employeeData = {
        employee_id: employeeId,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        department_id: formData.departmentId,
        position: formData.position.trim() || null,
        location: formData.location.trim() || null,
        start_date: formData.startDate || null,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        emergency_contact_name: formData.emergencyContactName.trim() || null,
        emergency_contact_phone: formData.emergencyContactPhone.trim() || null,
        address: formData.address.trim() || null,
        notes: formData.notes.trim() || null,
        status: 'active' as const,
        manager_id: null,
        user_id: null,
        pan_number: formData.panNumber.trim().toUpperCase() || null // Add PAN number
      };

      console.log('Submitting employee data:', employeeData);
      
      const { data, error } = await addEmployee(employeeData);
      
      if (error) {
        console.error('Error adding employee:', error);
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          toast({
            title: "Duplicate Entry",
            description: "An employee with this email or PAN number already exists.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to add employee. Please try again.",
            variant: "destructive"
          });
        }
        return;
      }
      
      console.log('Employee added successfully:', data);
      toast({
        title: "Success",
        description: "Employee added successfully!",
      });
      navigate('/employees');
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
        <div className="flex items-center space-x-4">
          <Link to="/employees">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
            <p className="text-gray-600">Create a new employee profile</p>
          </div>
        </div>
      </div>

      {departments.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            No departments found. You may need to create departments first before adding employees.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john.doe@company.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input
                  id="panNumber"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
                <p className="text-xs text-gray-500 mt-1">Format: ABCDE1234F</p>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St, City, State, ZIP"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                placeholder="Auto-generated if empty"
              />
            </div>

            <div>
              <Label htmlFor="department">Department *</Label>
              <Select value={formData.departmentId} onValueChange={(value) => handleInputChange('departmentId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
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
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>

            <LocationInput
              id="location"
              value={formData.location}
              onValueChange={(value) => handleInputChange('location', value)}
            />

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="salary">Annual Salary</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="65000"
                min="0"
                step="0.01"
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Emergency Contact & Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  placeholder="+1 (555) 987-6543"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="lg:col-span-3 flex justify-end space-x-4">
          <Link to="/employees">
            <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
          </Link>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting || departments.length === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Adding Employee...' : 'Add Employee'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
