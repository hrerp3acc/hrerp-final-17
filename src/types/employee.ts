
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  location?: string;
  status: 'active' | 'inactive' | 'terminated';
  avatar?: string;
  startDate?: string;
  salary?: number;
  managerId?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  skills?: string[];
  certifications?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  employees: Employee[];
  budget?: number;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  startDate: string;
  salary: string;
  managerId?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  skills: string;
  notes: string;
}
