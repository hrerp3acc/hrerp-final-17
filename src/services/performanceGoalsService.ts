
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type PerformanceGoal = Tables<'performance_goals'>;

export const usePerformanceGoalsService = () => {
  const fetchGoals = async (userId: string, isManager: boolean, employeeId: string) => {
    try {
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

      if (!isManager) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  };

  const createGoal = async (employeeId: string, goalData: {
    title: string;
    description?: string;
    category?: string;
    target_date: string;
    weight?: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('performance_goals')
        .insert([{
          employee_id: employeeId,
          ...goalData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating goal:', error);
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
      return data;
    } catch (error) {
      console.error('Error updating goal:', error);
      return null;
    }
  };

  return {
    fetchGoals,
    createGoal,
    updateGoal
  };
};
