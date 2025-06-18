
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import type { Tables } from '@/integrations/supabase/types';

type LeaveApplication = Tables<'leave_applications'>;
type LeaveType = 'annual' | 'sick' | 'personal' | 'emergency' | 'maternity' | 'paternity';
type LeaveStatus = 'pending' | 'approved' | 'rejected';

interface LeaveBalance {
  type: string;
  used: number;
  total: number;
  remaining: number;
}

export const useLeaveManagement = () => {
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { employees } = useSupabaseEmployees();

  const currentEmployee = user ? employees.find(emp => emp.user_id === user.id) : null;

  const fetchLeaveApplications = async () => {
    if (!currentEmployee) return;
    
    try {
      const { data, error } = await supabase
        .from('leave_applications')
        .select(`
          *,
          employees!leave_applications_employee_id_fkey (
            first_name,
            last_name,
            employee_id
          ),
          approver:employees!leave_applications_approved_by_fkey (
            first_name,
            last_name
          )
        `)
        .eq('employee_id', currentEmployee.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaveApplications(data || []);
    } catch (error) {
      console.error('Error fetching leave applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leave applications",
        variant: "destructive"
      });
    }
  };

  const applyForLeave = async (leaveData: {
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    reason?: string;
  }) => {
    if (!currentEmployee) {
      toast({
        title: "Error",
        description: "Employee not found",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('leave_applications')
        .insert([{
          employee_id: currentEmployee.id,
          ...leaveData
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchLeaveApplications();
      
      toast({
        title: "Leave Application Submitted",
        description: "Your leave application has been submitted for approval"
      });
      
      return data;
    } catch (error) {
      console.error('Error applying for leave:', error);
      toast({
        title: "Error",
        description: "Failed to submit leave application",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateLeaveApplication = async (id: string, updates: Partial<LeaveApplication>) => {
    try {
      const { data, error } = await supabase
        .from('leave_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchLeaveApplications();
      
      toast({
        title: "Leave Application Updated",
        description: "Your leave application has been updated"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating leave application:', error);
      toast({
        title: "Error",
        description: "Failed to update leave application",
        variant: "destructive"
      });
      return null;
    }
  };

  const approveLeaveApplication = async (id: string) => {
    if (!currentEmployee) return null;

    try {
      const { data, error } = await supabase
        .from('leave_applications')
        .update({
          status: 'approved' as LeaveStatus,
          approved_by: currentEmployee.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchLeaveApplications();
      
      toast({
        title: "Leave Approved",
        description: "Leave application has been approved"
      });
      
      return data;
    } catch (error) {
      console.error('Error approving leave:', error);
      toast({
        title: "Error",
        description: "Failed to approve leave application",
        variant: "destructive"
      });
      return null;
    }
  };

  const rejectLeaveApplication = async (id: string) => {
    if (!currentEmployee) return null;

    try {
      const { data, error } = await supabase
        .from('leave_applications')
        .update({
          status: 'rejected' as LeaveStatus,
          approved_by: currentEmployee.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchLeaveApplications();
      
      toast({
        title: "Leave Rejected",
        description: "Leave application has been rejected"
      });
      
      return data;
    } catch (error) {
      console.error('Error rejecting leave:', error);
      toast({
        title: "Error",
        description: "Failed to reject leave application",
        variant: "destructive"
      });
      return null;
    }
  };

  const getLeaveBalance = (): LeaveBalance[] => {
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    const approvedLeaves = leaveApplications.filter(
      app => app.status === 'approved' && 
      new Date(app.start_date) >= yearStart && 
      new Date(app.end_date) <= yearEnd
    );

    const leaveTypes = [
      { type: 'Annual Leave', key: 'annual', total: 25 },
      { type: 'Sick Leave', key: 'sick', total: 10 },
      { type: 'Personal Leave', key: 'personal', total: 5 },
      { type: 'Maternity/Paternity', key: 'maternity', total: 90 }
    ];

    return leaveTypes.map(leaveType => {
      const used = approvedLeaves
        .filter(app => app.leave_type === leaveType.key)
        .reduce((total, app) => {
          const start = new Date(app.start_date);
          const end = new Date(app.end_date);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          return total + days;
        }, 0);

      return {
        type: leaveType.type,
        used,
        total: leaveType.total,
        remaining: leaveType.total - used
      };
    });
  };

  const getLeaveStats = () => {
    const total = leaveApplications.length;
    const pending = leaveApplications.filter(app => app.status === 'pending').length;
    const approved = leaveApplications.filter(app => app.status === 'approved').length;
    const rejected = leaveApplications.filter(app => app.status === 'rejected').length;

    return {
      total,
      pending,
      approved,
      rejected
    };
  };

  useEffect(() => {
    if (currentEmployee) {
      fetchLeaveApplications().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currentEmployee]);

  return {
    leaveApplications,
    loading,
    applyForLeave,
    updateLeaveApplication,
    approveLeaveApplication,
    rejectLeaveApplication,
    getLeaveBalance,
    getLeaveStats,
    refetch: fetchLeaveApplications
  };
};
