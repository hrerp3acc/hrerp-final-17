
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Calendar, BarChart3 } from 'lucide-react';
import { useRecruitment } from '@/hooks/useRecruitment';
import JobPostingsTab from '@/components/Recruitment/JobPostingsTab';
import CandidatesTab from '@/components/Recruitment/CandidatesTab';
import InterviewsTab from '@/components/Recruitment/InterviewsTab';
import AnalyticsTab from '@/components/Recruitment/AnalyticsTab';
import RecruitmentStats from '@/components/Recruitment/RecruitmentStats';

const RecruitmentManagement = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { 
    jobPostings, 
    jobApplications,
    loading, 
    getRecruitmentStats 
  } = useRecruitment();

  // Create mock candidates and interviews from job applications
  const candidates = jobApplications || [];
  const interviews = []; // Mock interviews array for now

  const stats = getRecruitmentStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recruitment & Talent Management</h1>
        <p className="text-gray-600">Manage job postings, candidates, and hiring process</p>
      </div>

      {/* Stats Overview */}
      <RecruitmentStats stats={stats} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs" className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4" />
            <span>Job Postings</span>
          </TabsTrigger>
          <TabsTrigger value="candidates" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Candidates</span>
          </TabsTrigger>
          <TabsTrigger value="interviews" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Interviews</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <JobPostingsTab 
            jobs={jobPostings} 
            setSelectedJob={setSelectedJob}
          />
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <CandidatesTab 
            candidates={candidates} 
            setSelectedCandidate={setSelectedCandidate}
          />
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <InterviewsTab />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab recruitmentData={jobApplications} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruitmentManagement;
