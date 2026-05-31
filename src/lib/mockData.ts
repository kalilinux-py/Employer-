import { Employee, Department, RecentActivity, UserProfile, SystemSettings } from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dep-eng',
    name: 'Engineering',
    description: 'Responsible for building core platform features, infrastructure scale, and DevOps pipelines.',
    managerName: 'Sarah Jenkins',
    employeeCount: 6,
    budget: '$1,450,000'
  },
  {
    id: 'dep-prd',
    name: 'Product Management',
    description: 'Defines roadmap priorities, aligns cross-functional engineering teams, and conducts client research.',
    managerName: 'David Chen',
    employeeCount: 3,
    budget: '$480,000'
  },
  {
    id: 'dep-dsg',
    name: 'Product Design & UX',
    description: 'Crafts elegant design architectures, standardizes component libraries, and leads user testing.',
    managerName: 'Elena Rostova',
    employeeCount: 3,
    budget: '$340,000'
  },
  {
    id: 'dep-mkt',
    name: 'Marketing & PR',
    description: 'Owns user acquisition funnels, digital ad campaigns, corporate events, and brand positioning.',
    managerName: 'Jessica Fletcher',
    employeeCount: 3,
    budget: '$280,000'
  },
  {
    id: 'dep-hr',
    name: 'People Operations',
    description: 'Drives global talent acquisition, culture development, payroll systems, and talent retention.',
    managerName: 'Marcus Bennett',
    employeeCount: 2,
    budget: '$190,000'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Alice Vance',
    email: 'alice.vance@enterprise-saas.com',
    phone: '+1 (555) 123-4567',
    departmentId: 'dep-eng',
    departmentName: 'Engineering',
    position: 'Principal Architect',
    joiningDate: '2023-01-15',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-2',
    name: 'Bob Miller',
    email: 'bob.miller@enterprise-saas.com',
    phone: '+1 (555) 234-5678',
    departmentId: 'dep-eng',
    departmentName: 'Engineering',
    position: 'Senior Frontend Engineer',
    joiningDate: '2023-06-20',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-3',
    name: 'Charlie Song',
    email: 'charlie.song@enterprise-saas.com',
    phone: '+1 (555) 345-6789',
    departmentId: 'dep-prd',
    departmentName: 'Product Management',
    position: 'Lead Product Manager',
    joiningDate: '2022-11-01',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-4',
    name: 'Diana Prince',
    email: 'diana.prince@enterprise-saas.com',
    phone: '+1 (555) 456-7890',
    departmentId: 'dep-dsg',
    departmentName: 'Product Design & UX',
    position: 'Lead UX Designer',
    joiningDate: '2023-02-14',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-5',
    name: 'Evan Wright',
    email: 'evan.wright@enterprise-saas.com',
    phone: '+1 (555) 567-8901',
    departmentId: 'dep-hr',
    departmentName: 'People Operations',
    position: 'Director of Recruiting',
    joiningDate: '2024-03-10',
    status: 'On Leave',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-6',
    name: 'Fiona Gallagher',
    email: 'fiona.gallagher@enterprise-saas.com',
    phone: '+1 (555) 678-9012',
    departmentId: 'dep-eng',
    departmentName: 'Engineering',
    position: 'DevOps Engineer',
    joiningDate: '2023-08-05',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-7',
    name: 'George Lucas',
    email: 'george.lucas@enterprise-saas.com',
    phone: '+1 (555) 789-0123',
    departmentId: 'dep-mkt',
    departmentName: 'Marketing & PR',
    position: 'Content Strategist',
    joiningDate: '2024-01-20',
    status: 'Suspended',
    avatarUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-8',
    name: 'Hannah Abbott',
    email: 'hannah.abbott@enterprise-saas.com',
    phone: '+1 (555) 890-1234',
    departmentId: 'dep-eng',
    departmentName: 'Engineering',
    position: 'Staff Systems Engineer',
    joiningDate: '2021-05-18',
    status: 'On Leave',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-9',
    name: 'Ian Malcolm',
    email: 'ian.malcolm@enterprise-saas.com',
    phone: '+1 (555) 901-2345',
    departmentId: 'dep-prd',
    departmentName: 'Product Management',
    position: 'Product Owner',
    joiningDate: '2023-09-12',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-10',
    name: 'Julia Diaz',
    email: 'julia.diaz@enterprise-saas.com',
    phone: '+1 (555) 012-3456',
    departmentId: 'dep-dsg',
    departmentName: 'Product Design & UX',
    position: 'Senior UI/UX Researcher',
    joiningDate: '2023-10-10',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-11',
    name: 'Kiara Henderson',
    email: 'kiara.henderson@enterprise-saas.com',
    phone: '+1 (555) 123-9876',
    departmentId: 'dep-dsg',
    departmentName: 'Product Design & UX',
    position: 'UX Designer',
    joiningDate: '2024-02-28',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-12',
    name: 'Liam Neeson',
    email: 'liam.neeson@enterprise-saas.com',
    phone: '+1 (555) 234-8765',
    departmentId: 'dep-eng',
    departmentName: 'Engineering',
    position: 'Security Specialist',
    joiningDate: '2022-04-12',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-13',
    name: 'Mona Lisa',
    email: 'mona.lisa@enterprise-saas.com',
    phone: '+1 (555) 345-7654',
    departmentId: 'dep-hr',
    departmentName: 'People Operations',
    position: 'Benefits Coordinator',
    joiningDate: '2024-04-01',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-14',
    name: 'Nathan Drake',
    email: 'nathan.drake@enterprise-saas.com',
    phone: '+1 (555) 456-6543',
    departmentId: 'dep-mkt',
    departmentName: 'Marketing & PR',
    position: 'SaaS Growth Lead',
    joiningDate: '2023-05-18',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-15',
    name: 'Olivia Wilde',
    email: 'olivia.wilde@enterprise-saas.com',
    phone: '+1 (555) 567-5432',
    departmentId: 'dep-prd',
    departmentName: 'Product Management',
    position: 'Associate Product Manager',
    joiningDate: '2024-05-15',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-16',
    name: 'Peter Parker',
    email: 'peter.parker@enterprise-saas.com',
    phone: '+1 (555) 678-4321',
    departmentId: 'dep-eng',
    departmentName: 'Engineering',
    position: 'Junior QA Automated Tester',
    joiningDate: '2024-05-25',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-17',
    name: 'Quinn Sullivan',
    email: 'quinn.sullivan@enterprise-saas.com',
    phone: '+1 (555) 789-3210',
    departmentId: 'dep-mkt',
    departmentName: 'Marketing & PR',
    position: 'SEO Consultant',
    joiningDate: '2024-05-28',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act-1',
    type: 'employee_added',
    message: 'New employee Quinn Sullivan registered under Marketing & PR.',
    timestamp: '2026-05-28T14:32:00Z',
    performedBy: 'Marcus Bennett'
  },
  {
    id: 'act-2',
    type: 'status_changed',
    message: 'Evan Wright status updated from Active to On Leave.',
    timestamp: '2026-05-27T09:15:00Z',
    performedBy: 'Sarah Jenkins'
  },
  {
    id: 'act-3',
    type: 'department_updated',
    message: 'Engineering budget values synced with finance planner.',
    timestamp: '2026-05-25T11:00:00Z',
    performedBy: 'David Chen'
  },
  {
    id: 'act-4',
    type: 'profile_updated',
    message: 'Company portal timezone updated to (GMT-05:00) Eastern Time.',
    timestamp: '2026-05-24T16:45:00Z',
    performedBy: 'kalilinux108705@gmail.com'
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Kalil Linux',
  email: 'kalilinux108705@gmail.com',
  role: 'HR Global Administrator',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  timezone: 'GMT-05:00',
  companyName: 'Stellar SaaS Corp'
};

export const INITIAL_SETTINGS: SystemSettings = {
  companyName: 'Stellar SaaS Corp',
  supportEmail: 'hr-ops@stellarsaas.com',
  currency: 'USD ($)',
  dateFormat: 'YYYY-MM-DD',
  enableNotifications: true,
  enableMfa: true,
  theme: 'dark'
};
