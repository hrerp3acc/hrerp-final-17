
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import type { Tables } from '@/integrations/supabase/types';

type PerformanceGoal = Tables<'performance_goals'>;
type PerformanceReview = Tables<'performance_reviews'>;

export const usePerformanceManagement = () => {
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { employees } = useSupabaseEmployees();

  const currentEmployee = user ? employees.find(emp => emp.user_id === user.id) : null;

  const fetchGoals = async () => {
    if (!currentEmployee) {
      setLoading(false);
      return;
    }
    
    try {
      // Check if user is admin/manager to see all goals or just their own
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id);
      
      const isManager = userRoles?.some(role => ['admin', 'manager'].includes(role.role));

      let query = supabase
        .from('performance_goals')
        .select(`
          *,
          employees!performance_goals_employee_id_fkey (
            first_name,
            last_name,
            employee_id
          )
        `)
        .order('created_at', { ascending: false });

      // If not a manager, only show their own goals
      if (!isManager) {
        query = query.eq('employee_id', currentEmployee.id);
      }

      const { data, error } = await query;

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
    if (!currentEmployee) {
      setLoading(false);
      return;
    }
    
    try {
      // Check if user is admin/manager to see all reviews or just their own
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id);
      
      const isManager = userRoles?.some(role => ['admin', 'manager'].includes(role.role));

      let query = supabase
        .from('performance_reviews')
        .select(`
          *,
          employees!performance_reviews_employee_id_fkey (
            first_name,
            last_name,
            employee_id
          ),
          reviewer:employees!performance_reviews_reviewer_id_fkey (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      // If not a manager, only show reviews where they are the employee
      if (!isManager) {
        query = query.eq('employee_id', currentEmployee.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to fetch performance reviews",
        variant: "destructive"
      });
    }
  };

  const createGoal = async (goalData: {
    title: string;
    description?: string;
    category?: string;
    target_date: string;
    weight?: number;
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
        .from('performance_goals')
        .insert([{
          employee_id: currentEmployee.id,
          ...goalData
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchGoals();
      
      toast({
        title: "Goal Created",
        description: "Your performance goal has been created successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create performance goal",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateGoal = async (id: string, updates: Partial<PerformanceGoal>) => {
    try {
      const { data, error } = await supabase
        .from('performance_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchGoals();
      
      toast({
        title: "Goal Updated",
        description: "Your performance goal has been updated successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update performance goal",
        variant: "destructive"
      });
      return null;
    }
  };

  const createReview = async (reviewData: {
    employee_id: string;
    review_period_start: string;
    review_period_end: string;
    overall_rating?: number;
    goals_rating?: number;
    competencies_rating?: number;
    achievements?: string;
    areas_for_improvement?: string;
    development_notes?: string;
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
        .from('performance_reviews')
        .insert([{
          reviewer_id: currentEmployee.id,
          ...reviewData
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchReviews();
      
      toast({
        title: "Review Created",
        description: "Performance review has been created successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      toast({
        title: "Error",
        description: "Failed to create performance review",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateReview = async (id: string, updates: Partial<PerformanceReview>) => {
    try {
      const { data, error } = await supabase
        .from('performance_reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchReviews();
      
      toast({
        title: "Review Updated",
        description: "Performance review has been updated successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update performance review",
        variant: "destructive"
      });
      return null;
    }
  };

  const getPerformanceStats = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const inProgressGoals = goals.filter(goal => goal.status === 'in_progress').length;
    const overdueGoals = goals.filter(goal => {
      const targetDate = new Date(goal.target_date);
      const today = new Date();
      return goal.status !== 'completed' && targetDate < today;
    }).length;
    
    const totalReviews = reviews.length;
    const completedReviews = reviews.filter(review => review.status === 'completed').length;
    const pendingReviews = reviews.filter(review => review.status === 'draft' || review.status === 'in_progress').length;
    
    const avgProgress = goals.length > 0 
      ? goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / goals.length 
      : 0;

    const avgRating = reviews.length > 0 
      ? reviews
          .filter(review => review.overall_rating)
          .reduce((sum, review) => sum + (review.overall_rating || 0), 0) / 
        reviews.filter(review => review.overall_rating).length 
      : 0;

    return {
      totalGoals,
      completedGoals,
      inProgressGoals,
      overdueGoals,
      totalReviews,
      completedReviews,
      pendingReviews,
      avgProgress: Math.round(avgProgress),
      avgRating: Math.round(avgRating * 100) / 100
    };
  };

  useEffect(() => {
    if (currentEmployee) {
      Promise.all([fetchGoals(), fetchReviews()]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currentEmployee]);

  return {
    goals,
    reviews,
    loading,
    createGoal,
    updateGoal,
    createReview,
    updateReview,
    getPerformanceStats,
    refetch: () => Promise.all([fetchGoals(), fetchReviews()])
  };
};
