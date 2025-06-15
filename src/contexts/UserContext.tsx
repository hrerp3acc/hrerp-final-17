
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useProfile } from '@/hooks/useProfile';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  department?: string;
  position?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { user: authUser, signOut } = useAuth();
  const { profile } = useProfile();

  // Convert auth user and profile to legacy User format for compatibility
  const user: User | null = authUser ? {
    id: authUser.id,
    name: profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || authUser.email?.split('@')[0] || 'User',
    email: authUser.email || '',
    role: 'employee', // Default role, will be enhanced with real roles later
    avatar: profile?.avatar_url,
    position: profile?.position || undefined
  } : null;

  const logout = async () => {
    await signOut();
  };

  const setUser = () => {
    // This is handled by the auth context now
    console.warn('setUser is deprecated, use auth context instead');
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!authUser,
    logout
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
