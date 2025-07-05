
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type Course = Tables<'courses'>;
type LearningProgress = Tables<'learning_progress'>;

export const useLearningDevelopment = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive"
      });
    }
  };

  const fetchLearningProgress = async () => {
    if (!user) return;

    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!employee) return;

      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLearningProgress(data || []);
    } catch (error) {
      console.error('Error fetching learning progress:', error);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to enroll in courses",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!employee) {
        toast({
          title: "Error",
          description: "Employee record not found",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('learning_progress')
        .insert([{
          employee_id: employee.id,
          course_id: courseId,
          status: 'in_progress',
          started_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully enrolled in course",
      });

      await fetchLearningProgress();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive"
      });
    }
  };

  const updateProgress = async (progressId: string, percentage: number) => {
    try {
      const status = percentage >= 100 ? 'completed' : 'in_progress';
      const completedAt = percentage >= 100 ? new Date().toISOString() : null;

      const { error } = await supabase
        .from('learning_progress')
        .update({
          progress_percentage: percentage,
          status,
          completed_at: completedAt
        })
        .eq('id', progressId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Progress updated successfully",
      });

      await fetchLearningProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCourses(), fetchLearningProgress()]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    courses,
    learningProgress,
    loading,
    enrollInCourse,
    updateProgress,
    refetch: () => Promise.all([fetchCourses(), fetchLearningProgress()])
  };
};
