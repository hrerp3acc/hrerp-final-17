import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import type { Tables } from '@/integrations/supabase/types';

type Timesheet = Tables<'timesheets'>;
type TimeEntry = Tables<'time_entries'>;

export const useTimesheets = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { employees, loading: employeesLoading } = useSupabaseEmployees();

  const currentEmployee = user ? employees.find(emp => emp.user_id === user.id) : null;

  const fetchTimesheets = async () => {
    if (!currentEmployee) return;

    try {
      const { data, error } = await supabase
        .from('timesheets')
        .select('*')
        .eq('employee_id', currentEmployee.id)
        .order('week_start_date', { ascending: false });

      if (error) throw error;
      setTimesheets(data || []);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch timesheets",
        variant: "destructive"
      });
    }
  };

  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  const createTimesheet = async (weekStartDate: string) => {
    if (!currentEmployee) return null;

    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    try {
      // Check if timesheet already exists
      const { data: existing } = await supabase
        .from('timesheets')
        .select('*')
        .eq('employee_id', currentEmployee.id)
        .eq('week_start_date', weekStartDate)
        .single();

      if (existing) {
        toast({
          title: "Timesheet Exists",
          description: "Timesheet for this week already exists",
          variant: "destructive"
        });
        return existing;
      }

      // Get time entries for the week
      const { data: timeEntries, error: entriesError } = await supabase
        .from('time_entries')
        .select('total_hours')
        .eq('employee_id', currentEmployee.id)
        .gte('start_time', `${weekStartDate}T00:00:00`)
        .lt('start_time', `${weekEnd.toISOString().split('T')[0]}T23:59:59`)
        .not('total_hours', 'is', null);

      if (entriesError) throw entriesError;

      const totalHours = timeEntries?.reduce((sum, entry) => sum + (entry.total_hours || 0), 0) || 0;

      const { data, error } = await supabase
        .from('timesheets')
        .insert([{
          employee_id: currentEmployee.id,
          week_start_date: weekStartDate,
          week_end_date: weekEnd.toISOString().split('T')[0],
          total_hours: totalHours,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchTimesheets();
      
      toast({
        title: "Timesheet Created",
        description: "New timesheet created successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating timesheet:', error);
      toast({
        title: "Error",
        description: "Failed to create timesheet",
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

      await fetchTimesheets();
      
      toast({
        title: "Timesheet Submitted",
        description: "Timesheet submitted for approval"
      });
      
      return data;
    } catch (error) {
      console.error('Error submitting timesheet:', error);
      toast({
        title: "Error",
        description: "Failed to submit timesheet",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateTimesheet = async (timesheetId: string, updates: Partial<Timesheet>) => {
    try {
      const { data, error } = await supabase
        .from('timesheets')
        .update(updates)
        .eq('id', timesheetId)
        .select()
        .single();

      if (error) throw error;

      await fetchTimesheets();
      
      toast({
        title: "Timesheet Updated",
        description: "Timesheet updated successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating timesheet:', error);
      toast({
        title: "Error",
        description: "Failed to update timesheet",
        variant: "destructive"
      });
      return null;
    }
  };

  const getTimesheetEntries = async (weekStartDate: string) => {
    if (!currentEmployee) return [];

    const weekEnd = new Date(weekStartDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          projects (
            name
          ),
          tasks (
            name
          )
        `)
        .eq('employee_id', currentEmployee.id)
        .gte('start_time', `${weekStartDate}T00:00:00`)
        .lt('start_time', `${weekEnd.toISOString().split('T')[0]}T23:59:59`)
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching timesheet entries:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (employeesLoading) return;
      
      setLoading(true);
      await fetchTimesheets();
      setLoading(false);
    };

    if (currentEmployee) {
      loadData();
    } else if (!employeesLoading) {
      setLoading(false);
    }
  }, [currentEmployee, employeesLoading]);

  return {
    timesheets,
    loading,
    createTimesheet,
    submitTimesheet,
    updateTimesheet,
    getTimesheetEntries,
    getWeekDates,
    refetch: fetchTimesheets
  };
};
