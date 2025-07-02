
import { useToast } from '@/hooks/use-toast';

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  panNumber: string;
}

export const useEmployeeValidation = () => {
  const { toast } = useToast();

  const validatePanNumber = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateForm = (formData: EmployeeFormData) => {
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

  const checkForDuplicates = async (formData: EmployeeFormData) => {
    if (formData.panNumber && !validatePanNumber(formData.panNumber)) {
      throw new Error('Invalid PAN number format. Please enter a valid PAN number.');
    }
    
    if (!formData.email.trim()) {
      throw new Error('Email is required');
    }
  };

  return {
    validateForm,
    validatePanNumber,
    checkForDuplicates
  };
};
