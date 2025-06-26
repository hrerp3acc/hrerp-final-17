
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type UserSettings = Tables<'user_settings'>;

export const useSettings = () => {
  const { user } = useUser();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      let { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      // Create default settings if none exist
      if (!data) {
        const defaultSettings = {
          user_id: user.id,
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          notification_preferences: {
            email: true,
            push: true,
            leave_requests: true,
            performance_reviews: true,
            payroll_updates: false
          },
          dashboard_preferences: {
            layout: 'default',
            widgets: ['quick_stats', 'recent_activities', 'upcoming_events']
          }
        };

        const { data: newData, error: insertError } = await supabase
          .from('user_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (insertError) throw insertError;
        data = newData;
      }

      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user?.id || !settings) return null;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      return null;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user?.id]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};
