
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template_config: any;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface GeneratedReport {
  id: string;
  name: string;
  description: string;
  report_data: any;
  status: string;
  file_url?: string;
  file_size?: string;
  generated_by: string;
  created_at: string;
}

export const useSupabaseReports = () => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching report templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch report templates",
        variant: "destructive"
      });
    }
  };

  const fetchGeneratedReports = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGeneratedReports(data || []);
    } catch (error) {
      console.error('Error fetching generated reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch generated reports",
        variant: "destructive"
      });
    }
  };

  const createTemplate = async (templateData: Omit<ReportTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .insert([templateData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Report template created successfully",
      });
      
      await fetchTemplates();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating report template:', error);
      toast({
        title: "Error",
        description: "Failed to create report template",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const generateReport = async (reportData: Omit<GeneratedReport, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('generated_reports')
        .insert([reportData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
      
      await fetchGeneratedReports();
      return { data, error: null };
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTemplates(), fetchGeneratedReports()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    templates,
    generatedReports,
    loading,
    createTemplate,
    generateReport,
    refetchTemplates: fetchTemplates,
    refetchGeneratedReports: fetchGeneratedReports
  };
};
