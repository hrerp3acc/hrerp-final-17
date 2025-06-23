
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailsPanel from '@/components/Common/DetailsPanel';
import RecruitmentStats from '@/components/Recruitment/RecruitmentStats';
import JobPostingsTab from '@/components/Recruitment/JobPostingsTab';
import CandidatesTab from '@/components/Recruitment/CandidatesTab';
import InterviewsTab from '@/components/Recruitment/InterviewsTab';
import AnalyticsTab from '@/components/Recruitment/AnalyticsTab';
import { useRecruitment } from '@/hooks/useRecruitment';
import type { Tables } from '@/integrations/supabase/types';

type JobPosting = Tables<'job_postings'>;
type JobApplication = Tables<'job_applications'>;

const RecruitmentManagement = () => {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<JobApplication | null>(null);
  
  const { jobPostings, jobApplications, loading, getRecruitmentStats } = useRecruitment();
  
  const stats = getRecruitmentStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <RecruitmentStats stats={stats} />

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList>
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <JobPostingsTab jobs={jobPostings} setSelectedJob={setSelectedJob} />
          </TabsContent>

          <TabsContent value="candidates">
            <CandidatesTab candidates={jobApplications} setSelectedCandidate={setSelectedCandidate} />
          </TabsContent>

          <TabsContent value="interviews">
            <InterviewsTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab recruitmentData={jobApplications} />
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <DetailsPanel
          title={selectedJob ? "Job Details" : selectedCandidate ? "Candidate Details" : "Recruitment Details"}
          isEmpty={!selectedJob && !selectedCandidate}
          emptyMessage="Select a job posting or candidate to view detailed information"
        >
          {selectedJob && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedJob.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedJob.location || 'Remote'}</p>
                {selectedJob.salary_min && selectedJob.salary_max && (
                  <p className="text-sm text-gray-600 mb-4">
                    Salary: ${selectedJob.salary_min.toLocaleString()} - ${selectedJob.salary_max.toLocaleString()}
                  </p>
                )}
              </div>
              
              {selectedJob.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
                </div>
              )}
              
              {selectedJob.requirements && (
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedJob.requirements}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  selectedJob.status === 'open' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedJob.status === 'open' ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
          )}
          
          {selectedCandidate && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedCandidate.candidate_name}</h3>
                <p className="text-sm text-gray-600">{selectedCandidate.candidate_email}</p>
                {selectedCandidate.candidate_phone && (
                  <p className="text-sm text-gray-600">{selectedCandidate.candidate_phone}</p>
                )}
              </div>
              
              {selectedCandidate.cover_letter && (
                <div>
                  <h4 className="font-medium mb-2">Cover Letter</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedCandidate.cover_letter}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2">Application Status</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  selectedCandidate.status === 'applied' 
                    ? 'bg-blue-100 text-blue-800'
                    : selectedCandidate.status === 'interview'
                    ? 'bg-yellow-100 text-yellow-800'
                    : selectedCandidate.status === 'hired'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedCandidate.status}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Applied Date</h4>
                <p className="text-sm text-gray-700">
                  {new Date(selectedCandidate.applied_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DetailsPanel>
      </div>
    </div>
  );
};

export default RecruitmentManagement;
