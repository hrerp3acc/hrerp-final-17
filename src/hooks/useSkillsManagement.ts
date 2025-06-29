
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationalSkill {
  id: string;
  name: string;
  category_id?: string;
  description?: string;
  required_level: string;
  created_at: string;
  updated_at: string;
  category?: SkillCategory;
}

export interface SkillAssessment {
  id: string;
  employee_id: string;
  skill_id: string;
  current_level: number;
  target_level: number;
  assessed_by?: string;
  assessment_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  skill?: OrganizationalSkill;
  employee?: any;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description?: string;
  skill_id?: string;
  duration_hours?: number;
  status: string;
  max_participants?: number;
  current_participants: number;
  completion_rate: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  skill?: OrganizationalSkill;
}

export const useSkillsManagement = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [organizationalSkills, setOrganizationalSkills] = useState<OrganizationalSkill[]>([]);
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([]);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSkillCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('skills_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setSkillCategories(data || []);
    } catch (error) {
      console.error('Error fetching skill categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skill categories",
        variant: "destructive"
      });
    }
  };

  const fetchOrganizationalSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('organizational_skills')
        .select(`
          *,
          category:skills_categories(*)
        `)
        .order('name');

      if (error) throw error;
      setOrganizationalSkills(data || []);
    } catch (error) {
      console.error('Error fetching organizational skills:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organizational skills",
        variant: "destructive"
      });
    }
  };

  const fetchSkillAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_assessments')
        .select(`
          *,
          skill:organizational_skills(*),
          employee:employees(*)
        `)
        .order('assessment_date', { ascending: false });

      if (error) throw error;
      setSkillAssessments(data || []);
    } catch (error) {
      console.error('Error fetching skill assessments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skill assessments",
        variant: "destructive"
      });
    }
  };

  const fetchTrainingPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('training_programs')
        .select(`
          *,
          skill:organizational_skills(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrainingPrograms(data || []);
    } catch (error) {
      console.error('Error fetching training programs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch training programs",
        variant: "destructive"
      });
    }
  };

  const addSkill = async (skillData: Omit<OrganizationalSkill, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('organizational_skills')
        .insert([skillData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Skill added successfully",
      });
      
      await fetchOrganizationalSkills();
      return { data, error: null };
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const addTrainingProgram = async (programData: Omit<TrainingProgram, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('training_programs')
        .insert([programData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Training program added successfully",
      });
      
      await fetchTrainingPrograms();
      return { data, error: null };
    } catch (error) {
      console.error('Error adding training program:', error);
      toast({
        title: "Error",
        description: "Failed to add training program",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const getSkillStats = () => {
    const totalSkills = organizationalSkills.length;
    const criticalGaps = skillAssessments.filter(assessment => 
      (assessment.target_level - assessment.current_level) >= 30
    ).length;
    const inTraining = trainingPrograms.filter(program => program.status === 'active')
      .reduce((sum, program) => sum + program.current_participants, 0);
    const avgProgress = skillAssessments.length > 0 
      ? Math.round(skillAssessments.reduce((sum, assessment) => 
          sum + (assessment.current_level / assessment.target_level * 100), 0
        ) / skillAssessments.length)
      : 0;

    return {
      totalSkills,
      criticalGaps,
      inTraining,
      avgProgress
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSkillCategories(),
        fetchOrganizationalSkills(),
        fetchSkillAssessments(),
        fetchTrainingPrograms()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    skillCategories,
    organizationalSkills,
    skillAssessments,
    trainingPrograms,
    loading,
    addSkill,
    addTrainingProgram,
    getSkillStats,
    refetch: async () => {
      await Promise.all([
        fetchSkillCategories(),
        fetchOrganizationalSkills(),
        fetchSkillAssessments(),
        fetchTrainingPrograms()
      ]);
    }
  };
};
