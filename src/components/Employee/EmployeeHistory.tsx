
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, User, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type EmployeeHistoryRecord = Tables<'employee_history'>;

interface EmployeeHistoryProps {
  employeeId: string;
}

const EmployeeHistory = ({ employeeId }: EmployeeHistoryProps) => {
  const [history, setHistory] = useState<EmployeeHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('employee_history')
          .select('*')
          .eq('employee_id', employeeId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setHistory(data || []);
      } catch (error) {
        console.error('Error fetching employee history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [employeeId]);

  const getChangeTypeBadge = (changeType: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      created: 'default',
      updated: 'secondary',
      deleted: 'destructive',
      status_changed: 'default'
    };
    
    return <Badge variant={variants[changeType] || 'default'}>{changeType}</Badge>;
  };

  if (loading) {
    return <div>Loading history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="w-5 h-5" />
          <span>Employee History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No history records found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((record) => (
              <div key={record.id} className="border-l-2 border-gray-200 pl-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getChangeTypeBadge(record.change_type)}
                    {record.field_name && (
                      <span className="text-sm font-medium">{record.field_name}</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(record.created_at || '').toLocaleString()}
                  </div>
                </div>
                
                {(record.old_value || record.new_value) && (
                  <div className="text-sm space-y-1">
                    {record.old_value && (
                      <p><span className="font-medium text-red-600">From:</span> {record.old_value}</p>
                    )}
                    {record.new_value && (
                      <p><span className="font-medium text-green-600">To:</span> {record.new_value}</p>
                    )}
                  </div>
                )}
                
                {record.change_reason && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Reason:</span> {record.change_reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeHistory;
