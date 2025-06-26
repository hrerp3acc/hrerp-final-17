
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useEmployeeSync = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsEmployeeProfile, setNeedsEmployeeProfile] = useState(false);

  const checkEmployeeRecord = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data: existingEmployee, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (existingEmployee) {
        setEmployee(existingEmployee);
        setNeedsEmployeeProfile(false);
      } else {
        setNeedsEmployeeProfile(true);
      }
    } catch (error) {
      console.error('Error checking employee record:', error);
      toast({
        title: "Error",
        description: "Failed to check employee record",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEmployeeProfile = async (employeeData: {
    first_name: string;
    last_name: string;
    email: string;
    department_id?: string;
    position?: string;
  }) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          user_id: user.id,
          employee_id: `EMP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          first_name: employeeData.first_name,
          last_name: employeeData.last_name,
          email: employeeData.email,
          department_id: employeeData.department_id || null,
          position: employeeData.position || null,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      setEmployee(data);
      setNeedsEmployeeProfile(false);
      
      toast({
        title: "Employee Profile Created",
        description: "Your employee profile has been set up successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating employee profile:', error);
      toast({
        title: "Error",
        description: "Failed to create employee profile",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    checkEmployeeRecord();
  }, [user?.id]);

  return {
    employee,
    loading,
    needsEmployeeProfile,
    createEmployeeProfile,
    refetch: checkEmployeeRecord
  };
};
