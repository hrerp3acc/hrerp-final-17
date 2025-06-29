
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CapacityPlanning {
  id: string;
  department_id?: string;
  current_headcount: number;
  planned_headcount: number;
  capacity_headcount: number;
  gap: number;
  priority: string;
  open_positions: number;
  planning_period_start?: string;
  planning_period_end?: string;
  created_at: string;
  updated_at: string;
  department?: any;
}

export const useWorkforcePlanning = () => {
  const [capacityData, setCapacityData] = useState<CapacityPlanning[]>([]);
  const [workforcePlans, setWorkforcePlans] = useState<any[]>([]);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCapacityData = async () => {
    try {
      const { data, error } = await supabase
        .from('capacity_planning')
        .select(`
          *,
          department:departments(*)
        `)
        .order('priority');

      if (error) throw error;
      setCapacityData(data || []);
    } catch (error) {
      console.error('Error fetching capacity data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch capacity data",
        variant: "destructive"
      });
    }
  };

  const fetchWorkforcePlans = async () => {
    try {
      const { data, error } = await supabase
        .from('workforce_plans')
        .select(`
          *,
          department:departments(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkforcePlans(data || []);
    } catch (error) {
      console.error('Error fetching workforce plans:', error);
      toast({
        title: "Error",
        description: "Failed to fetch workforce plans",
        variant: "destructive"
      });
    }
  };

  const fetchSkillGaps = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_assessments')
        .select(`
          *,
          skill:organizational_skills(*),
          employee:employees(*)
        `)
        .order('current_level');

      if (error) throw error;
      
      // Process skill gaps
      const gaps = data?.map(assessment => ({
        skill: assessment.skill?.name || '',
        currentLevel: assessment.current_level,
        requiredLevel: assessment.target_level,
        gap: assessment.current_level - assessment.target_level,
        department: assessment.employee?.department || 'Unknown'
      })).filter(gap => gap.gap < 0) || [];
      
      setSkillGaps(gaps);
    } catch (error) {
      console.error('Error fetching skill gaps:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skill gaps",
        variant: "destructive"
      });
    }
  };

  const addCapacityPlan = async (planData: Omit<CapacityPlanning, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('capacity_planning')
        .insert([planData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Capacity plan added successfully",
      });
      
      await fetchCapacityData();
      return { data, error: null };
    } catch (error) {
      console.error('Error adding capacity plan:', error);
      toast({
        title: "Error",
        description: "Failed to add capacity plan",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const getWorkforceStats = () => {
    const totalCapacityGap = capacityData.reduce((sum, item) => sum + Math.abs(item.gap), 0);
    const openPositions = capacityData.reduce((sum, item) => sum + item.open_positions, 0);
    const criticalSkillGaps = skillGaps.filter(gap => Math.abs(gap.gap) >= 20).length;
    const highRiskRoles = capacityData.filter(item => item.priority === 'high').length;

    return {
      totalCapacityGap,
      openPositions,
      criticalSkillGaps,
      highRiskRoles
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCapacityData(),
        fetchWorkforcePlans(),
        fetchSkillGaps()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    capacityData,
    workforcePlans,
    skillGaps,
    loading,
    addCapacityPlan,
    getWorkforceStats,
    refetch: async () => {
      await Promise.all([
        fetchCapacityData(),
        fetchWorkforcePlans(),
        fetchSkillGaps()
      ]);
    }
  };
};
