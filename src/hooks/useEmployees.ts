
import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { filterEmployees, sortEmployees } from '@/utils/employeeUtils';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
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
