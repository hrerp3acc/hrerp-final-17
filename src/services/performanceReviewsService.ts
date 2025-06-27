
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type PerformanceReview = Tables<'performance_reviews'>;

export const usePerformanceReviewsService = () => {
  const fetchReviews = async (userId: string, isManager: boolean, employeeId: string) => {
    try {
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

      if (!isManager) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  };

  const createReview = async (reviewerId: string, reviewData: {
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
    try {
      const { data, error } = await supabase
        .from('performance_reviews')
        .insert([{
          reviewer_id: reviewerId,
          ...reviewData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
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
      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      return null;
    }
  };

  return {
    fetchReviews,
    createReview,
    updateReview
  };
};
