export type EmployeeStatus = 'Active' | 'On Leave' | 'Suspended';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string; // denormalized for easy rendering
  position: string;
  joiningDate: string;
  status: EmployeeStatus;
  avatarUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerName: string;
  employeeCount: number;
  budget: string;
}

export interface RecentActivity {
  id: string;
  type: 'employee_added' | 'status_changed' | 'department_updated' | 'profile_updated' | 'settings_saved';
  message: string;
  timestamp: string;
  performedBy: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  timezone: string;
  companyName: string;
}

export interface SystemSettings {
  companyName: string;
  supportEmail: string;
  currency: string;
  dateFormat: string;
  enableNotifications: boolean;
  enableMfa: boolean;
  theme: 'light' | 'dark' | 'system';
}
