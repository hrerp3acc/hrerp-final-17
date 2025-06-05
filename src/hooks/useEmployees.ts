
import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { filterEmployees, sortEmployees } from '@/utils/employeeUtils';

// Mock data for demonstration
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Marketing',
    position: 'Marketing Manager',
    location: 'New York',
    status: 'active',
    startDate: '2020-01-15',
    salary: 75000,
    skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
    emergencyContact: {
      name: 'John Johnson',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse'
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
    position: 'Senior Developer',
    location: 'San Francisco',
    status: 'active',
    startDate: '2019-06-10',
    salary: 95000,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    managerId: '3'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Engineering',
    position: 'Engineering Manager',
    location: 'San Francisco',
    status: 'active',
    startDate: '2018-03-20',
    salary: 110000,
    skills: ['Team Leadership', 'System Architecture', 'Project Management']
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    phone: '+1 (555) 456-7890',
    department: 'Finance',
    position: 'Financial Analyst',
    location: 'Boston',
    status: 'active',
    startDate: '2021-09-01',
    salary: 65000,
    skills: ['Financial Analysis', 'Excel', 'SQL']
  }
];

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEmployee = async (employeeData: Partial<Employee>) => {
    setLoading(true);
    try {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...employeeData
      } as Employee;
      
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      setError('Failed to add employee');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    setLoading(true);
    try {
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === id 
            ? { ...emp, ...updates, updatedAt: new Date().toISOString() }
            : emp
        )
      );
    } catch (err) {
      setError('Failed to update employee');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    setLoading(true);
    try {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      setError('Failed to delete employee');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEmployee = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  const searchEmployees = (searchTerm: string, department?: string, status?: string) => {
    return filterEmployees(employees, searchTerm, department, status);
  };

  const sortEmployeesBy = (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
    return sortEmployees(employees, sortBy, sortOrder);
  };

  const getDepartments = () => {
    const departments = [...new Set(employees.map(emp => emp.department))];
    return departments.filter(Boolean).sort();
  };

  const getEmployeeStats = () => {
    const total = employees.length;
    const active = employees.filter(emp => emp.status === 'active').length;
    const inactive = employees.filter(emp => emp.status === 'inactive').length;
    const departments = getDepartments().length;
    
    return { total, active, inactive, departments };
  };

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    searchEmployees,
    sortEmployeesBy,
    getDepartments,
    getEmployeeStats
  };
};
