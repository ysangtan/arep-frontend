import { Project, ProjectTemplate } from '@/types/project.types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Marketing Platform Redesign',
    key: 'MAR',
    description: 'Complete redesign of the marketing automation platform',
    template: 'software-dev',
    status: 'active',
    ownerId: '1',
    ownerName: 'John Smith',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
    teamMembers: ['1', '2', '3'],
    requirementCount: 47,
  },
  {
    id: '2',
    name: 'E-commerce Mobile App',
    key: 'EAG',
    description: 'Native mobile app for online shopping experience',
    template: 'mobile-app',
    status: 'active',
    ownerId: '2',
    ownerName: 'Sarah Johnson',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-22T11:15:00Z',
    teamMembers: ['2', '4', '5'],
    requirementCount: 63,
  },
  {
    id: '3',
    name: 'Customer Portal v2',
    key: 'CPV2',
    description: 'Second version of customer self-service portal',
    template: 'enterprise',
    status: 'active',
    ownerId: '1',
    ownerName: 'John Smith',
    createdAt: '2023-11-10T08:30:00Z',
    updatedAt: '2024-03-21T16:45:00Z',
    teamMembers: ['1', '3', '6'],
    requirementCount: 89,
  },
  {
    id: '4',
    name: 'Payment Gateway Integration',
    key: 'PAY',
    description: 'Integrate multiple payment providers into platform',
    template: 'api',
    status: 'active',
    ownerId: '3',
    ownerName: 'Michael Chen',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-23T09:20:00Z',
    teamMembers: ['3', '4'],
    requirementCount: 28,
  },
  {
    id: '5',
    name: 'Analytics Dashboard',
    key: 'ANA',
    description: 'Real-time analytics and reporting dashboard',
    template: 'software-dev',
    status: 'active',
    ownerId: '2',
    ownerName: 'Sarah Johnson',
    createdAt: '2024-01-20T11:30:00Z',
    updatedAt: '2024-03-19T13:10:00Z',
    teamMembers: ['2', '5', '6'],
    requirementCount: 34,
  },
  {
    id: '6',
    name: 'Legacy System Migration',
    key: 'LSM',
    description: 'Migrate legacy systems to new architecture',
    template: 'enterprise',
    status: 'archived',
    ownerId: '1',
    ownerName: 'John Smith',
    createdAt: '2023-08-15T09:00:00Z',
    updatedAt: '2024-01-30T17:00:00Z',
    teamMembers: ['1', '3', '4', '5'],
    requirementCount: 156,
  },
];

export const projectTemplates: { value: ProjectTemplate; label: string; description: string }[] = [
  {
    value: 'blank',
    label: 'Blank Project',
    description: 'Start from scratch with no predefined structure',
  },
  {
    value: 'software-dev',
    label: 'Software Development',
    description: 'Standard software development project with common workflows',
  },
  {
    value: 'mobile-app',
    label: 'Mobile Application',
    description: 'Mobile app development with platform-specific requirements',
  },
  {
    value: 'enterprise',
    label: 'Enterprise System',
    description: 'Large-scale enterprise application with complex workflows',
  },
  {
    value: 'api',
    label: 'API Development',
    description: 'API-focused project with endpoint documentation',
  },
];

// Simulated API functions
export const projectService = {
  getAllProjects: async (): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProjects), 300);
    });
  },

  getProjectById: async (id: string): Promise<Project | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProjects.find((p) => p.id === id)), 200);
    });
  },

  createProject: async (input: { name: string; key: string; template: ProjectTemplate; description?: string }): Promise<Project> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check for duplicate key
        if (mockProjects.some((p) => p.key.toLowerCase() === input.key.toLowerCase())) {
          reject(new Error('Project key already exists'));
          return;
        }

        const newProject: Project = {
          id: String(mockProjects.length + 1),
          name: input.name,
          key: input.key.toUpperCase(),
          description: input.description,
          template: input.template,
          status: 'active',
          ownerId: '1',
          ownerName: 'John Smith',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          teamMembers: ['1'],
          requirementCount: 0,
        };

        mockProjects.push(newProject);
        resolve(newProject);
      }, 500);
    });
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProjects.findIndex((p) => p.id === id);
        if (index === -1) {
          reject(new Error('Project not found'));
          return;
        }

        mockProjects[index] = {
          ...mockProjects[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        resolve(mockProjects[index]);
      }, 300);
    });
  },

  deleteProject: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockProjects.findIndex((p) => p.id === id);
        if (index !== -1) {
          mockProjects.splice(index, 1);
        }
        resolve();
      }, 300);
    });
  },
};
