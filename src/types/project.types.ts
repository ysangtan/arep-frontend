export type ProjectTemplate = 'blank' | 'software-dev' | 'mobile-app' | 'enterprise' | 'api';

export type ProjectStatus = 'active' | 'archived' | 'on-hold';

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  template: ProjectTemplate;
  status: ProjectStatus;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  teamMembers: string[];
  requirementCount: number;
}

export interface CreateProjectInput {
  name: string;
  key: string;
  template: ProjectTemplate;
  description?: string;
}
