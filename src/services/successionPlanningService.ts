
import { supabase } from '@/integrations/supabase/client';
import { KeyPosition, SuccessionCandidate, DevelopmentPlan } from '@/types/successionPlanning';

export const fetchKeyPositions = async (): Promise<KeyPosition[]> => {
  const { data, error } = await supabase
    .from('key_positions')
    .select(`
      *,
      department:departments(*),
      current_holder:employees(*)
    `)
    .order('criticality');

  if (error) throw error;
  return data || [];
};

export const fetchSuccessionCandidates = async (): Promise<SuccessionCandidate[]> => {
  const { data, error } = await supabase
    .from('succession_candidates')
    .select(`
      *,
      employee:employees(*),
      key_position:key_positions(*)
    `)
    .order('development_progress', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchDevelopmentPlans = async (): Promise<DevelopmentPlan[]> => {
  const { data, error } = await supabase
    .from('development_plans')
    .select(`
      *,
      candidate:succession_candidates(
        *,
        employee:employees(*)
      )
    `)
    .order('progress', { ascending: false });

  if (error) throw error;
  
  // Transform the data to ensure activities is a string array and handle nullable fields
  const transformedData = data?.map(plan => ({
    ...plan,
    activities: Array.isArray(plan.activities) 
      ? plan.activities.map(activity => String(activity)) 
      : [],
    candidate_id: plan.candidate_id || '',
    progress: plan.progress || 0,
    timeline: plan.timeline || undefined,
    next_review_date: plan.next_review_date || undefined
  })) || [];
  
  return transformedData;
};

export const createKeyPosition = async (
  positionData: Omit<KeyPosition, 'id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('key_positions')
    .insert([positionData])
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};
