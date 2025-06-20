
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type PayPeriod = Tables<'pay_periods'>;
type PayrollRecord = Tables<'payroll_records'>;
type EmployeeBenefit = Tables<'employee_benefits'>;

export const usePayrollManagement = () => {
  const [payPeriods, setPayPeriods] = useState<PayPeriod[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [benefits, setBenefits] = useState<EmployeeBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
      toast({
        title: "Error",
        description: "Failed to fetch pay periods",
        variant: "destructive"
      });
    }
  };

  const fetchPayrollRecords = async () => {
    try {
      const { data: employeeData } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!employeeData) return;

      const { data, error } = await supabase
        .from('payroll_records')
        .select(`
          *,
          pay_periods (
            start_date,
            end_date,
            pay_date
          )
        `)
        .eq('employee_id', employeeData.id)
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

  const fetchBenefits = async () => {
    try {
      const { data: employeeData } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!employeeData) return;

      const { data, error } = await supabase
        .from('employee_benefits')
        .select('*')
        .eq('employee_id', employeeData.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBenefits(data || []);
    } catch (error) {
      console.error('Error fetching benefits:', error);
      toast({
        title: "Error",
        description: "Failed to fetch benefits",
        variant: "destructive"
      });
    }
  };

  const createPayPeriod = async (payPeriodData: Omit<PayPeriod, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('pay_periods')
        .insert([payPeriodData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pay period created successfully",
      });

      await fetchPayPeriods();
      return { data, error: null };
    } catch (error) {
      console.error('Error creating pay period:', error);
      toast({
        title: "Error",
        description: "Failed to create pay period",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const processPayroll = async (payPeriodId: string, employeePayrolls: Omit<PayrollRecord, 'id' | 'created_at' | 'updated_at'>[]) => {
    try {
      const { error } = await supabase
        .from('payroll_records')
        .insert(employeePayrolls);

      if (error) throw error;

      // Update pay period status
      await supabase
        .from('pay_periods')
        .update({ status: 'processing' })
        .eq('id', payPeriodId);

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

  const addBenefit = async (benefitData: Omit<EmployeeBenefit, 'id' | 'employee_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: employeeData } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!employeeData) throw new Error('Employee not found');

      const { error } = await supabase
        .from('employee_benefits')
        .insert([{
          ...benefitData,
          employee_id: employeeData.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Benefit added successfully",
      });

      await fetchBenefits();
    } catch (error) {
      console.error('Error adding benefit:', error);
      toast({
        title: "Error",
        description: "Failed to add benefit",
        variant: "destructive"
      });
    }
  };

  const getPayrollStats = () => {
    const currentPeriod = payPeriods.find(p => p.status === 'processing' || p.status === 'draft');
    const lastPayrollRecord = payrollRecords[0];
    const totalBenefitsValue = benefits.reduce((sum, b) => sum + (b.amount || 0), 0);
    const avgMonthlySalary = payrollRecords.length > 0 
      ? payrollRecords.reduce((sum, r) => sum + r.net_salary, 0) / payrollRecords.length 
      : 0;

    return {
      currentPeriod,
      lastPayrollRecord,
      totalBenefitsValue,
      avgMonthlySalary,
      totalPayrollRecords: payrollRecords.length,
      activeBenefits: benefits.length,
      pendingPayPeriods: payPeriods.filter(p => p.status === 'draft').length
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPayPeriods(), fetchPayrollRecords(), fetchBenefits()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    payPeriods,
    payrollRecords,
    benefits,
    loading,
    createPayPeriod,
    processPayroll,
    addBenefit,
    getPayrollStats,
    refetchPayPeriods: fetchPayPeriods,
    refetchPayrollRecords: fetchPayrollRecords,
    refetchBenefits: fetchBenefits
  };
};
