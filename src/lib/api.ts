import { 
  INITIAL_EMPLOYEES, 
  INITIAL_DEPARTMENTS, 
  INITIAL_ACTIVITIES, 
  INITIAL_PROFILE, 
  INITIAL_SETTINGS 
} from './mockData';
import { Employee, Department, RecentActivity, UserProfile, SystemSettings } from '../types';

// Helper to load or set LocalStorage
const getStorageItem = <T>(key: string, initial: T): T => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(item) as T;
  } catch {
    return initial;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Storage Keys
const KEYS = {
  EMPLOYEES: 'ems_employees_v1',
  DEPARTMENTS: 'ems_departments_v1',
  ACTIVITIES: 'ems_activities_v1',
  PROFILE: 'ems_profile_v1',
  SETTINGS: 'ems_settings_v1',
  AUTH: 'ems_auth_token_v1',
};

// Seed storage
getStorageItem(KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
getStorageItem(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
getStorageItem(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
getStorageItem(KEYS.PROFILE, INITIAL_PROFILE);
getStorageItem(KEYS.SETTINGS, INITIAL_SETTINGS);

// Simulated Delay (ms)
const SIMULATED_LATENCY = 600;

const delay = (ms: number = SIMULATED_LATENCY) => 
  new Promise((resolve) => setTimeout(resolve, ms));

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
}

export class AxiosError extends Error {
  status: number;
  response?: AxiosResponse;

  constructor(message: string, status: number, response?: AxiosResponse) {
    super(message);
    this.name = 'AxiosError';
    this.status = status;
    this.response = response;
  }
}

// Log a system activity
export const logActivity = (
  type: RecentActivity['type'], 
  message: string, 
  performedBy: string = 'Kalil Linux'
) => {
  const activities = getStorageItem<RecentActivity[]>(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  const newActivity: RecentActivity = {
    id: `act-${Date.now()}`,
    type,
    message,
    timestamp: new Date().toISOString(),
    performedBy,
  };
  setStorageItem(KEYS.ACTIVITIES, [newActivity, ...activities].slice(0, 50));
};

/**
 * Custom Mock Axios Service Layer
 */
export const api = {
  async get<T = any>(url: string, config?: { params?: Record<string, any> }): Promise<AxiosResponse<T>> {
    await delay();

    // Parse URL & Querystring
    const cleanUrl = url.split('?')[0];
    const params = config?.params || {};

    // Authentication mock check
    if (!cleanUrl.endsWith('/api/auth/login') && !getStorageItem(KEYS.AUTH, '')) {
      // Allow general views for sample sandbox, but throw if explicitly required
    }

    // Force error injection setting (for testing Error states)
    if (params.forceError || localStorage.getItem('ems_force_error') === 'true') {
      throw new AxiosError('Internal Server Error (Simulated API Crash)', 500);
    }

    // 1. Employees Endpoints
    if (cleanUrl === '/api/employees') {
      const allEmployees = getStorageItem<Employee[]>(KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
      let filtered = [...allEmployees];

      // Filtering and Searching
      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (emp) => 
            emp.name.toLowerCase().includes(query) || 
            emp.email.toLowerCase().includes(query) || 
            emp.position.toLowerCase().includes(query)
        );
      }

      if (params.departmentId && params.departmentId !== 'all') {
        filtered = filtered.filter((emp) => emp.departmentId === params.departmentId);
      }

      if (params.status && params.status !== 'all') {
        filtered = filtered.filter((emp) => emp.status === params.status);
      }

      // Pagination
      const page = parseInt(params.page || '1', 10);
      const limit = parseInt(params.limit || '8', 10);
      const totalCount = filtered.length;
      const totalPages = Math.ceil(totalCount / limit);
      
      const startIndex = (page - 1) * limit;
      const paginatedData = filtered.slice(startIndex, startIndex + limit);

      const payload = {
        items: paginatedData,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        }
      };

      return {
        data: payload as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    if (cleanUrl.match(/^\/api\/employees\/[a-zA-Z0-9-]+$/)) {
      const id = cleanUrl.split('/').pop();
      const allEmployees = getStorageItem<Employee[]>(KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
      const employee = allEmployees.find(emp => emp.id === id);
      
      if (!employee) {
        throw new AxiosError(`Employee with id ${id} not found`, 404);
      }

      return {
        data: employee as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    // 2. Departments Endpoints
    if (cleanUrl === '/api/departments') {
      const allDepts = getStorageItem<Department[]>(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
      return {
        data: allDepts as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    // 3. Activity Endpoints
    if (cleanUrl === '/api/activities') {
      const allActivities = getStorageItem<RecentActivity[]>(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
      return {
        data: allActivities as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    // 4. Profiles Endpoints
    if (cleanUrl === '/api/profile') {
      const profile = getStorageItem<UserProfile>(KEYS.PROFILE, INITIAL_PROFILE);
      return {
        data: profile as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    // 5. Settings Endpoints
    if (cleanUrl === '/api/settings') {
      const settings = getStorageItem<SystemSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
      return {
        data: settings as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    throw new AxiosError(`Not Found: GET ${url}`, 404);
  },

  async post<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    await delay();

    if (localStorage.getItem('ems_force_error') === 'true') {
      throw new AxiosError('Internal Server Error (Simulated API Crash)', 500);
    }

    // 1. Auth Login Endpoint
    if (url === '/api/auth/login') {
      const { email, password } = data || {};
      if (email === 'admin@saas.com' && password === 'admin123') {
        const token = 'mock_jwt_token_for_ems_' + Math.random().toString(36).substr(2);
        localStorage.setItem(KEYS.AUTH, token);
        return {
          data: { token, email, user: INITIAL_PROFILE } as unknown as T,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        };
      } else {
        throw new AxiosError('Invalid email or password credentials. Hint: use admin@saas.com and admin123', 400);
      }
    }

    // 2. Add Employee
    if (url === '/api/employees') {
      const employees = getStorageItem<Employee[]>(KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
      const departments = getStorageItem<Department[]>(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
      
      const targetDept = departments.find(d => d.id === data.departmentId);
      const deptName = targetDept ? targetDept.name : 'Unassigned';

      const newEmployee: Employee = {
        ...data,
        id: `emp-${Date.now()}`,
        departmentName: deptName,
        avatarUrl: data.avatarUrl || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=150&auto=format&fit=crop&q=80`,
      };

      const updatedEmployees = [newEmployee, ...employees];
      setStorageItem(KEYS.EMPLOYEES, updatedEmployees);

      // Increment employee count
      if (targetDept) {
        targetDept.employeeCount += 1;
        setStorageItem(KEYS.DEPARTMENTS, departments);
      }

      logActivity('employee_added', `Employee ${newEmployee.name} added to ${deptName} as ${newEmployee.position}.`);

      return {
        data: newEmployee as unknown as T,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {},
      };
    }

    // 3. Add Department
    if (url === '/api/departments') {
      const depts = getStorageItem<Department[]>(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
      const newDept: Department = {
        ...data,
        id: `dep-${Date.now()}`,
        employeeCount: 0,
      };

      const updatedDepts = [...depts, newDept];
      setStorageItem(KEYS.DEPARTMENTS, updatedDepts);

      logActivity('department_updated', `New department "${newDept.name}" established under manager ${newDept.managerName}.`);

      return {
        data: newDept as unknown as T,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {},
      };
    }

    throw new AxiosError(`Not Found: POST ${url}`, 404);
  },

  async put<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    await delay();

    if (localStorage.getItem('ems_force_error') === 'true') {
      throw new AxiosError('Internal Server Error (Simulated API Crash)', 500);
    }

    // 1. Edit Employee
    if (url.match(/^\/api\/employees\/[a-zA-Z0-9-]+$/)) {
      const id = url.split('/').pop();
      const employees = getStorageItem<Employee[]>(KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
      const departments = getStorageItem<Department[]>(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
      
      const index = employees.findIndex(emp => emp.id === id);
      if (index === -1) {
        throw new AxiosError(`Employee with ID ${id} not found`, 404);
      }

      const prevEmployee = employees[index];
      const targetDept = departments.find(d => d.id === data.departmentId);
      const deptName = targetDept ? targetDept.name : 'Unassigned';

      // If department changed, update counts
      if (prevEmployee.departmentId !== data.departmentId) {
        const oldDept = departments.find(d => d.id === prevEmployee.departmentId);
        if (oldDept) oldDept.employeeCount = Math.max(0, oldDept.employeeCount - 1);
        if (targetDept) targetDept.employeeCount += 1;
        setStorageItem(KEYS.DEPARTMENTS, departments);
      }

      const updatedEmployee: Employee = {
        ...prevEmployee,
        ...data,
        departmentName: deptName,
      };

      employees[index] = updatedEmployee;
      setStorageItem(KEYS.EMPLOYEES, employees);

      let logMsg = `Employee ${updatedEmployee.name} records updated.`;
      if (prevEmployee.status !== updatedEmployee.status) {
        logMsg = `Employee ${updatedEmployee.name} status updated from ${prevEmployee.status} to ${updatedEmployee.status}.`;
        logActivity('status_changed', logMsg);
      } else {
        logActivity('profile_updated', logMsg);
      }

      return {
        data: updatedEmployee as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    // 2. Edit Department
    if (url.match(/^\/api\/departments\/[a-zA-Z0-9-]+$/)) {
      const id = url.split('/').pop();
      const depts = getStorageItem<Department[]>(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
      const index = depts.findIndex(d => d.id === id);
      if (index === -1) {
        throw new AxiosError(`Department with ID ${id} not found`, 404);
      }

      const updatedDept = {
        ...depts[index],
        ...data,
      };

      depts[index] = updatedDept;
      setStorageItem(KEYS.DEPARTMENTS, depts);

      logActivity('department_updated', `Department "${updatedDept.name}" metadata updated.`);

      return {
        data: updatedDept as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    // 3. Edit User Profile
    if (url === '/api/profile') {
      const profile = getStorageItem<UserProfile>(KEYS.PROFILE, INITIAL_PROFILE);
      const updatedProfile = {
        ...profile,
        ...data,
      };
      setStorageItem(KEYS.PROFILE, updatedProfile);

      logActivity('profile_updated', `User global profile info updated for ${updatedProfile.name}.`);

      return {
        data: updatedProfile as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    // 4. Edit Settings
    if (url === '/api/settings') {
      const settings = getStorageItem<SystemSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
      const updatedSettings = {
        ...settings,
        ...data,
      };
      setStorageItem(KEYS.SETTINGS, updatedSettings);

      logActivity('settings_saved', `Application system settings updated globally.`);

      return {
        data: updatedSettings as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    throw new AxiosError(`Not Found: PUT ${url}`, 404);
  },

  async delete<T = any>(url: string): Promise<AxiosResponse<T>> {
    await delay();

    if (localStorage.getItem('ems_force_error') === 'true') {
      throw new AxiosError('Internal Server Error (Simulated API Crash)', 500);
    }

    // 1. Delete Employee
    if (url.match(/^\/api\/employees\/[a-zA-Z0-9-]+$/)) {
      const id = url.split('/').pop();
      const employees = getStorageItem<Employee[]>(KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
      const departments = getStorageItem<Department[]>(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
      
      const employee = employees.find(emp => emp.id === id);
      if (!employee) {
        throw new AxiosError(`Employee with ID ${id} not found`, 404);
      }

      const filtered = employees.filter(emp => emp.id !== id);
      setStorageItem(KEYS.EMPLOYEES, filtered);

      // Decrement employee count in department
      const targetDept = departments.find(d => d.id === employee.departmentId);
      if (targetDept) {
        targetDept.employeeCount = Math.max(0, targetDept.employeeCount - 1);
        setStorageItem(KEYS.DEPARTMENTS, departments);
      }

      logActivity('status_changed', `Employee record of ${employee.name} permanently purged from system database.`);

      return {
        data: { success: true } as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    // 2. Delete Department
    if (url.match(/^\/api\/departments\/[a-zA-Z0-9-]+$/)) {
      const id = url.split('/').pop();
      const depts = getStorageItem<Department[]>(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
      const employees = getStorageItem<Employee[]>(KEYS.EMPLOYEES, INITIAL_EMPLOYEES);

      const dept = depts.find(d => d.id === id);
      if (!dept) {
        throw new AxiosError(`Department with ID ${id} not found`, 404);
      }

      // Check if department has active employees
      const checkEmployees = employees.filter(emp => emp.departmentId === id);
      if (checkEmployees.length > 0) {
        throw new AxiosError(`Cannot delete department with active employees (${checkEmployees.length} members). Re-assign employees first.`, 400);
      }

      const filtered = depts.filter(d => d.id !== id);
      setStorageItem(KEYS.DEPARTMENTS, filtered);

      logActivity('department_updated', `Department ${dept.name} was successfully de-chartered.`);

      return {
        data: { success: true } as unknown as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
    }

    throw new AxiosError(`Not Found: DELETE ${url}`, 404);
  }
};

// Also export as default default to mock standard import axios from 'axios'
export default api;
