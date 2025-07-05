
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

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const createTemplate = async (templateData: {
    name: string;
    description?: string;
    category: string;
    template_config: object;
    is_public?: boolean;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('report_templates')
        .insert([{
          ...templateData,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report template created successfully",
      });

      await fetchTemplates();
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create report template",
        variant: "destructive"
      });
      return null;
    }
  };

  const generateReport = async (templateId: string, reportName: string) => {
    if (!user) return null;

    try {
      // Fetch data based on template configuration
      const template = templates.find(t => t.id === templateId);
      if (!template) return null;

      // Generate report data (simplified example)
      const reportData = await generateReportData(template.template_config);

      const { data, error } = await supabase
        .from('generated_reports')
        .insert([{
          template_id: templateId,
          name: reportName,
          report_data: reportData,
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

      await fetchReports();
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

  const generateReportData = async (config: any) => {
    // This is a simplified example - in reality, you'd fetch data based on the template configuration
    const { data: employees } = await supabase.from('employees').select('*');
    const { data: attendanceRecords } = await supabase.from('attendance_records').select('*');
    
    return {
      totalEmployees: employees?.length || 0,
      totalAttendanceRecords: attendanceRecords?.length || 0,
      generatedAt: new Date().toISOString(),
      config
    };
  };

  const getReportingStats = () => {
    const totalTemplates = templates.length;
    const totalReports = reports.length;
    const recentReports = reports.filter(r => {
      const createdAt = new Date(r.created_at);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return createdAt >= lastWeek;
    }).length;

    return {
      totalTemplates,
      totalReports,
      recentReports
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTemplates(), fetchReports()]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    templates,
    reports,
    loading,
    createTemplate,
    generateReport,
    getReportingStats,
    refetch: () => Promise.all([fetchTemplates(), fetchReports()])
  };
};
