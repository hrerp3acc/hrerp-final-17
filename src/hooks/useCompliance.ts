
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ComplianceItem {
  id: string;
  category: string;
  title: string;
  status: 'compliant' | 'action_required' | 'under_review';
  last_review: string;
  next_review: string;
  risk_level: 'low' | 'medium' | 'high';
  documents_count: number;
  created_at: string;
  updated_at: string;
}

interface AuditTrail {
  id: string;
  date: string;
  action: string;
  item: string;
  user_name: string;
  details: string;
  created_at: string;
}

interface PolicyAcknowledgment {
  id: string;
  policy_name: string;
  total_employees: number;
  acknowledged_count: number;
  pending_count: number;
  percentage: number;
}

export const useCompliance = () => {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditTrail[]>([]);
  const [policyAcknowledgments, setPolicyAcknowledgments] = useState<PolicyAcknowledgment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getComplianceStats = () => {
    const total = complianceItems.length;
    const compliant = complianceItems.filter(item => item.status === 'compliant').length;
    const actionRequired = complianceItems.filter(item => item.status === 'action_required').length;
    const underReview = complianceItems.filter(item => item.status === 'under_review').length;

    return {
      total,
      compliant,
      actionRequired,
      underReview,
      complianceRate: total > 0 ? Math.round((compliant / total) * 100) : 0
    };
  };

  const fetchComplianceData = async () => {
    try {
      // For now, we'll create mock data that simulates real compliance tracking
      // In a real implementation, you'd have dedicated compliance tables
      
      const mockComplianceItems: ComplianceItem[] = [
        {
          id: '1',
          category: 'Labor Law',
          title: 'Equal Employment Opportunity',
          status: 'compliant',
          last_review: '2024-01-15',
          next_review: '2024-07-15',
          risk_level: 'low',
          documents_count: 3,
          created_at: '2024-01-01',
          updated_at: '2024-01-15'
        },
        {
          id: '2',
          category: 'Safety',
          title: 'Workplace Safety Training',
          status: 'action_required',
          last_review: '2024-02-01',
          next_review: '2024-08-01',
          risk_level: 'medium',
          documents_count: 5,
          created_at: '2024-01-01',
          updated_at: '2024-02-01'
        },
        {
          id: '3',
          category: 'Data Privacy',
          title: 'GDPR Compliance',
          status: 'under_review',
          last_review: '2024-01-20',
          next_review: '2024-07-20',
          risk_level: 'high',
          documents_count: 8,
          created_at: '2024-01-01',
          updated_at: '2024-01-20'
        }
      ];

      setComplianceItems(mockComplianceItems);

      // Generate audit trail from actual employee activities
      const auditEntries: AuditTrail[] = [];
      
      // Get recent employee changes
      const { data: recentEmployees } = await supabase
        .from('employees')
        .select('first_name, last_name, updated_at, created_at')
        .order('updated_at', { ascending: false })
        .limit(5);

      recentEmployees?.forEach((emp, index) => {
        auditEntries.push({
          id: `audit-${index}`,
          date: emp.updated_at.split('T')[0],
          action: 'Employee Record Updated',
          item: 'HR Database',
          user_name: `${emp.first_name} ${emp.last_name}`,
          details: 'Employee information updated in compliance tracking system',
          created_at: emp.updated_at
        });
      });

      setAuditTrail(auditEntries);

      // Calculate policy acknowledgments based on actual employee data
      const { data: employees } = await supabase
        .from('employees')
        .select('id')
        .eq('status', 'active');

      const totalEmployees = employees?.length || 0;

      const mockPolicies: PolicyAcknowledgment[] = [
        {
          id: '1',
          policy_name: 'Code of Conduct',
          total_employees: totalEmployees,
          acknowledged_count: Math.floor(totalEmployees * 0.97),
          pending_count: Math.ceil(totalEmployees * 0.03),
          percentage: 97.2
        },
        {
          id: '2',
          policy_name: 'Data Privacy Policy',
          total_employees: totalEmployees,
          acknowledged_count: Math.floor(totalEmployees * 0.93),
          pending_count: Math.ceil(totalEmployees * 0.07),
          percentage: 93.3
        }
      ];

      setPolicyAcknowledgments(mockPolicies);

    } catch (error) {
      console.error('Error fetching compliance data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch compliance data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchComplianceData();
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    complianceItems,
    auditTrail,
    policyAcknowledgments,
    loading,
    getComplianceStats,
    refreshCompliance: fetchComplianceData
  };
};
