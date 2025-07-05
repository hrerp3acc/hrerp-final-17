
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type SystemConfig = Tables<'system_configs'>;

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_configs')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch system settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (configKey: string, value: any) => {
    try {
      const { error } = await supabase
        .from('system_configs')
        .update({ 
          config_value: typeof value === 'string' ? `"${value}"` : value,
          updated_at: new Date().toISOString()
        })
        .eq('config_key', configKey);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });

      await fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      });
    }
  };

  const createSetting = async (settingData: {
    config_key: string;
    config_value: any;
    category?: string;
    description?: string;
    is_public?: boolean;
  }) => {
    try {
      const { error } = await supabase
        .from('system_configs')
        .insert([{
          ...settingData,
          config_value: typeof settingData.config_value === 'string' 
            ? `"${settingData.config_value}"` 
            : settingData.config_value
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Setting created successfully",
      });

      await fetchSettings();
    } catch (error) {
      console.error('Error creating setting:', error);
      toast({
        title: "Error",
        description: "Failed to create setting",
        variant: "destructive"
      });
    }
  };

  const getSetting = (key: string) => {
    const setting = settings.find(s => s.config_key === key);
    if (!setting) return null;
    
    try {
      // Handle JSON parsing
      return typeof setting.config_value === 'string' 
        ? JSON.parse(setting.config_value as string)
        : setting.config_value;
    } catch {
      return setting.config_value;
    }
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.category === category);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSetting,
    createSetting,
    getSetting,
    getSettingsByCategory,
    refetch: fetchSettings
  };
};
