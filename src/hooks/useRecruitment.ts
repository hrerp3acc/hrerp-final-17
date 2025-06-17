
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useRecruitment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current employee
  const { data: employee } = useQuery({
    queryKey: ['current-employee', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('employees')
        .select('id, first_name, last_name')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch job postings
  const { data: jobPostings = [], isLoading: postingsLoading, refetch: refetchPostings } = useQuery({
    queryKey: ['job-postings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select(`
          *,
          departments(name),
          posted_by_employee:employees!job_postings_posted_by_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch job applications
  const { data: jobApplications = [], isLoading: applicationsLoading, refetch: refetchApplications } = useQuery({
    queryKey: ['job-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_postings(title, departments(name))
        `)
        .order('applied_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch departments for job posting creation
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Create job posting mutation
  const createJobPostingMutation = useMutation({
    mutationFn: async (jobData: {
      title: string;
      department_id?: string;
      description?: string;
      requirements?: string;
      location?: string;
      salary_min?: number;
      salary_max?: number;
    }) => {
      if (!employee?.id) throw new Error('Employee not found');
      
      const { data, error } = await supabase
        .from('job_postings')
        .insert({
          posted_by: employee.id,
          ...jobData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      toast({
        title: "Success",
        description: "Job posting created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update job posting status mutation
  const updateJobPostingStatusMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status 
    }: { 
      id: string; 
      status: string; 
    }) => {
      const { data, error } = await supabase
        .from('job_postings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      toast({
        title: "Success",
        description: "Job posting status updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update application status mutation
  const updateApplicationStatusMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status 
    }: { 
      id: string; 
      status: string; 
    }) => {
      const { data, error } = await supabase
        .from('job_applications')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast({
        title: "Success",
        description: "Application status updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getRecruitmentStats = () => {
    const activePostings = jobPostings.filter(posting => posting.status === 'open').length;
    const totalApplications = jobApplications.length;
    const pendingApplications = jobApplications.filter(app => app.status === 'applied').length;
    const hiredCandidates = jobApplications.filter(app => app.status === 'hired').length;

    return {
      activePostings,
      totalApplications,
      pendingApplications,
      hiredCandidates,
    };
  };

  return {
    employee,
    jobPostings,
    jobApplications,
    departments,
    postingsLoading,
    applicationsLoading,
    createJobPosting: createJobPostingMutation.mutate,
    updateJobPostingStatus: updateJobPostingStatusMutation.mutate,
    updateApplicationStatus: updateApplicationStatusMutation.mutate,
    getRecruitmentStats,
    refetchPostings,
    refetchApplications,
  };
};
