import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type Certification = Tables<'certifications'>;

export const useCertifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCertifications = async () => {
    if (!user) return;

    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!employee) return;

      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch certifications",
        variant: "destructive"
      });
    }
  };

  const addCertification = async (certificationData: {
    name: string;
    issuer?: string;
    issue_date?: string;
    expiry_date?: string;
    credential_id?: string;
    certificate_url?: string;
    verification_url?: string;
  }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to add certifications",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!employee) {
        toast({
          title: "Error",
          description: "Employee record not found",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('certifications')
        .insert([{
          employee_id: employee.id,
          ...certificationData
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Certification added successfully",
      });

      await fetchCertifications();
    } catch (error) {
      console.error('Error adding certification:', error);
      toast({
        title: "Error",
        description: "Failed to add certification",
        variant: "destructive"
      });
    }
  };

  const updateCertification = async (id: string, updates: Partial<Certification>) => {
    try {
      const { error } = await supabase
        .from('certifications')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Certification updated successfully",
      });

      await fetchCertifications();
    } catch (error) {
      console.error('Error updating certification:', error);
      toast({
        title: "Error",
        description: "Failed to update certification",
        variant: "destructive"
      });
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Certification deleted successfully",
      });

      await fetchCertifications();
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive"
      });
    }
  };

  const getCertificationStats = () => {
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    const activeCertifications = certifications.filter(cert => 
      cert.status === 'active' && (!cert.expiry_date || new Date(cert.expiry_date) > now)
    );
    
    const expiredCertifications = certifications.filter(cert => 
      cert.expiry_date && new Date(cert.expiry_date) <= now
    );
    
    const expiringSoon = certifications.filter(cert => 
      cert.expiry_date && 
      new Date(cert.expiry_date) > now && 
      new Date(cert.expiry_date) <= threeMonthsFromNow
    );

    return {
      total: certifications.length,
      active: activeCertifications.length,
      expired: expiredCertifications.length,
      expiringSoon: expiringSoon.length
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCertifications();
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    certifications,
    loading,
    addCertification,
    updateCertification,
    deleteCertification,
    getCertificationStats,
    refetch: fetchCertifications
  };
};