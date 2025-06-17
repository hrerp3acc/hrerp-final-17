
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseEmployees } from '@/hooks/useSupabaseEmployees';
import type { Tables } from '@/integrations/supabase/types';

type AttendanceRecord = Tables<'attendance_records'>;

export const useAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { employees } = useSupabaseEmployees();

  const currentEmployee = user ? employees.find(emp => emp.user_id === user.id) : null;

  const fetchAttendanceRecords = async (date?: string, employeeId?: string) => {
    try {
      let query = supabase
        .from('attendance_records')
        .select(`
          *,
          employees (
            id,
            first_name,
            last_name,
            employee_id,
            departments (
              name
            )
          )
        `)
        .order('date', { ascending: false });

      if (date) {
        query = query.eq('date', date);
      }

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      } else if (currentEmployee) {
        // If no specific employee ID and user is not admin/manager, show only their records
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user?.id);
        
        const isManager = userRoles?.some(role => ['admin', 'manager'].includes(role.role));
        if (!isManager) {
          query = query.eq('employee_id', currentEmployee.id);
        }
      }

      const { data, error } = await query;

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

  const checkIn = async (employeeId?: string) => {
    const targetEmployeeId = employeeId || currentEmployee?.id;
    if (!targetEmployeeId) {
      toast({
        title: "Error",
        description: "Employee not found",
        variant: "destructive"
      });
      return null;
    }

    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    try {
      // Check if already checked in today
      const { data: existing } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', targetEmployeeId)
        .eq('date', today)
        .single();

      if (existing) {
        toast({
          title: "Already Checked In",
          description: "You have already checked in today",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('attendance_records')
        .insert([{
          employee_id: targetEmployeeId,
          date: today,
          check_in_time: currentTime,
          status: 'present'
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchAttendanceRecords();
      
      toast({
        title: "Checked In",
        description: "Successfully checked in for today"
      });
      
      return data;
    } catch (error) {
      console.error('Error checking in:', error);
      toast({
        title: "Error",
        description: "Failed to check in",
        variant: "destructive"
      });
      return null;
    }
  };

  const checkOut = async (employeeId?: string) => {
    const targetEmployeeId = employeeId || currentEmployee?.id;
    if (!targetEmployeeId) return null;

    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    try {
      const { data: existing } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', targetEmployeeId)
        .eq('date', today)
        .single();

      if (!existing) {
        toast({
          title: "No Check-in Record",
          description: "Please check in first",
          variant: "destructive"
        });
        return null;
      }

      if (existing.check_out_time) {
        toast({
          title: "Already Checked Out",
          description: "You have already checked out today",
          variant: "destructive"
        });
        return null;
      }

      // Calculate total hours
      const checkInTime = new Date(`${today}T${existing.check_in_time}`);
      const checkOutTime = new Date(`${today}T${currentTime}`);
      const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

      const { data, error } = await supabase
        .from('attendance_records')
        .update({
          check_out_time: currentTime,
          total_hours: Math.round(totalHours * 100) / 100
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      await fetchAttendanceRecords();
      
      toast({
        title: "Checked Out",
        description: `Successfully checked out. Total hours: ${Math.round(totalHours * 100) / 100}h`
      });
      
      return data;
    } catch (error) {
      console.error('Error checking out:', error);
      toast({
        title: "Error",
        description: "Failed to check out",
        variant: "destructive"
      });
      return null;
    }
  };

  const markAttendance = async (employeeId: string, date: string, status: string, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .upsert([{
          employee_id: employeeId,
          date,
          status,
          notes: notes || null
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchAttendanceRecords();
      
      toast({
        title: "Attendance Marked",
        description: "Attendance record updated successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive"
      });
      return null;
    }
  };

  const getTodaysAttendance = async () => {
    if (!currentEmployee) return null;

    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', currentEmployee.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
      return null;
    }
  };

  const getAttendanceStats = (records: AttendanceRecord[]) => {
    return {
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      total: records.length
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAttendanceRecords();
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    attendanceRecords,
    loading,
    checkIn,
    checkOut,
    markAttendance,
    getTodaysAttendance,
    getAttendanceStats,
    refetch: fetchAttendanceRecords
  };
};
