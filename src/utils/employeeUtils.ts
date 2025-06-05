
import { Employee } from '@/types/employee';

export const generateEmployeeId = (): string => {
  return `EMP${Date.now().toString().slice(-6)}`;
};

export const filterEmployees = (
  employees: Employee[],
  searchTerm: string,
  department?: string,
  status?: string
): Employee[] => {
  return employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !department || department === 'all' || employee.department === department;
    const matchesStatus = !status || status === 'all' || employee.status === status;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });
};

export const sortEmployees = (employees: Employee[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): Employee[] => {
  return [...employees].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Employee];
    let bValue: any = b[sortBy as keyof Employee];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const getEmployeesByDepartment = (employees: Employee[]): Record<string, Employee[]> => {
  return employees.reduce((acc, employee) => {
    const dept = employee.department || 'Unassigned';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(employee);
    return acc;
  }, {} as Record<string, Employee[]>);
};
