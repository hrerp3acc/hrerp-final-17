
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type TimeEntry = Tables<'time_entries'>;

export const useTimeTracking = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTimeEntries = async () => {
    if (!user) return;

    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!employee) return;

      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', employee.id)
        .order('start_time', { ascending: false });

      if (error) throw error;
      
      setTimeEntries(data || []);
      
      // Find active entry (one without end_time)
      const active = data?.find(entry => !entry.end_time && entry.status === 'active') || null;
      setActiveEntry(active);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch time entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startTracking = async (description?: string) => {
    if (!user) return null;

    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!employee) {
        toast({
          title: "Error",
          description: "Employee record not found",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('time_entries')
        .insert([{
          employee_id: employee.id,
          start_time: new Date().toISOString(),
          description: description || 'Work session',
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setActiveEntry(data);
      await fetchTimeEntries();

      toast({
        title: "Time tracking started",
        description: "Your work session has begun",
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
          total_hours: Math.round(totalHours * 100) / 100,
          status: 'completed'
        })
        .eq('id', activeEntry.id)
        .select()
        .single();

      if (error) throw error;

      setActiveEntry(null);
      await fetchTimeEntries();

      toast({
        title: "Time tracking stopped",
        description: `Session completed: ${Math.round(totalHours * 100) / 100} hours`,
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
      const { error } = await supabase
        .from('time_entries')
        .update({ status: 'paused' })
        .eq('id', activeEntry.id);

      if (error) throw error;

      setActiveEntry({ ...activeEntry, status: 'paused' });
      toast({
        title: "Time tracking paused",
        description: "Your session is on break",
      });
    } catch (error) {
      console.error('Error pausing time tracking:', error);
      toast({
        title: "Error",
        description: "Failed to pause time tracking",
        variant: "destructive"
      });
    }
  };

  const resumeTracking = async () => {
    if (!activeEntry) return null;

    try {
      const { error } = await supabase
        .from('time_entries')
        .update({ status: 'active' })
        .eq('id', activeEntry.id);

      if (error) throw error;

      setActiveEntry({ ...activeEntry, status: 'active' });
      toast({
        title: "Time tracking resumed",
        description: "Your session has continued",
      });
    } catch (error) {
      console.error('Error resuming time tracking:', error);
      toast({
        title: "Error",
        description: "Failed to resume time tracking",
        variant: "destructive"
      });
    }
  };

  const getTimeStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayEntries = timeEntries.filter(entry => 
      new Date(entry.start_time) >= today && entry.total_hours
    );
    const weekEntries = timeEntries.filter(entry => 
      new Date(entry.start_time) >= weekStart && entry.total_hours
    );
    const monthEntries = timeEntries.filter(entry => 
      new Date(entry.start_time) >= monthStart && entry.total_hours
    );

    const todayHours = todayEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
    const weekHours = weekEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
    const monthHours = monthEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);

    const workingDaysThisMonth = Math.max(1, new Date().getDate());
    const averageDaily = monthHours / workingDaysThisMonth;

    return {
      today: todayHours,
      week: weekHours,
      month: monthHours,
      average: averageDaily
    };
  };

  useEffect(() => {
    fetchTimeEntries();
  }, [user]);

  return {
    timeEntries,
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
