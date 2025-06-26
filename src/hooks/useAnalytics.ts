
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_data: any;
  module: string;
  created_at: string;
}

interface AnalyticsData {
  totalEvents: number;
  moduleBreakdown: Record<string, number>;
  recentActivity: AnalyticsEvent[];
  userEngagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
  };
}

export const useAnalytics = () => {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trackEvent = async (eventType: string, eventData: any, module: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          user_id: user.id,
          event_type: eventType,
          event_data: eventData,
          module: module
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error tracking event:', err);
    }
  };

  const fetchAnalytics = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Fetch recent events
      const { data: events, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      // Calculate analytics data
      const moduleBreakdown: Record<string, number> = {};
      events?.forEach(event => {
        moduleBreakdown[event.module] = (moduleBreakdown[event.module] || 0) + 1;
      });

      const analyticsData: AnalyticsData = {
        totalEvents: events?.length || 0,
        moduleBreakdown,
        recentActivity: events?.slice(0, 10) || [],
        userEngagement: {
          dailyActive: events?.filter(e => 
            new Date(e.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
          ).length || 0,
          weeklyActive: events?.filter(e => 
            new Date(e.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length || 0,
          monthlyActive: events?.length || 0
        }
      };

      setAnalytics(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user?.id]);

  return {
    analytics,
    loading,
    error,
    trackEvent,
    refetch: fetchAnalytics
  };
};
