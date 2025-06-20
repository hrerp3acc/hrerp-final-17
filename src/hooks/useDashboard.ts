
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaves: number;
  openPositions: number;
  recentHires: number;
  avgAttendance: number;
  totalProjects: number;
  activeProjects: number;
  upcomingReviews: number;
  completedTrainings: number;
}

interface RecentActivity {
  id: string;
  type: 'leave' | 'hire' | 'training' | 'performance' | 'time';
  description: string;
  timestamp: string;
  employee_name?: string;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardStats = async () => {
    try {
      const [
        employeesResult,
        leavesResult,
        jobsResult,
        attendanceResult,
        projectsResult,
        reviewsResult,
        trainingsResult
      ] = await Promise.all([
        supabase.from('employees').select('id, status, start_date'),
        supabase.from('leave_applications').select('id, status').eq('status', 'pending'),
        supabase.from('job_postings').select('id, status').eq('status', 'open'),
        supabase.from('attendance_records').select('date, total_hours').gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        supabase.from('projects').select('id, status'),
        supabase.from('performance_reviews').select('id, status').eq('status', 'draft'),
        supabase.from('course_enrollments').select('id, status').eq('status', 'completed')
      ]);

      const employees = employeesResult.data || [];
      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(e => e.status === 'active').length;
      
      // Recent hires (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentHires = employees.filter(e => 
        e.start_date && new Date(e.start_date) >= thirtyDaysAgo
      ).length;

      // Calculate average attendance
      const attendanceData = attendanceResult.data || [];
      const avgAttendance = attendanceData.length > 0 
        ? attendanceData.reduce((sum, record) => sum + (record.total_hours || 0), 0) / attendanceData.length
        : 0;

      const projects = projectsResult.data || [];
      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.status === 'active').length;

      setStats({
        totalEmployees,
        activeEmployees,
        pendingLeaves: leavesResult.data?.length || 0,
        openPositions: jobsResult.data?.length || 0,
        recentHires,
        avgAttendance: Math.round(avgAttendance * 10) / 10,
        totalProjects,
        activeProjects,
        upcomingReviews: reviewsResult.data?.length || 0,
        completedTrainings: trainingsResult.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive"
      });
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const activities: RecentActivity[] = [];

      // Recent leave applications
      const { data: leaves } = await supabase
        .from('leave_applications')
        .select(`
          id, created_at, leave_type, status,
          employees!inner(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      leaves?.forEach(leave => {
        activities.push({
          id: leave.id,
          type: 'leave',
          description: `${leave.employees.first_name} ${leave.employees.last_name} applied for ${leave.leave_type} leave`,
          timestamp: leave.created_at,
          employee_name: `${leave.employees.first_name} ${leave.employees.last_name}`
        });
      });

      // Recent enrollments
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select(`
          id, enrolled_at,
          employees!inner(first_name, last_name),
          courses!inner(title)
        `)
        .order('enrolled_at', { ascending: false })
        .limit(5);

      enrollments?.forEach(enrollment => {
        activities.push({
          id: enrollment.id,
          type: 'training',
          description: `${enrollment.employees.first_name} ${enrollment.employees.last_name} enrolled in ${enrollment.courses.title}`,
          timestamp: enrollment.enrolled_at,
          employee_name: `${enrollment.employees.first_name} ${enrollment.employees.last_name}`
        });
      });

      // Sort all activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setRecentActivities(activities.slice(0, 10));
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([fetchDashboardStats(), fetchRecentActivities()]);
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  return {
    stats,
    recentActivities,
    loading,
    refreshDashboard: () => {
      fetchDashboardStats();
      fetchRecentActivities();
    }
  };
};
