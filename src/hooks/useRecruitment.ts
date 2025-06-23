
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import type { Tables } from '@/integrations/supabase/types';

type JobPosting = Tables<'job_postings'>;
type JobApplication = Tables<'job_applications'>;

export const useRecruitment = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { employees } = useSupabaseEmployees();

  const currentEmployee = user ? employees.find(emp => emp.user_id === user.id) : null;

  const fetchJobPostings = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select(`
          *,
          departments (
            name
          ),
          posted_by_employee:employees!job_postings_posted_by_fkey (
            first_name,
            last_name
          )
        `)
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
      setJobApplications(data || []);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch job applications",
        variant: "destructive"
      });
    }
  };

  const createJobPosting = async (jobData: {
    title: string;
    description?: string;
    requirements?: string;
    department_id?: string;
    salary_min?: number;
    salary_max?: number;
    location?: string;
  }) => {
    if (!currentEmployee) {
      toast({
        title: "Error",
        description: "Employee not found",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('job_postings')
        .insert([{
          posted_by: currentEmployee.id,
          ...jobData
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchJobPostings();
      
      toast({
        title: "Job Posted",
        description: "Job posting has been created successfully"
      });
      
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

  const updateJobPosting = async (id: string, updates: Partial<JobPosting>) => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchJobPostings();
      
      toast({
        title: "Job Updated",
        description: "Job posting has been updated successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating job posting:', error);
      toast({
        title: "Error",
        description: "Failed to update job posting",
        variant: "destructive"
      });
      return null;
    }
  };

  const createJobApplication = async (applicationData: {
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
      
      await fetchJobApplications();
      
      toast({
        title: "Application Submitted",
        description: "Job application has been submitted successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating job application:', error);
      toast({
        title: "Error",
        description: "Failed to submit job application",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateJobApplication = async (id: string, updates: Partial<JobApplication>) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchJobApplications();
      
      toast({
        title: "Application Updated",
        description: "Job application has been updated successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating job application:', error);
      toast({
        title: "Error",
        description: "Failed to update job application",
        variant: "destructive"
      });
      return null;
    }
  };

  const getRecruitmentStats = () => {
    const totalJobs = jobPostings.length;
    const activeJobs = jobPostings.filter(job => job.status === 'open').length;
    const closedJobs = jobPostings.filter(job => job.status === 'closed').length;
    
    const totalApplications = jobApplications.length;
    const pendingApplications = jobApplications.filter(app => app.status === 'applied').length;
    const interviewApplications = jobApplications.filter(app => app.status === 'interview').length;
    const hiredApplications = jobApplications.filter(app => app.status === 'hired').length;
    const rejectedApplications = jobApplications.filter(app => app.status === 'rejected').length;

    // Calculate applications per job
    const avgApplicationsPerJob = totalJobs > 0 ? Math.round(totalApplications / totalJobs) : 0;
    
    // Calculate hire rate
    const hireRate = totalApplications > 0 ? Math.round((hiredApplications / totalApplications) * 100) : 0;

    return {
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications,
      pendingApplications,
      interviewApplications,
      hiredApplications,
      rejectedApplications,
      avgApplicationsPerJob,
      hireRate
    };
  };

  useEffect(() => {
    if (currentEmployee) {
      Promise.all([fetchJobPostings(), fetchJobApplications()]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currentEmployee]);

  return {
    jobPostings,
    jobApplications,
    loading,
    createJobPosting,
    updateJobPosting,
    createJobApplication,
    updateJobApplication,
    getRecruitmentStats,
    refetch: () => Promise.all([fetchJobPostings(), fetchJobApplications()])
  };
};
