
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  total_hours: number | null;
  status: string;
  break_duration: string | null;
  notes: string | null;
  created_at: string;
}

export const useAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const { toast } = useToast();

  const fetchCurrentEmployee = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: employee } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (employee) {
        setCurrentEmployee(employee);
        return employee;
      }

      // If no employee record with user_id, try to find by email
      const { data: employeeByEmail } = await supabase
        .from('employees')
        .select('*')
        .eq('email', user.email)
        .single();

      if (employeeByEmail) {
        setCurrentEmployee(employeeByEmail);
        return employeeByEmail;
      }

      return null;
    } catch (error) {
      console.error('Error fetching current employee:', error);
      return null;
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance records",
        variant: "destructive"
      });
    }
  };

  const checkIn = async () => {
    try {
      const employee = currentEmployee || await fetchCurrentEmployee();
      
      if (!employee) {
        toast({
          title: "Error",
          description: "Employee profile not found. Please contact administrator.",
          variant: "destructive"
        });
        return { success: false };
      }

      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toTimeString().split(' ')[0];

      // Check if already checked in today
      const { data: existingRecord } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', employee.id)
        .eq('date', today)
        .single();

      if (existingRecord && existingRecord.check_in_time) {
        toast({
          title: "Already Checked In",
          description: "You have already checked in today",
          variant: "destructive"
        });
        return { success: false };
      }

      const attendanceData = {
        employee_id: employee.id,
        date: today,
        check_in_time: currentTime,
        status: 'present'
      };

      let result;
      if (existingRecord) {
        // Update existing record
        result = await supabase
          .from('attendance_records')
          .update(attendanceData)
          .eq('id', existingRecord.id)
          .select();
      } else {
        // Create new record
        result = await supabase
          .from('attendance_records')
          .insert([attendanceData])
          .select();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: "Checked in successfully",
      });

      await fetchAttendanceRecords();
      return { success: true };
    } catch (error) {
      console.error('Error checking in:', error);
      toast({
        title: "Error",
        description: "Failed to check in. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const checkOut = async () => {
    try {
      const employee = currentEmployee || await fetchCurrentEmployee();
      
      if (!employee) {
        toast({
          title: "Error",
          description: "Employee profile not found. Please contact administrator.",
          variant: "destructive"
        });
        return { success: false };
      }

      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toTimeString().split(' ')[0];

      const { data: todayRecord, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', employee.id)
        .eq('date', today)
        .single();

      if (error || !todayRecord || !todayRecord.check_in_time) {
        toast({
          title: "Error",
          description: "No check-in record found for today",
          variant: "destructive"
        });
        return { success: false };
      }

      if (todayRecord.check_out_time) {
        toast({
          title: "Already Checked Out",
          description: "You have already checked out today",
          variant: "destructive"
        });
        return { success: false };
      }

      // Calculate total hours
      const checkInTime = new Date(`${today}T${todayRecord.check_in_time}`);
      const checkOutTime = new Date(`${today}T${currentTime}`);
      const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

      const { error: updateError } = await supabase
        .from('attendance_records')
        .update({
          check_out_time: currentTime,
          total_hours: Math.round(totalHours * 100) / 100
        })
        .eq('id', todayRecord.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Checked out successfully",
      });

      await fetchAttendanceRecords();
      return { success: true };
    } catch (error) {
      console.error('Error checking out:', error);
      toast({
        title: "Error",
        description: "Failed to check out. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const getTodaysAttendance = () => {
    if (!currentEmployee) return null;
    
    const today = new Date().toISOString().split('T')[0];
    return attendanceRecords.find(record => 
      record.employee_id === currentEmployee.id && record.date === today
    );
  };

  const getAttendanceStats = () => {
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthlyRecords = attendanceRecords.filter(record => 
      record.date.startsWith(thisMonth)
    );
    
    return {
      totalDays: monthlyRecords.length,
      presentDays: monthlyRecords.filter(r => r.status === 'present').length,
      absentDays: monthlyRecords.filter(r => r.status === 'absent').length,
      averageHours: monthlyRecords.length > 0 ? 
        monthlyRecords.reduce((sum, r) => sum + (r.total_hours || 0), 0) / monthlyRecords.length : 0
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCurrentEmployee(), fetchAttendanceRecords()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    attendanceRecords,
    loading,
    currentEmployee,
    checkIn,
    checkOut,
    getTodaysAttendance,
    getAttendanceStats,
    refetchAttendance: fetchAttendanceRecords
  };
};
