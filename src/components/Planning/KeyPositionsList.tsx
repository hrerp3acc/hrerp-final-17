
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { KeyPosition, SuccessionCandidate } from '@/types/successionPlanning';

interface KeyPositionsListProps {
  keyPositions: KeyPosition[];
  successors: SuccessionCandidate[];
}

const KeyPositionsList = ({ keyPositions, successors }: KeyPositionsListProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMonthsUntilRetirement = (retirementDate: string | null) => {
    if (!retirementDate) return 'N/A';
    const months = Math.floor((new Date(retirementDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months > 0 ? `${months} months` : 'Overdue';
  };

  return (
    <div className="space-y-4">
      {keyPositions.map((position) => {
        const readySuccessors = successors.filter(s => 
          s.key_position_id === position.id && s.readiness_level === 'Ready Now'
        ).length;
        const developingSuccessors = successors.filter(s => 
          s.key_position_id === position.id && s.readiness_level !== 'Ready Now'
        ).length;

        return (
          <Card key={position.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-lg">{position.title}</h3>
                  <Badge variant="outline">{position.department?.name || 'No Department'}</Badge>
                  <Badge className={getCriticalityColor(position.criticality)}>
                    {position.criticality}
                  </Badge>
                  <Badge className={getRiskColor(position.risk_level)}>
                    {position.risk_level} Risk
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Current Holder</div>
                  <div className="font-medium">
                    {position.current_holder ? 
                      `${position.current_holder.first_name} ${position.current_holder.last_name}` : 
                      'Vacant'
                    }
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Ready Successors</div>
                  <div className="font-medium text-green-600">{readySuccessors}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">In Development</div>
                  <div className="font-medium text-blue-600">{developingSuccessors}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Retirement Date</div>
                  <div className="font-medium">
                    {position.retirement_date || 'Not set'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {getMonthsUntilRetirement(position.retirement_date)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KeyPositionsList;
