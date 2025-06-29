
import { Card, CardContent } from '@/components/ui/card';
import { Users, AlertTriangle, Target, TrendingUp } from 'lucide-react';

interface SuccessionOverviewCardsProps {
  stats: {
    totalPositions: number;
    highRisk: number;
    readySuccessors: number;
    inDevelopment: number;
  };
}

const SuccessionOverviewCards = ({ stats }: SuccessionOverviewCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Key Positions</p>
              <p className="text-2xl font-bold">{stats.totalPositions}</p>
              <p className="text-sm text-gray-500">tracked roles</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
              <p className="text-sm text-gray-500">positions at risk</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ready Successors</p>
              <p className="text-2xl font-bold text-green-600">{stats.readySuccessors}</p>
              <p className="text-sm text-gray-500">ready now</p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Development</p>
              <p className="text-2xl font-bold text-orange-600">{stats.inDevelopment}</p>
              <p className="text-sm text-gray-500">being developed</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessionOverviewCards;
