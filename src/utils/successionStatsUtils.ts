
import { KeyPosition, SuccessionCandidate } from '@/types/successionPlanning';

export const calculateSuccessionStats = (
  keyPositions: KeyPosition[],
  successors: SuccessionCandidate[]
) => {
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
