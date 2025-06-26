
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Timesheet = Tables<'timesheets'>;

export const useTimesheets = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimesheets = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // First get the employee record for this user
      const { data: employee, error: empError } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (empError) throw empError;
      if (!employee) {
        throw new Error('Employee record not found');
      }

      const { data, error } = await supabase
        .from('timesheets')
        .select('*')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTimesheets(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch timesheets';
      setError(errorMessage);
      console.error('Error fetching timesheets:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTimesheet = async (timesheetData: {
    week_start_date: string;
    week_end_date: string;
    notes?: string | null;
  }) => {
    if (!user?.id) return null;

    try {
      // First get the employee record for this user
      const { data: employee, error: empError } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (empError) throw empError;
      if (!employee) {
        throw new Error('Employee record not found. Please complete your profile setup.');
      }

      const { data, error } = await supabase
        .from('timesheets')
        .insert({
          employee_id: employee.id,
          week_start_date: timesheetData.week_start_date,
          week_end_date: timesheetData.week_end_date,
          notes: timesheetData.notes,
          status: 'draft',
          total_hours: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Timesheet Created", 
        description: "Your timesheet has been created successfully.",
      });

      await fetchTimesheets();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create timesheet';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  };

  const submitTimesheet = async (timesheetId: string) => {
    try {
      const { data, error } = await supabase
        .from('timesheets')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .eq('id', timesheetId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Timesheet Submitted",
        description: "Your timesheet has been submitted for approval.",
      });

      await fetchTimesheets();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit timesheet';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  };

  const getTimesheetStats = () => {
    const total = timesheets.length;
    const pending = timesheets.filter(t => t.status === 'draft' || t.status === 'submitted').length;
    const approved = timesheets.filter(t => t.status === 'approved').length;
    const totalHours = timesheets.reduce((sum, t) => sum + (t.total_hours || 0), 0);

    return {
      total,
      pending,
      approved,
      totalHours
    };
  };

  useEffect(() => {
    fetchTimesheets();
  }, [user?.id]);

  return {
    timesheets,
    loading,
    error,
    createTimesheet,
    submitTimesheet,
    getTimesheetStats,
    refetch: fetchTimesheets
  };
};
