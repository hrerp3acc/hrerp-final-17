
import { useToast } from '@/hooks/use-toast';

export const useEmployeeValidation = () => {
  const { toast } = useToast();

  const validateForm = (formData: {
    firstName: string;
    lastName: string;
    email: string;
    departmentId: string;
  }) => {
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

  return { validateForm };
};
