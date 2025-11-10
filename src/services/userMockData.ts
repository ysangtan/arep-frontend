import { User, UserRole } from '@/types/user.types';

// SECURITY NOTE: In production, roles MUST be stored in a separate table
// and validated server-side. Never trust client-side role checks.
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.smith@arep.com',
    fullName: 'John Smith',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'sarah.johnson@arep.com',
    fullName: 'Sarah Johnson',
    role: 'project-manager',
    status: 'active',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '3',
    email: 'michael.chen@arep.com',
    fullName: 'Michael Chen',
    role: 'business-analyst',
    status: 'active',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '4',
    email: 'emily.davis@arep.com',
    fullName: 'Emily Davis',
    role: 'developer',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '5',
    email: 'david.wilson@arep.com',
    fullName: 'David Wilson',
    role: 'tester',
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '6',
    email: 'lisa.brown@arep.com',
    fullName: 'Lisa Brown',
    role: 'stakeholder',
    status: 'active',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
];

export const availableRoles = [
  { value: 'admin', label: 'Administrator', description: 'Full system access' },
  { value: 'project-manager', label: 'Project Manager', description: 'Manage projects and teams' },
  { value: 'business-analyst', label: 'Business Analyst', description: 'Create and manage requirements' },
  { value: 'developer', label: 'Developer', description: 'View and implement requirements' },
  { value: 'tester', label: 'Tester', description: 'Review and test requirements' },
  { value: 'stakeholder', label: 'Stakeholder', description: 'View and comment on requirements' },
];

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 300);
    });
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers.find((u) => u.id === id)), 200);
    });
  },

  createUser: async (input: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers.some((u) => u.email === input.email)) {
          reject(new Error('User with this email already exists'));
          return;
        }

        const newUser: User = {
          ...input,
          id: String(mockUsers.length + 1),
          status: input.status || 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        resolve(newUser);
      }, 500);
    });
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index === -1) {
          reject(new Error('User not found'));
          return;
        }

        mockUsers[index] = {
          ...mockUsers[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(mockUsers[index]);
      }, 300);
    });
  },

  deleteUser: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index === -1) {
          reject(new Error('User not found'));
          return;
        }
        mockUsers.splice(index, 1);
        resolve();
      }, 300);
    });
  },

  changeUserRole: async (id: string, newRole: UserRole): Promise<User> => {
    return userService.updateUser(id, { role: newRole });
  },
};
