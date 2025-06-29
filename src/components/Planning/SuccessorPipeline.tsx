
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { SuccessionCandidate } from '@/types/successionPlanning';

interface SuccessorPipelineProps {
  successors: SuccessionCandidate[];
}

const SuccessorPipeline = ({ successors }: SuccessorPipelineProps) => {
  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'Ready Now': return 'bg-green-100 text-green-800';
      case '1-2 Years': return 'bg-yellow-100 text-yellow-800';
      case '2+ Years': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Successor Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {successors.map((successor) => (
            <div key={successor.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-semibold">
                      {successor.employee ? 
                        `${successor.employee.first_name} ${successor.employee.last_name}` : 
                        'Unknown Employee'
                      }
                    </h4>
                    <p className="text-sm text-gray-600">
                      {successor.employee?.position || 'Position not set'}
                    </p>
                  </div>
                </div>
                <Badge className={getReadinessColor(successor.readiness_level)}>
                  {successor.readiness_level}
                </Badge>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Target Role</div>
                  <div className="font-medium">{successor.key_position?.title || 'Not set'}</div>
                </div>
                <div>
                  <div className="text-gray-600">Development Progress</div>
                  <div className="font-medium">{successor.development_progress}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${successor.development_progress}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Readiness</div>
                  <div className="font-medium">{successor.readiness_level}</div>
                </div>
                <div>
                  <div className="text-gray-600">Last Assessment</div>
                  <div className="font-medium">
                    {successor.last_assessment_date || 'Not assessed'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessorPipeline;
