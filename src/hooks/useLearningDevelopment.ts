
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type Course = Tables<'courses'>;
type CourseEnrollment = Tables<'course_enrollments'>;
type Certification = Tables<'certifications'>;

// Extended enrollment type with course details
type EnrollmentWithCourse = CourseEnrollment & {
  courses: Course;
};

export const useLearningDevelopment = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
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

  const fetchEnrollments = async () => {
    if (!user) return;

    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!employee) return;

      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (*)
        `)
        .eq('employee_id', employee.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data as EnrollmentWithCourse[] || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const fetchCertifications = async () => {
    if (!user) return;

    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!employee) return;

      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
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
        .from('course_enrollments')
        .insert([{
          employee_id: employee.id,
          course_id: courseId,
          status: 'enrolled'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully enrolled in course",
      });

      await fetchEnrollments();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive"
      });
    }
  };

  const updateProgress = async (enrollmentId: string, progress: number) => {
    try {
      const status = progress >= 100 ? 'completed' : 'enrolled';
      const completedAt = progress >= 100 ? new Date().toISOString() : null;

      const { error } = await supabase
        .from('course_enrollments')
        .update({
          progress,
          status,
          completed_at: completedAt
        })
        .eq('id', enrollmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Progress updated successfully",
      });

      await fetchEnrollments();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
    }
  };

  const getLearningStats = () => {
    const totalCourses = courses.length;
    const enrolledCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.status === 'completed').length;
    const inProgressCourses = enrollments.filter(e => e.status === 'enrolled').length;
    const activeCertifications = certifications.filter(c => c.status === 'active').length;
    const totalHours = courses.reduce((acc, course) => acc + (course.duration_hours || 0), 0);

    return {
      totalCourses,
      enrolledCourses,
      completedCourses,
      inProgressCourses,
      activeCertifications,
      totalHours
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCourses(), fetchEnrollments(), fetchCertifications()]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    courses,
    enrollments,
    certifications,
    loading,
    enrollInCourse,
    updateProgress,
    getLearningStats,
    refetch: () => Promise.all([fetchCourses(), fetchEnrollments(), fetchCertifications()])
  };
};
