
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  SkillCategory, 
  OrganizationalSkill, 
  SkillAssessment, 
  TrainingProgram 
} from '@/types/skillsManagement';
import {
  fetchSkillCategories,
  fetchOrganizationalSkills,
  fetchSkillAssessments,
  fetchTrainingPrograms,
  createSkill,
  createTrainingProgram
} from '@/services/skillsManagementService';
import { calculateSkillStats } from '@/utils/skillsStatsUtils';

export const useSkillsManagement = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [organizationalSkills, setOrganizationalSkills] = useState<OrganizationalSkill[]>([]);
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([]);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSkillCategories = async () => {
    try {
      const data = await fetchSkillCategories();
      setSkillCategories(data);
    } catch (error) {
      console.error('Error fetching skill categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skill categories",
        variant: "destructive"
      });
    }
  };

  const loadOrganizationalSkills = async () => {
    try {
      const data = await fetchOrganizationalSkills();
      setOrganizationalSkills(data);
    } catch (error) {
      console.error('Error fetching organizational skills:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organizational skills",
        variant: "destructive"
      });
    }
  };

  const loadSkillAssessments = async () => {
    try {
      const data = await fetchSkillAssessments();
      setSkillAssessments(data);
    } catch (error) {
      console.error('Error fetching skill assessments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skill assessments",
        variant: "destructive"
      });
    }
  };

  const loadTrainingPrograms = async () => {
    try {
      const data = await fetchTrainingPrograms();
      setTrainingPrograms(data);
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
      const result = await createSkill(skillData);
      
      toast({
        title: "Success",
        description: "Skill added successfully",
      });
      
      await loadOrganizationalSkills();
      return result;
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
      const result = await createTrainingProgram(programData);
      
      toast({
        title: "Success",
        description: "Training program added successfully",
      });
      
      await loadTrainingPrograms();
      return result;
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
    return calculateSkillStats(organizationalSkills, skillAssessments, trainingPrograms);
  };

  const refetch = async () => {
    await Promise.all([
      loadSkillCategories(),
      loadOrganizationalSkills(),
      loadSkillAssessments(),
      loadTrainingPrograms()
    ]);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await refetch();
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
    refetch
  };
};
