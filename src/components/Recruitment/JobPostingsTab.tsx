
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus } from 'lucide-react';

interface JobPostingsTabProps {
  jobs: any[];
  setSelectedJob: (job: any) => void;
}

const JobPostingsTab = ({ jobs, setSelectedJob }: JobPostingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Job Postings</span>
          <Button>Post New Job</Button>
        </CardTitle>
        <CardDescription>Manage open positions and requirements</CardDescription>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first job posting to start recruiting candidates.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Post Your First Job
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedJob(job)}
              >
                {/* Job content */}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobPostingsTab;
