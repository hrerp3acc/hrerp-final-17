
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Calendar } from 'lucide-react';
import JobPostingDialog from './JobPostingDialog';
import { formatDistanceToNow } from 'date-fns';

interface JobPostingsTabProps {
  jobs: any[];
  setSelectedJob: (job: any) => void;
}

const JobPostingsTab = ({ jobs, setSelectedJob }: JobPostingsTabProps) => {
  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return 'Salary not specified';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Job Postings</span>
          <JobPostingDialog />
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
            <JobPostingDialog />
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      {job.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Posted {formatDistanceToNow(new Date(job.created_at))} ago</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                </div>
                <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                  {job.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Applications: {job.applications_count || 0}
                  </div>
                  <Button variant="outline" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJob(job);
                  }}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobPostingsTab;
