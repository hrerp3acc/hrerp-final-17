
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
  activeGoals: number;
  completedGoals: number;
  pendingTimesheets: number;
  activeEnrollments: number;
}

interface RecentActivity {
  id: string;
  type: 'leave' | 'hire' | 'training' | 'performance' | 'time' | 'goal' | 'enrollment';
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
        trainingsResult,
        goalsResult,
        timesheetsResult,
        enrollmentsResult
      ] = await Promise.all([
        supabase.from('employees').select('id, status, start_date'),
        supabase.from('leave_applications').select('id, status').eq('status', 'pending'),
        supabase.from('job_postings').select('id, status').eq('status', 'open'),
        supabase.from('attendance_records').select('date, total_hours').gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        supabase.from('projects').select('id, status'),
        supabase.from('performance_reviews').select('id, status').eq('status', 'draft'),
        supabase.from('course_enrollments').select('id, status').eq('status', 'completed'),
        supabase.from('performance_goals').select('id, status'),
        supabase.from('timesheets').select('id, status').eq('status', 'draft'),
        supabase.from('course_enrollments').select('id, status').eq('status', 'enrolled')
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

      // Performance goals metrics
      const goals = goalsResult.data || [];
      const activeGoals = goals.filter(g => g.status !== 'completed').length;
      const completedGoals = goals.filter(g => g.status === 'completed').length;

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
        completedTrainings: trainingsResult.data?.length || 0,
        activeGoals,
        completedGoals,
        pendingTimesheets: timesheetsResult.data?.length || 0,
        activeEnrollments: enrollmentsResult.data?.length || 0
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
        .select('id, created_at, leave_type, status, employee_id')
        .order('created_at', { ascending: false })
        .limit(5);

      if (leaves) {
        const employeeIds = leaves.map(leave => leave.employee_id);
        const { data: employees } = await supabase
          .from('employees')
          .select('id, first_name, last_name')
          .in('id', employeeIds);

        const employeeMap = new Map(employees?.map(emp => [emp.id, emp]) || []);

        leaves.forEach(leave => {
          const employee = employeeMap.get(leave.employee_id);
          if (employee) {
            activities.push({
              id: leave.id,
              type: 'leave',
              description: `${employee.first_name} ${employee.last_name} applied for ${leave.leave_type} leave`,
              timestamp: leave.created_at,
              employee_name: `${employee.first_name} ${employee.last_name}`
            });
          }
        });
      }

      // Recent course enrollments
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('id, enrolled_at, employee_id, course_id')
        .order('enrolled_at', { ascending: false })
        .limit(5);

      if (enrollments) {
        const employeeIds = enrollments.map(enrollment => enrollment.employee_id);
        const courseIds = enrollments.map(enrollment => enrollment.course_id);
        
        const [employeesResult, coursesResult] = await Promise.all([
          supabase.from('employees').select('id, first_name, last_name').in('id', employeeIds),
          supabase.from('courses').select('id, title').in('id', courseIds)
        ]);

        const employeeMap = new Map(employeesResult.data?.map(emp => [emp.id, emp]) || []);
        const courseMap = new Map(coursesResult.data?.map(course => [course.id, course]) || []);

        enrollments.forEach(enrollment => {
          const employee = employeeMap.get(enrollment.employee_id);
          const course = courseMap.get(enrollment.course_id);
          
          if (employee && course) {
            activities.push({
              id: enrollment.id,
              type: 'enrollment',
              description: `${employee.first_name} ${employee.last_name} enrolled in ${course.title}`,
              timestamp: enrollment.enrolled_at,
              employee_name: `${employee.first_name} ${employee.last_name}`
            });
          }
        });
      }

      // Recent goals
      const { data: goals } = await supabase
        .from('performance_goals')
        .select('id, created_at, title, employee_id, status')
        .order('created_at', { ascending: false })
        .limit(3);

      if (goals) {
        const employeeIds = goals.map(goal => goal.employee_id);
        const { data: employees } = await supabase
          .from('employees')
          .select('id, first_name, last_name')
          .in('id', employeeIds);

        const employeeMap = new Map(employees?.map(emp => [emp.id, emp]) || []);

        goals.forEach(goal => {
          const employee = employeeMap.get(goal.employee_id);
          if (employee) {
            activities.push({
              id: goal.id,
              type: 'goal',
              description: `${employee.first_name} ${employee.last_name} ${goal.status === 'completed' ? 'completed' : 'created'} goal: ${goal.title}`,
              timestamp: goal.created_at,
              employee_name: `${employee.first_name} ${employee.last_name}`
            });
          }
        });
      }

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
