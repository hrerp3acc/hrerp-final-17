
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSuccessionPlanning } from '@/hooks/useSuccessionPlanning';
import PageHeader from '@/components/Common/PageHeader';
import SuccessionOverviewCards from '@/components/Planning/SuccessionOverviewCards';
import SuccessionFilters from '@/components/Planning/SuccessionFilters';
import KeyPositionsList from '@/components/Planning/KeyPositionsList';
import SuccessorPipeline from '@/components/Planning/SuccessorPipeline';
import DevelopmentPlans from '@/components/Planning/DevelopmentPlans';

const SuccessionPlanning = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    keyPositions,
    successors,
    developmentPlans,
    loading,
    getSuccessionStats
  } = useSuccessionPlanning();

  const stats = getSuccessionStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Succession Planning"
        description="Plan for leadership continuity and talent development"
        primaryAction={{
          label: "Add Position",
          onClick: () => {},
          icon: Plus
        }}
      />

      <SuccessionOverviewCards stats={stats} />

      <Tabs defaultValue="positions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="positions">Key Positions</TabsTrigger>
          <TabsTrigger value="successors">Successor Pipeline</TabsTrigger>
          <TabsTrigger value="development">Development Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-6">
          <SuccessionFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
          />
          <KeyPositionsList keyPositions={keyPositions} successors={successors} />
        </TabsContent>

        <TabsContent value="successors" className="space-y-6">
          <SuccessorPipeline successors={successors} />
        </TabsContent>

        <TabsContent value="development" className="space-y-6">
          <DevelopmentPlans developmentPlans={developmentPlans} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuccessionPlanning;
