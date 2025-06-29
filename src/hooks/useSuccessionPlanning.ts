
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface KeyPosition {
  id: string;
  title: string;
  department_id?: string;
  current_holder_id?: string;
  risk_level: string;
  criticality: string;
  retirement_date?: string;
  created_at: string;
  updated_at: string;
  department?: any;
  current_holder?: any;
}

export interface SuccessionCandidate {
  id: string;
  employee_id: string;
  key_position_id: string;
  readiness_level: string;
  development_progress: number;
  last_assessment_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  employee?: any;
  key_position?: KeyPosition;
}

export interface DevelopmentPlan {
  id: string;
  candidate_id: string;
  target_position: string;
  activities: string[];
  progress: number;
  timeline?: string;
  next_review_date?: string;
  created_at: string;
  updated_at: string;
  candidate?: SuccessionCandidate;
}

export const useSuccessionPlanning = () => {
  const [keyPositions, setKeyPositions] = useState<KeyPosition[]>([]);
  const [successors, setSuccessors] = useState<SuccessionCandidate[]>([]);
  const [developmentPlans, setDevelopmentPlans] = useState<DevelopmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchKeyPositions = async () => {
    try {
      const { data, error } = await supabase
        .from('key_positions')
        .select(`
          *,
          department:departments(*),
          current_holder:employees(*)
        `)
        .order('criticality');

      if (error) throw error;
      setKeyPositions(data || []);
    } catch (error) {
      console.error('Error fetching key positions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch key positions",
        variant: "destructive"
      });
    }
  };

  const fetchSuccessors = async () => {
    try {
      const { data, error } = await supabase
        .from('succession_candidates')
        .select(`
          *,
          employee:employees(*),
          key_position:key_positions(*)
        `)
        .order('development_progress', { ascending: false });

      if (error) throw error;
      setSuccessors(data || []);
    } catch (error) {
      console.error('Error fetching successors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch successors",
        variant: "destructive"
      });
    }
  };

  const fetchDevelopmentPlans = async () => {
    try {
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
      setDevelopmentPlans(data || []);
    } catch (error) {
      console.error('Error fetching development plans:', error);
      toast({
        title: "Error",
        description: "Failed to fetch development plans",
        variant: "destructive"
      });
    }
  };

  const addKeyPosition = async (positionData: Omit<KeyPosition, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('key_positions')
        .insert([positionData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Key position added successfully",
      });
      
      await fetchKeyPositions();
      return { data, error: null };
    } catch (error) {
      console.error('Error adding key position:', error);
      toast({
        title: "Error",
        description: "Failed to add key position",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const getSuccessionStats = () => {
    const totalPositions = keyPositions.length;
    const highRisk = keyPositions.filter(pos => pos.risk_level === 'high').length;
    const readySuccessors = successors.filter(successor => successor.readiness_level === 'Ready Now').length;
    const inDevelopment = successors.filter(successor => 
      successor.readiness_level === '1-2 Years' || successor.readiness_level === '2+ Years'
    ).length;

    return {
      totalPositions,
      highRisk,
      readySuccessors,
      inDevelopment
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchKeyPositions(),
        fetchSuccessors(),
        fetchDevelopmentPlans()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    keyPositions,
    successors,
    developmentPlans,
    loading,
    addKeyPosition,
    getSuccessionStats,
    refetch: async () => {
      await Promise.all([
        fetchKeyPositions(),
        fetchSuccessors(),
        fetchDevelopmentPlans()
      ]);
    }
  };
};
