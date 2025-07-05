
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type ReportTemplate = Tables<'report_templates'>;
type GeneratedReport = Tables<'generated_reports'>;

export const useReporting = () => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchReportTemplates = async () => {
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
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching generated reports:', error);
    }
  };

  const createReportTemplate = async (templateData: {
    name: string;
    description?: string;
    category: string;
    template_config: Record<string, any>;
    is_public?: boolean;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('report_templates')
        .insert([{
          ...templateData,
          created_by: user.id,
          template_config: templateData.template_config as any
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report template created successfully",
      });

      await fetchReportTemplates();
      return data;
    } catch (error) {
      console.error('Error creating report template:', error);
      toast({
        title: "Error",
        description: "Failed to create report template",
        variant: "destructive"
      });
      return null;
    }
  };

  const generateReport = async (templateId: string, reportData: Record<string, any>) => {
    if (!user) return null;

    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      const { data, error } = await supabase
        .from('generated_reports')
        .insert([{
          template_id: templateId,
          name: `${template.name} - ${new Date().toLocaleDateString()}`,
          description: `Generated report based on ${template.name}`,
          report_data: reportData as any,
          generated_by: user.id,
          status: 'generated'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report generated successfully",
      });

      await fetchGeneratedReports();
      return data;
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('generated_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report deleted successfully",
      });

      await fetchGeneratedReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchReportTemplates(), fetchGeneratedReports()]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    templates,
    reports,
    loading,
    createReportTemplate,
    generateReport,
    deleteReport,
    refetch: () => Promise.all([fetchReportTemplates(), fetchGeneratedReports()])
  };
};
