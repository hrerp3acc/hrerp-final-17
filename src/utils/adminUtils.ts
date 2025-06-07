
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

// Mock data functions - in a real app, these would be API calls
export const fetchSystemUsers = async (): Promise<SystemUser[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'admin',
      department: 'Executive',
      position: 'CEO',
      status: 'active',
      lastLogin: '2024-06-07T10:30:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'manager',
      department: 'HR',
      position: 'HR Manager',
      status: 'active',
      lastLogin: '2024-06-06T16:45:00Z',
      createdAt: '2024-02-01T09:00:00Z'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'employee',
      department: 'Engineering',
      position: 'Software Developer',
      status: 'active',
      lastLogin: '2024-06-05T14:20:00Z',
      createdAt: '2024-03-15T09:00:00Z'
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      role: 'manager',
      department: 'Sales',
      position: 'Sales Manager',
      status: 'inactive',
      lastLogin: '2024-05-20T11:15:00Z',
      createdAt: '2024-01-20T09:00:00Z'
    }
  ];
};

export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: '1',
      action: 'Failed login attempt',
      userId: 'unknown',
      userEmail: 'invalid@email.com',
      details: 'Multiple failed login attempts from IP 192.168.1.100',
      timestamp: '2024-06-07T08:30:00Z',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      action: 'Password changed',
      userId: '1',
      userEmail: 'john.doe@company.com',
      details: 'User successfully changed password',
      timestamp: '2024-06-06T14:20:00Z',
      ipAddress: '192.168.1.50'
    },
    {
      id: '3',
      action: 'User role updated',
      userId: '2',
      userEmail: 'sarah.johnson@company.com',
      details: 'User role changed from Employee to Manager',
      timestamp: '2024-06-04T10:15:00Z',
      ipAddress: '192.168.1.25'
    },
    {
      id: '4',
      action: 'System settings modified',
      userId: '1',
      userEmail: 'john.doe@company.com',
      details: 'Company timezone updated to UTC-5',
      timestamp: '2024-06-03T16:45:00Z',
      ipAddress: '192.168.1.50'
    }
  ];
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
