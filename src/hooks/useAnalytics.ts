
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type AnalyticsEvent = Tables<'analytics_events'>;

export const useAnalytics = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
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

  // Add analytics property for compatibility
  const analytics = {
    totalEvents,
    moduleBreakdown: events.reduce((acc, event) => {
      if (event.module) {
        acc[event.module] = (acc[event.module] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    userEngagement: {
      dailyActive: new Set(events.filter(e => {
        const eventDate = new Date(e.created_at);
        const today = new Date();
        return eventDate.toDateString() === today.toDateString();
      }).map(e => e.user_id)).size,
      weeklyActive: new Set(events.filter(e => {
        const eventDate = new Date(e.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return eventDate >= weekAgo;
      }).map(e => e.user_id)).size,
      monthlyActive: new Set(events.filter(e => {
        const eventDate = new Date(e.created_at);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return eventDate >= monthAgo;
      }).map(e => e.user_id)).size
    },
    recentActivity: events.slice(0, 10)
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAnalyticsEvents();
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    events,
    analytics,
    loading,
    trackEvent,
    getAnalyticsStats,
    getDashboardMetrics,
    refetch: fetchAnalyticsEvents
  };
};
