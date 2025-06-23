
import type { Tables } from '@/integrations/supabase/types';

type PerformanceGoal = Tables<'performance_goals'>;
type PerformanceReview = Tables<'performance_reviews'>;

export const calculatePerformanceStats = (goals: PerformanceGoal[], reviews: PerformanceReview[]) => {
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
