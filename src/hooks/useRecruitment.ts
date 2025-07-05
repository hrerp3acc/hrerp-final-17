
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type JobPosting = Tables<'job_postings'>;
type JobApplication = Tables<'job_applications'>;

export const useRecruitment = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchJobPostings = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
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

  const fetchJobApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setJobApplications(data || []);
    } catch (error) {
      console.error('Error fetching job applications:', error);
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
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('job_postings')
        .insert([{
          ...jobData,
          posted_by: user.id,
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

  const updateJobPosting = async (postingId: string, updates: Partial<JobPosting>) => {
    try {
      const { error } = await supabase
        .from('job_postings')
        .update(updates)
        .eq('id', postingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job posting updated successfully",
      });

      await fetchJobPostings();
    } catch (error) {
      console.error('Error updating job posting:', error);
      toast({
        title: "Error",
        description: "Failed to update job posting",
        variant: "destructive"
      });
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
        description: "Application status updated successfully",
      });

      await fetchJobApplications();
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
    const totalPostings = jobPostings.length;
    const openPositions = jobPostings.filter(p => p.status === 'open').length;
    const totalApplications = jobApplications.length;
    const pendingApplications = jobApplications.filter(a => a.status === 'applied').length;
    const interviewScheduled = jobApplications.filter(a => a.status === 'interview').length;

    return {
      totalPostings,
      openPositions,
      totalApplications,
      pendingApplications,
      interviewScheduled
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchJobPostings(), fetchJobApplications()]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    jobPostings,
    jobApplications,
    loading,
    createJobPosting,
    updateJobPosting,
    updateApplicationStatus,
    getRecruitmentStats,
    refetch: () => Promise.all([fetchJobPostings(), fetchJobApplications()])
  };
};
