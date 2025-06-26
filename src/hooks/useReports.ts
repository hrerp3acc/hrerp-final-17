
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

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
  template_id: string;
  name: string;
  description: string;
  report_data: any;
  status: 'generating' | 'generated' | 'failed';
  file_url: string;
  file_size: string;
  generated_by: string;
  created_at: string;
}

export const useReports = () => {
  const { user } = useUser();
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    }
  };

  const createTemplate = async (template: Omit<ReportTemplate, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('report_templates')
        .insert({
          ...template,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      await fetchTemplates();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
      return null;
    }
  };

  const generateReport = async (templateId: string, name: string, description?: string) => {
    if (!user?.id) return null;

    try {
      // Simulate report generation with mock data
      const mockReportData = {
        summary: { total_records: 150, processed_at: new Date().toISOString() },
        charts: [
          { type: 'bar', data: [10, 20, 30, 40, 50] },
          { type: 'pie', data: [{ label: 'A', value: 30 }, { label: 'B', value: 70 }] }
        ]
      };

      const { data, error } = await supabase
        .from('generated_reports')
        .insert({
          template_id: templateId,
          name,
          description,
          report_data: mockReportData,
          status: 'generated',
          file_size: '2.4 MB',
          generated_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      await fetchGeneratedReports();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTemplates(), fetchGeneratedReports()]);
      setLoading(false);
    };

    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  return {
    templates,
    generatedReports,
    loading,
    error,
    createTemplate,
    generateReport,
    refetch: () => Promise.all([fetchTemplates(), fetchGeneratedReports()])
  };
};
