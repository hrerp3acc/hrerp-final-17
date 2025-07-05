
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type JobPosting = Tables<'job_postings'>;
type JobApplication = Tables<'job_applications'>;

export const useRecruitment = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobPostings = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select(`
          *,
          departments (
            name
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobPostings(data || []);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch job postings",
        variant: "destructive"
      });
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_postings (
            title,
            departments (
              name
            )
          )
        `)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const createJobPosting = async (jobData: {
    title: string;
    description?: string;
    requirements?: string;
    location?: string;
    salary_min?: number;
    salary_max?: number;
    department_id?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .insert([{
          ...jobData,
          status: 'open'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job posting created successfully",
      });

      await fetchJobPostings();
      return data;
    } catch (error) {
      console.error('Error creating job posting:', error);
      toast({
        title: "Error",
        description: "Failed to create job posting",
        variant: "destructive"
      });
      return null;
    }
  };

  const applyForJob = async (applicationData: {
    job_posting_id: string;
    candidate_name: string;
    candidate_email: string;
    candidate_phone?: string;
    resume_url?: string;
    cover_letter?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application submitted successfully",
      });

      await fetchApplications();
      return data;
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application status updated",
      });

      await fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const getRecruitmentStats = () => {
    const totalJobs = jobPostings.length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === 'applied').length;
    const acceptedApplications = applications.filter(app => app.status === 'hired').length;

    return {
      totalJobs,
      totalApplications,
      pendingApplications,
      acceptedApplications
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchJobPostings(), fetchApplications()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    jobPostings,
    applications,
    loading,
    createJobPosting,
    applyForJob,
    updateApplicationStatus,
    getRecruitmentStats,
    refetch: () => Promise.all([fetchJobPostings(), fetchApplications()])
  };
};
