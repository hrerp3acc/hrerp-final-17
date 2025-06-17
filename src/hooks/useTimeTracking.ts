
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useTimeTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string>('');
  const [currentTaskId, setCurrentTaskId] = useState<string>('');
  const [currentDescription, setCurrentDescription] = useState<string>('');

  // Get current employee
  const { data: employee } = useQuery({
    queryKey: ['current-employee', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch time entries
  const { data: timeEntries = [], isLoading, refetch } = useQuery({
    queryKey: ['time-entries', employee?.id],
    queryFn: async () => {
      if (!employee?.id) return [];
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          projects(name),
          tasks(name)
        `)
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!employee?.id,
  });

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch tasks for selected project
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', currentProjectId],
    queryFn: async () => {
      if (!currentProjectId) return [];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', currentProjectId)
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentProjectId,
  });

  // Create time entry mutation
  const createTimeEntryMutation = useMutation({
    mutationFn: async (timeEntry: {
      project_id?: string;
      task_id?: string;
      description?: string;
      start_time: string;
      end_time?: string;
    }) => {
      if (!employee?.id) throw new Error('Employee not found');
      
      const { data, error } = await supabase
        .from('time_entries')
        .insert({
          employee_id: employee.id,
          ...timeEntry,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      toast({
        title: "Success",
        description: "Time entry created successfully",
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

  // Update time entry mutation
  const updateTimeEntryMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('time_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
    },
  });

  // Timer functions
  const startTimer = () => {
    if (!currentProjectId) {
      toast({
        title: "Error",
        description: "Please select a project",
        variant: "destructive",
      });
      return;
    }

    const timeEntry = {
      project_id: currentProjectId,
      task_id: currentTaskId || undefined,
      description: currentDescription,
      start_time: new Date().toISOString(),
    };

    createTimeEntryMutation.mutate(timeEntry, {
      onSuccess: (data) => {
        setActiveTimer(data.id);
        toast({
          title: "Timer Started",
          description: "Time tracking has begun",
        });
      },
    });
  };

  const pauseTimer = () => {
    if (!activeTimer) return;
    
    updateTimeEntryMutation.mutate({
      id: activeTimer,
      status: 'paused',
    });
    
    setActiveTimer(null);
    toast({
      title: "Timer Paused",
      description: "Time tracking has been paused",
    });
  };

  const stopTimer = () => {
    if (!activeTimer) return;
    
    updateTimeEntryMutation.mutate({
      id: activeTimer,
      end_time: new Date().toISOString(),
      status: 'completed',
    });
    
    setActiveTimer(null);
    toast({
      title: "Timer Stopped",
      description: "Time entry has been completed",
    });
  };

  const createTimeEntry = (timeEntry: {
    project_id?: string;
    task_id?: string;
    description?: string;
    start_time: string;
    end_time?: string;
  }) => {
    createTimeEntryMutation.mutate(timeEntry);
  };

  const getTodayEntries = () => {
    const today = new Date().toDateString();
    return timeEntries.filter(entry => 
      new Date(entry.start_time).toDateString() === today
    );
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEntries = timeEntries.filter(entry => 
      new Date(entry.start_time) >= weekStart
    );
    
    const totalHours = weekEntries.reduce((sum, entry) => 
      sum + (entry.total_hours || 0), 0
    );
    
    return {
      totalHours,
      totalEntries: weekEntries.length,
      billableHours: weekEntries
        .filter(entry => entry.is_billable)
        .reduce((sum, entry) => sum + (entry.total_hours || 0), 0),
    };
  };

  return {
    timeEntries,
    projects,
    tasks,
    isLoading,
    activeTimer,
    currentProjectId,
    setCurrentProjectId,
    currentTaskId,
    setCurrentTaskId,
    currentDescription,
    setCurrentDescription,
    startTimer,
    pauseTimer,
    stopTimer,
    createTimeEntry,
    getTodayEntries,
    getWeeklyStats,
    refetch,
  };
};
