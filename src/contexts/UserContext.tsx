
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  // For now, we'll use a mock user until we integrate with authentication
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'admin',
    department: 'Executive',
    position: 'CEO'
  });

  const logout = () => {
    setUser(null);
    // In a real app, this would also handle API logout, clear tokens, etc.
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    logout
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
