
import { User } from '@/contexts/UserContext';

export interface SystemUser extends User {
  lastLogin?: string;
  status: 'active' | 'inactive' | 'locked';
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemSettings {
  companyName: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  workWeekStart: string;
  businessHours: {
    start: string;
    end: string;
  };
  emailDomain?: string;
  defaultLeaveBalance?: number;
  probationPeriod?: number;
}

export interface SecurityPolicy {
  passwordMinLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  passwordExpiry: boolean;
  expiryDays: number;
  twoFactorAuth: boolean;
  singleSignOn: boolean;
  sessionTimeout: boolean;
  timeoutHours: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userEmail: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  leaveRequestAlerts: boolean;
  attendanceAlerts: boolean;
  payrollReminders: boolean;
  systemMaintenance: boolean;
  securityAlerts: boolean;
}

// Real Supabase data functions
import { supabase } from '@/integrations/supabase/client';

export const fetchSystemUsers = async (): Promise<SystemUser[]> => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        position,
        departments (
          name
        )
      `);

    if (error) throw error;

    return (profiles || []).map(profile => ({
      id: profile.id,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
      email: `${profile.first_name?.toLowerCase()}.${profile.last_name?.toLowerCase()}@company.com`,
      role: 'employee' as const,
      department: profile.departments?.name || 'Unknown',
      position: profile.position || 'Employee',
      status: 'active' as const,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching system users:', error);
    return [];
  }
};

export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return (events || []).map(event => ({
      id: event.id,
      action: event.event_type,
      userId: event.user_id || 'system',
      userEmail: 'system@company.com',
      details: JSON.stringify(event.event_data),
      timestamp: event.created_at,
      ipAddress: '192.168.1.1'
    }));
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateSecurePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const formatLastLogin = (lastLogin?: string): string => {
  if (!lastLogin) return 'Never';
  const date = new Date(lastLogin);
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
};
