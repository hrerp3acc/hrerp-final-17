
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import { useEmployeeValidation } from '@/hooks/useEmployeeValidation';
import PersonalInfoForm from '@/components/Employee/PersonalInfoForm';
import EmploymentDetailsForm from '@/components/Employee/EmploymentDetailsForm';
import EmergencyContactForm from '@/components/Employee/EmergencyContactForm';

const AddEmployee = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addEmployee, departments, loading } = useSupabaseEmployees();
  const { validateForm } = useEmployeeValidation();
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
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);

    try {
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
        user_id: null
      };

      console.log('Submitting employee data:', employeeData);
      
      const { data, error } = await addEmployee(employeeData);
      
      if (error) {
        console.error('Error adding employee:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to add employee. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Employee added successfully:', data);
      navigate('/employees');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
        <PersonalInfoForm 
          formData={formData} 
          onInputChange={handleInputChange} 
        />
        
        <EmploymentDetailsForm 
          formData={formData} 
          departments={departments}
          onInputChange={handleInputChange} 
        />
        
        <EmergencyContactForm 
          formData={formData} 
          onInputChange={handleInputChange} 
        />

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
