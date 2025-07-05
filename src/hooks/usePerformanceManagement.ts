
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type PerformanceGoal = Tables<'performance_goals'>;
type PerformanceReview = Tables<'performance_reviews'>;

export const usePerformanceManagement = () => {
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchGoals = async () => {
    if (!user) return;

    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!employee) return;

      const { data, error } = await supabase
        .from('performance_goals')
        .select('*')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch performance goals",
        variant: "destructive"
      });
    }
  };

  const fetchReviews = async () => {
    if (!user) return;

    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!employee) return;

      const { data, error } = await supabase
        .from('performance_reviews')
        .select('*')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const createGoal = async (goalData: {
    title: string;
    description?: string;
    category?: string;
    target_date: string;
    weight?: number;
  }) => {
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
        .from('performance_goals')
        .insert([{
          employee_id: employee.id,
          ...goalData
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal created successfully",
      });

      await fetchGoals();
      return data;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<PerformanceGoal>) => {
    try {
      const { error } = await supabase
        .from('performance_goals')
        .update(updates)
        .eq('id', goalId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal updated successfully",
      });

      await fetchGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive"
      });
    }
  };

  const getGoalStats = () => {
    const total = goals.length;
    const completed = goals.filter(g => g.status === 'completed').length;
    const inProgress = goals.filter(g => g.status === 'in_progress').length;
    const notStarted = goals.filter(g => g.status === 'not_started').length;
    const averageProgress = goals.length > 0 
      ? goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length 
      : 0;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      averageProgress: Math.round(averageProgress)
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchGoals(), fetchReviews()]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    goals,
    reviews,
    loading,
    createGoal,
    updateGoal,
    getGoalStats,
    refetch: () => Promise.all([fetchGoals(), fetchReviews()])
  };
};
