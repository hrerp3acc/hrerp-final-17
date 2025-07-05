
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type AnalyticsEvent = Tables<'analytics_events'>;
type UserActivityLog = Tables<'user_activity_logs'>;

export const useAnalytics = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAnalyticsEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching analytics events:', error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };

  const trackEvent = async (eventType: string, module?: string, eventData?: object) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([{
          user_id: user.id,
          event_type: eventType,
          module,
          event_data: eventData || {}
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const logActivity = async (actionType: string, resourceType?: string, resourceId?: string, details?: object) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_activity_logs')
        .insert([{
          user_id: user.id,
          action_type: actionType,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details || {}
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const getAnalyticsStats = () => {
    const totalEvents = events.length;
    const uniqueUsers = new Set(events.map(e => e.user_id)).size;
    const topModules = events.reduce((acc, event) => {
      if (event.module) {
        acc[event.module] = (acc[event.module] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const mostActiveModule = Object.entries(topModules)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    return {
      totalEvents,
      uniqueUsers,
      mostActiveModule,
      topModules
    };
  };

  const getDashboardMetrics = async () => {
    try {
      // Fetch various metrics for dashboard
      const [employeesResult, attendanceResult, goalsResult, coursesResult] = await Promise.all([
        supabase.from('employees').select('id', { count: 'exact', head: true }),
        supabase.from('attendance_records').select('id', { count: 'exact', head: true }),
        supabase.from('performance_goals').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true })
      ]);

      return {
        totalEmployees: employeesResult.count || 0,
        totalAttendanceRecords: attendanceResult.count || 0,
        totalGoals: goalsResult.count || 0,
        totalCourses: coursesResult.count || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      return {
        totalEmployees: 0,
        totalAttendanceRecords: 0,
        totalGoals: 0,
        totalCourses: 0
      };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAnalyticsEvents(), fetchActivityLogs()]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    events,
    activityLogs,
    loading,
    trackEvent,
    logActivity,
    getAnalyticsStats,
    getDashboardMetrics,
    refetch: () => Promise.all([fetchAnalyticsEvents(), fetchActivityLogs()])
  };
};
