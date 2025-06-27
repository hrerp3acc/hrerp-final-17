
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import { usePerformanceGoalsService } from '@/services/performanceGoalsService';
import { usePerformanceReviewsService } from '@/services/performanceReviewsService';
import { calculatePerformanceStats } from '@/utils/performanceStatsUtils';
import type { Tables } from '@/integrations/supabase/types';

type PerformanceGoal = Tables<'performance_goals'>;
type PerformanceReview = Tables<'performance_reviews'>;

export const usePerformanceManagement = () => {
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { employees } = useSupabaseEmployees();

  const goalsService = usePerformanceGoalsService();
  const reviewsService = usePerformanceReviewsService();

  const currentEmployee = user ? employees.find(emp => emp.user_id === user.id) : null;

  const checkIfManager = async () => {
    if (!user?.id) return false;
    
    try {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      return userRoles?.some(role => ['admin', 'manager'].includes(role.role)) || false;
    } catch (error) {
      console.error('Error checking manager status:', error);
      return false;
    }
  };

  const fetchGoals = async () => {
    if (!currentEmployee || !user) {
      setGoals([]);
      return;
    }
    
    try {
      setError(null);
      const isManager = await checkIfManager();
      const data = await goalsService.fetchGoals(user.id, isManager, currentEmployee.id);
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to fetch performance goals');
      setGoals([]);
    }
  };

  const fetchReviews = async () => {
    if (!currentEmployee || !user) {
      setReviews([]);
      return;
    }
    
    try {
      setError(null);
      const isManager = await checkIfManager();
      const data = await reviewsService.fetchReviews(user.id, isManager, currentEmployee.id);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch performance reviews');
      setReviews([]);
    }
  };

  const createGoal = async (goalData: {
    title: string;
    description?: string;
    category?: string;
    target_date: string;
    weight?: number;
  }) => {
    if (!currentEmployee) return null;
    
    const result = await goalsService.createGoal(currentEmployee.id, goalData);
    if (result) {
      await fetchGoals();
    }
    return result;
  };

  const updateGoal = async (id: string, updates: Partial<PerformanceGoal>) => {
    const result = await goalsService.updateGoal(id, updates);
    if (result) {
      await fetchGoals();
    }
    return result;
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
    if (!currentEmployee) return null;
    
    const result = await reviewsService.createReview(currentEmployee.id, reviewData);
    if (result) {
      await fetchReviews();
    }
    return result;
  };

  const updateReview = async (id: string, updates: Partial<PerformanceReview>) => {
    const result = await reviewsService.updateReview(id, updates);
    if (result) {
      await fetchReviews();
    }
    return result;
  };

  const getPerformanceStats = () => {
    return calculatePerformanceStats(goals, reviews);
  };

  useEffect(() => {
    if (currentEmployee && user) {
      Promise.all([fetchGoals(), fetchReviews()])
        .catch((error) => {
          console.error('Error loading performance data:', error);
          setError('Failed to load performance data');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setGoals([]);
      setReviews([]);
      setError(null);
    }
  }, [currentEmployee, user]);

  return {
    goals,
    reviews,
    loading,
    error,
    createGoal,
    updateGoal,
    createReview,
    updateReview,
    getPerformanceStats,
    refetch: () => Promise.all([fetchGoals(), fetchReviews()])
  };
};
