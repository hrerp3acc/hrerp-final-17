
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_data: any;
  module: string;
  created_at: string;
}

export const useSupabaseAnalytics = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
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
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      });
    }
  };

  const trackEvent = async (eventType: string, eventData: any, module: string) => {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([{
          event_type: eventType,
          event_data: eventData,
          module: module,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const getModuleStats = () => {
    const moduleStats = events.reduce((acc, event) => {
      const module = event.module || 'unknown';
      acc[module] = (acc[module] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(moduleStats).map(([module, count]) => ({
      module,
      count
    }));
  };

  const getEventTypeStats = () => {
    const eventTypeStats = events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(eventTypeStats).map(([eventType, count]) => ({
      eventType,
      count
    }));
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchEvents();
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    events,
    loading,
    trackEvent,
    getModuleStats,
    getEventTypeStats,
    refetchEvents: fetchEvents
  };
};
