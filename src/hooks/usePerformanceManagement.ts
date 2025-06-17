
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const usePerformanceManagement = () => {
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
        .select('id, first_name, last_name, department_id, manager_id')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch performance goals
  const { data: goals = [], isLoading: goalsLoading, refetch: refetchGoals } = useQuery({
    queryKey: ['performance-goals', employee?.id],
    queryFn: async () => {
      if (!employee?.id) return [];
      const { data, error } = await supabase
        .from('performance_goals')
        .select(`
          *,
          employees!performance_goals_employee_id_fkey(first_name, last_name)
        `)
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || [];
    },
    enabled: !!employee?.id,
  });

  // Fetch performance reviews
  const { data: reviews = [], isLoading: reviewsLoading, refetch: refetchReviews } = useQuery({
    queryKey: ['performance-reviews', employee?.id],
    queryFn: async () => {
      if (!employee?.id) return [];
      const { data, error } = await supabase
        .from('performance_reviews')
        .select(`
          *,
          employees!performance_reviews_employee_id_fkey(first_name, last_name),
          reviewer:employees!performance_reviews_reviewer_id_fkey(first_name, last_name)
        `)
        .eq('employee_id', employee.id)
        .order('review_period_start', { ascending: false });
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || [];
    },
    enabled: !!employee?.id,
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: {
      title: string;
      description?: string;
      target_date: string;
      category: string;
      weight?: number;
    }) => {
      if (!employee?.id) throw new Error('Employee not found');
      
      const { data, error } = await supabase
        .from('performance_goals')
        .insert({
          employee_id: employee.id,
          ...goalData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-goals'] });
      toast({
        title: "Success",
        description: "Goal created successfully",
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

  // Update goal progress mutation
  const updateGoalProgressMutation = useMutation({
    mutationFn: async ({ 
      id, 
      progress, 
      status,
      notes 
    }: { 
      id: string; 
      progress: number;
      status?: string;
      notes?: string;
    }) => {
      const updates: any = {
        progress,
        updated_at: new Date().toISOString(),
      };
      
      if (status) updates.status = status;
      if (notes) updates.notes = notes;

      const { data, error } = await supabase
        .from('performance_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-goals'] });
      toast({
        title: "Success",
        description: "Goal progress updated",
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

  const getGoalStats = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const inProgressGoals = goals.filter(goal => goal.status === 'in_progress').length;
    const overdueGoals = goals.filter(goal => 
      goal.status !== 'completed' && 
      new Date(goal.target_date) < new Date()
    ).length;

    const avgProgress = goals.length > 0 
      ? goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / goals.length 
      : 0;

    return {
      totalGoals,
      completedGoals,
      inProgressGoals,
      overdueGoals,
      avgProgress: Math.round(avgProgress),
    };
  };

  return {
    employee,
    goals,
    reviews,
    goalsLoading,
    reviewsLoading,
    createGoal: createGoalMutation.mutate,
    updateGoalProgress: updateGoalProgressMutation.mutate,
    getGoalStats,
    refetchGoals,
    refetchReviews,
  };
};
