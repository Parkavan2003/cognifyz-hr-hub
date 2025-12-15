import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, Role, initialEmployees, ROLE_HIERARCHY, canSeeEmployee, canAssignTasks, canMessageEmployee, getSubordinates } from '@/data/employees';

interface AuthUser {
  id: string;
  name: string;
  role: Role;
  employee: Employee;
}

interface AuthContextType {
  user: AuthUser | null;
  employees: Employee[];
  login: (employeeId: string) => boolean;
  logout: () => void;
  canSee: (targetRole: Role) => boolean;
  canAssign: () => boolean;
  canMessage: (receiverRole: Role) => boolean;
  getVisibleEmployees: () => Employee[];
  getEmployeeById: (id: string) => Employee | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Load employees from localStorage or use initial data
    const storedEmployees = localStorage.getItem('cognifyz_employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      setEmployees(initialEmployees);
      localStorage.setItem('cognifyz_employees', JSON.stringify(initialEmployees));
    }

    // Check for existing session
    const storedUser = localStorage.getItem('cognifyz_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const emp = (storedEmployees ? JSON.parse(storedEmployees) : initialEmployees)
        .find((e: Employee) => e.id === parsed.id);
      if (emp) {
        setUser({
          id: emp.id,
          name: emp.name,
          role: emp.role,
          employee: emp,
        });
      }
    }
  }, []);

  const login = (employeeId: string): boolean => {
    // Find employee by ID - this ensures exact match
    const employee = employees.find(e => e.id === employeeId);

    if (!employee) {
      return false;
    }

    const authUser: AuthUser = {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      employee,
    };

    setUser(authUser);
    localStorage.setItem('cognifyz_user', JSON.stringify(authUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cognifyz_user');
  };

  const canSee = (targetRole: Role): boolean => {
    if (!user) return false;
    return user.role === targetRole || canSeeEmployee(user.role, targetRole);
  };

  const canAssign = (): boolean => {
    if (!user) return false;
    return canAssignTasks(user.role);
  };

  const canMessage = (receiverRole: Role): boolean => {
    if (!user) return false;
    return canMessageEmployee(user.role, receiverRole);
  };

  const getVisibleEmployees = (): Employee[] => {
    if (!user) return [];
    if (user.role === "Founder / Director") {
      return employees;
    }
    // Include self and subordinates
    return employees.filter(emp => 
      emp.id === user.id || canSeeEmployee(user.role, emp.role)
    );
  };

  const getEmployeeById = (id: string): Employee | undefined => {
    return employees.find(e => e.id === id);
  };

  return (
    <AuthContext.Provider value={{
      user,
      employees,
      login,
      logout,
      canSee,
      canAssign,
      canMessage,
      getVisibleEmployees,
      getEmployeeById,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
