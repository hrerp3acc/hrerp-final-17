
import { supabase } from '@/integrations/supabase/client';
import { 
  SkillCategory, 
  OrganizationalSkill, 
  SkillAssessment, 
  TrainingProgram 
} from '@/types/skillsManagement';

export const fetchSkillCategories = async (): Promise<SkillCategory[]> => {
  const { data, error } = await supabase
    .from('skills_categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

export const fetchOrganizationalSkills = async (): Promise<OrganizationalSkill[]> => {
  const { data, error } = await supabase
    .from('organizational_skills')
    .select(`
      *,
      category:skills_categories(*)
    `)
    .order('name');

  if (error) throw error;
  return data || [];
};

export const fetchSkillAssessments = async (): Promise<SkillAssessment[]> => {
  const { data, error } = await supabase
    .from('skill_assessments')
    .select(`
      *,
      skill:organizational_skills(*),
      employee:employees(*)
    `)
    .order('assessment_date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchTrainingPrograms = async (): Promise<TrainingProgram[]> => {
  const { data, error } = await supabase
    .from('training_programs')
    .select(`
      *,
      skill:organizational_skills(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createSkill = async (
  skillData: Omit<OrganizationalSkill, 'id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('organizational_skills')
    .insert([skillData])
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const createTrainingProgram = async (
  programData: Omit<TrainingProgram, 'id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('training_programs')
    .insert([programData])
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};
