import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailsPanel from '@/components/Common/DetailsPanel';
import RecruitmentStats from '@/components/Recruitment/RecruitmentStats';
import JobPostingsTab from '@/components/Recruitment/JobPostingsTab';
import CandidatesTab from '@/components/Recruitment/CandidatesTab';
import InterviewsTab from '@/components/Recruitment/InterviewsTab';
import AnalyticsTab from '@/components/Recruitment/AnalyticsTab';

const RecruitmentManagement = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Empty data arrays - will be populated when user adds data
  const jobs: any[] = [];
  const candidates: any[] = [];
  const recruitmentData: any[] = [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <RecruitmentStats />

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList>
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <JobPostingsTab jobs={jobs} setSelectedJob={setSelectedJob} />
          </TabsContent>

          <TabsContent value="candidates">
            <CandidatesTab candidates={candidates} setSelectedCandidate={setSelectedCandidate} />
          </TabsContent>

          <TabsContent value="interviews">
            <InterviewsTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab recruitmentData={recruitmentData} />
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
              {/* Job details content */}
            </div>
          )}
          
          {selectedCandidate && (
            <div className="space-y-4">
              {/* Candidate details content */}
            </div>
          )}
        </DetailsPanel>
      </div>
    </div>
  );
};

export default RecruitmentManagement;
