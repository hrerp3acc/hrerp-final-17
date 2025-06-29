
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  KeyPosition, 
  SuccessionCandidate, 
  DevelopmentPlan 
} from '@/types/successionPlanning';
import {
  fetchKeyPositions,
  fetchSuccessionCandidates,
  fetchDevelopmentPlans,
  createKeyPosition
} from '@/services/successionPlanningService';
import { calculateSuccessionStats } from '@/utils/successionStatsUtils';

export const useSuccessionPlanning = () => {
  const [keyPositions, setKeyPositions] = useState<KeyPosition[]>([]);
  const [successors, setSuccessors] = useState<SuccessionCandidate[]>([]);
  const [developmentPlans, setDevelopmentPlans] = useState<DevelopmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadKeyPositions = async () => {
    try {
      const data = await fetchKeyPositions();
      setKeyPositions(data);
    } catch (error) {
      console.error('Error fetching key positions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch key positions",
        variant: "destructive"
      });
    }
  };

  const loadSuccessors = async () => {
    try {
      const data = await fetchSuccessionCandidates();
      setSuccessors(data);
    } catch (error) {
      console.error('Error fetching successors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch successors",
        variant: "destructive"
      });
    }
  };

  const loadDevelopmentPlans = async () => {
    try {
      const data = await fetchDevelopmentPlans();
      setDevelopmentPlans(data);
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
      const result = await createKeyPosition(positionData);
      
      toast({
        title: "Success",
        description: "Key position added successfully",
      });
      
      await loadKeyPositions();
      return result;
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
    return calculateSuccessionStats(keyPositions, successors);
  };

  const refetch = async () => {
    await Promise.all([
      loadKeyPositions(),
      loadSuccessors(),
      loadDevelopmentPlans()
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
    keyPositions,
    successors,
    developmentPlans,
    loading,
    addKeyPosition,
    getSuccessionStats,
    refetch
  };
};
