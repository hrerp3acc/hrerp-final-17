
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useLeaveManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current employee
  const { data: employee } = useQuery({
    queryKey: ['current-employee', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('employees')
        .select('id, first_name, last_name, department_id, departments(name)')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch leave applications
  const { data: leaveApplications = [], isLoading, refetch } = useQuery({
    queryKey: ['leave-applications', employee?.id],
    queryFn: async () => {
      if (!employee?.id) return [];
      const { data, error } = await supabase
        .from('leave_applications')
        .select(`
          *,
          employees!leave_applications_employee_id_fkey(first_name, last_name),
          approved_by_employee:employees!leave_applications_approved_by_fkey(first_name, last_name)
        `)
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!employee?.id,
  });

  // Fetch all leave applications (for managers/admins)
  const { data: allLeaveApplications = [] } = useQuery({
    queryKey: ['all-leave-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_applications')
        .select(`
          *,
          employees!leave_applications_employee_id_fkey(first_name, last_name, department_id, departments(name)),
          approved_by_employee:employees!leave_applications_approved_by_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Create leave application mutation
  const createLeaveApplicationMutation = useMutation({
    mutationFn: async (leaveData: {
      leave_type: string;
      start_date: string;
      end_date: string;
      reason?: string;
    }) => {
      if (!employee?.id) throw new Error('Employee not found');
      
      const { data, error } = await supabase
        .from('leave_applications')
        .insert({
          employee_id: employee.id,
          ...leaveData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      toast({
        title: "Success",
        description: "Leave application submitted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update leave application status mutation
  const updateLeaveStatusMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      approved_by 
    }: { 
      id: string; 
      status: 'approved' | 'rejected'; 
      approved_by?: string; 
    }) => {
      const updates: any = {
        status,
        approved_at: new Date().toISOString(),
      };
      
      if (approved_by) {
        updates.approved_by = approved_by;
      }

      const { data, error } = await supabase
        .from('leave_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['all-leave-applications'] });
      toast({
        title: "Success",
        description: "Leave application status updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get leave balance (this would need additional logic based on company policies)
  const getLeaveBalance = () => {
    const currentYear = new Date().getFullYear();
    const approvedLeaves = leaveApplications.filter(
      leave => leave.status === 'approved' && 
      new Date(leave.start_date).getFullYear() === currentYear
    );
    
    const usedDays = approvedLeaves.reduce((total, leave) => {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);

    // Standard 25 days annual leave (this should be configurable)
    const annualAllowance = 25;
    
    return {
      total: annualAllowance,
      used: usedDays,
      remaining: annualAllowance - usedDays,
    };
  };

  // Get upcoming leaves for calendar
  const getUpcomingLeaves = () => {
    const today = new Date();
    return allLeaveApplications.filter(leave => 
      leave.status === 'approved' && 
      new Date(leave.start_date) >= today
    ).slice(0, 10);
  };

  return {
    employee,
    leaveApplications,
    allLeaveApplications,
    isLoading,
    createLeaveApplication: createLeaveApplicationMutation.mutate,
    updateLeaveStatus: updateLeaveStatusMutation.mutate,
    getLeaveBalance,
    getUpcomingLeaves,
    refetch,
  };
};
