import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type PayrollRecord = Tables<'payroll_records'>;
type PayPeriod = Tables<'pay_periods'>;
type SalaryComponent = Tables<'salary_components'>;

export const usePayroll = () => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [payPeriods, setPayPeriods] = useState<PayPeriod[]>([]);
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPayrollRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('payroll_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayrollRecords(data || []);
    } catch (error) {
      console.error('Error fetching payroll records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payroll records",
        variant: "destructive"
      });
    }
  };

  const fetchPayPeriods = async () => {
    try {
      const { data, error } = await supabase
        .from('pay_periods')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setPayPeriods(data || []);
    } catch (error) {
      console.error('Error fetching pay periods:', error);
    }
  };

  const fetchSalaryComponents = async () => {
    try {
      const { data, error } = await supabase
        .from('salary_components')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSalaryComponents(data || []);
    } catch (error) {
      console.error('Error fetching salary components:', error);
    }
  };

  const createPayPeriod = async (payPeriodData: {
    start_date: string;
    end_date: string;
    pay_date: string;
    status?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('pay_periods')
        .insert([payPeriodData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pay period created successfully",
      });

      await fetchPayPeriods();
    } catch (error) {
      console.error('Error creating pay period:', error);
      toast({
        title: "Error",
        description: "Failed to create pay period",
        variant: "destructive"
      });
    }
  };

  const processPayroll = async (payPeriodId: string) => {
    try {
      // This would typically involve complex calculations
      // For now, we'll update the pay period status
      const { error } = await supabase
        .from('pay_periods')
        .update({ status: 'processed' })
        .eq('id', payPeriodId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payroll processed successfully",
      });

      await Promise.all([fetchPayPeriods(), fetchPayrollRecords()]);
    } catch (error) {
      console.error('Error processing payroll:', error);
      toast({
        title: "Error",
        description: "Failed to process payroll",
        variant: "destructive"
      });
    }
  };

  const createSalaryComponent = async (componentData: {
    employee_id: string;
    component_name: string;
    component_type: 'allowance' | 'deduction' | 'bonus';
    amount: number;
    percentage?: number;
    is_fixed?: boolean;
    is_taxable?: boolean;
    effective_from: string;
    effective_to?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('salary_components')
        .insert([componentData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Salary component created successfully",
      });

      await fetchSalaryComponents();
    } catch (error) {
      console.error('Error creating salary component:', error);
      toast({
        title: "Error",
        description: "Failed to create salary component",
        variant: "destructive"
      });
    }
  };

  const getPayrollStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthRecords = payrollRecords.filter(record => {
      const recordDate = new Date(record.created_at);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });

    const totalPayroll = payrollRecords.reduce((sum, record) => sum + Number(record.net_salary), 0);
    const currentMonthPayroll = currentMonthRecords.reduce((sum, record) => sum + Number(record.net_salary), 0);
    
    const processedRecords = payrollRecords.filter(record => record.status === 'processed').length;
    const pendingRecords = payrollRecords.filter(record => record.status === 'draft').length;

    return {
      totalRecords: payrollRecords.length,
      totalPayroll,
      currentMonthPayroll,
      processedRecords,
      pendingRecords,
      activePeriods: payPeriods.filter(period => period.status === 'active').length,
      totalComponents: salaryComponents.length
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPayrollRecords(),
        fetchPayPeriods(),
        fetchSalaryComponents()
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    payrollRecords,
    payPeriods,
    salaryComponents,
    loading,
    createPayPeriod,
    processPayroll,
    createSalaryComponent,
    getPayrollStats,
    refetch: () => Promise.all([fetchPayrollRecords(), fetchPayPeriods(), fetchSalaryComponents()])
  };
};