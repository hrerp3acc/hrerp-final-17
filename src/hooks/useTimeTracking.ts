import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import type { Tables } from '@/integrations/supabase/types';

type TimeEntry = Tables<'time_entries'>;
type Project = Tables<'projects'>;
type Task = Tables<'tasks'>;

export const useTimeTracking = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { employees, loading: employeesLoading } = useSupabaseEmployees();

  const currentEmployee = user ? employees.find(emp => emp.user_id === user.id) : null;

  const fetchTimeEntries = async () => {
    if (!currentEmployee) return;
    
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', currentEmployee.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTimeEntries(data || []);
      
      // Find active entry
      const active = data?.find(entry => entry.status === 'active' && !entry.end_time);
      setActiveEntry(active || null);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch time entries",
        variant: "destructive"
      });
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const startTracking = async (projectId?: string, taskId?: string, description?: string) => {
    if (!currentEmployee) {
      toast({
        title: "Error",
        description: "Employee not found",
        variant: "destructive"
      });
      return null;
    }

    try {
      // Stop any existing active entry
      if (activeEntry) {
        await stopTracking();
      }

      const { data, error } = await supabase
        .from('time_entries')
        .insert([{
          employee_id: currentEmployee.id,
          project_id: projectId || null,
          task_id: taskId || null,
          start_time: new Date().toISOString(),
          description: description || null,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setActiveEntry(data);
      await fetchTimeEntries();
      
      toast({
        title: "Time Tracking Started",
        description: "Timer started successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error starting time tracking:', error);
      toast({
        title: "Error",
        description: "Failed to start time tracking",
        variant: "destructive"
      });
      return null;
    }
  };

  const stopTracking = async () => {
    if (!activeEntry) return null;

    try {
      const endTime = new Date().toISOString();
      const startTime = new Date(activeEntry.start_time);
      const totalHours = (new Date(endTime).getTime() - startTime.getTime()) / (1000 * 60 * 60);

      const { data, error } = await supabase
        .from('time_entries')
        .update({
          end_time: endTime,
          total_hours: totalHours,
          status: 'completed'
        })
        .eq('id', activeEntry.id)
        .select()
        .single();

      if (error) throw error;
      
      setActiveEntry(null);
      await fetchTimeEntries();
      
      toast({
        title: "Time Tracking Stopped",
        description: "Timer stopped successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error stopping time tracking:', error);
      toast({
        title: "Error",
        description: "Failed to stop time tracking",
        variant: "destructive"
      });
      return null;
    }
  };

  const pauseTracking = async () => {
    if (!activeEntry) return null;

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .update({ status: 'paused' })
        .eq('id', activeEntry.id)
        .select()
        .single();

      if (error) throw error;
      
      setActiveEntry(data);
      await fetchTimeEntries();
      
      return data;
    } catch (error) {
      console.error('Error pausing time tracking:', error);
      toast({
        title: "Error",
        description: "Failed to pause time tracking",
        variant: "destructive"
      });
      return null;
    }
  };

  const resumeTracking = async () => {
    if (!activeEntry) return null;

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .update({ status: 'active' })
        .eq('id', activeEntry.id)
        .select()
        .single();

      if (error) throw error;
      
      setActiveEntry(data);
      await fetchTimeEntries();
      
      return data;
    } catch (error) {
      console.error('Error resuming time tracking:', error);
      toast({
        title: "Error",
        description: "Failed to resume time tracking",
        variant: "destructive"
      });
      return null;
    }
  };

  const getTimeStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const todayEntries = timeEntries.filter(entry => 
      entry.start_time.startsWith(today) && entry.total_hours
    );
    const weekEntries = timeEntries.filter(entry => 
      new Date(entry.start_time) >= thisWeekStart && entry.total_hours
    );
    const monthEntries = timeEntries.filter(entry => 
      new Date(entry.start_time) >= thisMonthStart && entry.total_hours
    );

    const todayHours = todayEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
    const weekHours = weekEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
    const monthHours = monthEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);

    return {
      today: todayHours,
      week: weekHours,
      month: monthHours,
      average: weekEntries.length > 0 ? weekHours / 7 : 0
    };
  };

  useEffect(() => {
    const loadData = async () => {
      if (employeesLoading) return;
      
      setLoading(true);
      await Promise.all([fetchTimeEntries(), fetchProjects(), fetchTasks()]);
      setLoading(false);
    };

    if (currentEmployee) {
      loadData();
    } else if (!employeesLoading) {
      setLoading(false);
    }
  }, [currentEmployee, employeesLoading]);

  return {
    timeEntries,
    projects,
    tasks,
    activeEntry,
    loading,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    getTimeStats,
    refetch: fetchTimeEntries
  };
};
