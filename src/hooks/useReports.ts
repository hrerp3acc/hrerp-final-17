
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type ReportTemplate = Tables<'report_templates'>;
type GeneratedReport = Tables<'generated_reports'>;

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
      // Generate report with real data
      const { data: employees } = await supabase.from('employees').select('*');
      const { data: attendance } = await supabase.from('attendance_records').select('*');
      const { data: leaves } = await supabase.from('leave_applications').select('*');
      
      const reportData = {
        summary: { 
          total_employees: employees?.length || 0,
          total_attendance_records: attendance?.length || 0,
          total_leave_applications: leaves?.length || 0,
          processed_at: new Date().toISOString() 
        },
        charts: [
          { type: 'employee_distribution', count: employees?.length || 0 },
          { type: 'attendance_summary', count: attendance?.length || 0 },
          { type: 'leave_analysis', count: leaves?.length || 0 }
        ]
      };

      const { data, error } = await supabase
        .from('generated_reports')
        .insert({
          template_id: templateId,
          name,
          description,
          report_data: reportData,
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
