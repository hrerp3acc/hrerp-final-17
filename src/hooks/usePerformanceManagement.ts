
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
    try {
      const { data, error } = await supabase
        .from('performance_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching performance goals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch performance goals",
        variant: "destructive"
      });
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('performance_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching performance reviews:', error);
    }
  };

  const createGoal = async (goalData: {
    title: string;
    description?: string;
    category?: string;
    target_date: string;
    weight?: number;
    employee_id: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('performance_goals')
        .insert([goalData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Performance goal created successfully",
      });

      await fetchGoals();
      return data;
    } catch (error) {
      console.error('Error creating performance goal:', error);
      toast({
        title: "Error",
        description: "Failed to create performance goal",
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
        description: "Performance goal updated successfully",
      });

      await fetchGoals();
    } catch (error) {
      console.error('Error updating performance goal:', error);
      toast({
        title: "Error",
        description: "Failed to update performance goal",
        variant: "destructive"
      });
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('performance_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Performance goal deleted successfully",
      });

      await fetchGoals();
    } catch (error) {
      console.error('Error deleting performance goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete performance goal",
        variant: "destructive"
      });
    }
  };

  const getPerformanceStats = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const inProgressGoals = goals.filter(g => g.status === 'in_progress').length;
    const notStartedGoals = goals.filter(g => g.status === 'not_started').length;
    const overdueGoals = goals.filter(g => g.status === 'overdue').length;
    
    const avgProgress = goals.length > 0 
      ? Math.round(goals.reduce((acc, goal) => acc + (goal.progress || 0), 0) / goals.length)
      : 0;

    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
    // Add review stats
    const pendingReviews = reviews.filter(r => r.status === 'in_progress' || r.status === 'draft').length;
    const completedReviews = reviews.filter(r => r.status === 'completed').length;
    const avgRating = reviews.length > 0 
      ? Math.round((reviews.reduce((acc, review) => acc + (review.overall_rating || 0), 0) / reviews.length) * 10) / 10
      : 0;

    return {
      totalGoals,
      completedGoals,
      inProgressGoals,
      notStartedGoals,
      overdueGoals,
      avgProgress,
      completionRate,
      pendingReviews,
      completedReviews,
      avgRating
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
    deleteGoal,
    getPerformanceStats,
    refetch: () => Promise.all([fetchGoals(), fetchReviews()])
  };
};
