// src/services/projects.service.ts
import api from './api';

// --------- Enums (mirror backend schema) ----------
export enum ProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  ON_HOLD = 'on-hold',
}

export enum ProjectTemplate {
  BLANK = 'blank',
  SOFTWARE_DEV = 'software-dev',
  MOBILE_APP = 'mobile-app',
  ENTERPRISE = 'enterprise',
  API = 'api',
}

// --------- Types ----------
export interface ProjectMember {
  userId: string;
  role?: string;
  joinedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  key?: string;
  description?: string;
  ownerId: string;
  template?: ProjectTemplate;
  status?: ProjectStatus;
  members?: ProjectMember[];
  requirementCount?: number;
  createdAt: string;
  updatedAt: string;
}

// --------- Types (adjust to your actual schema as needed) ----------
export interface ProjectMember {
  userId: string;
  role?: string;          // e.g. "member", "manager" (optional—depends on your model)
  joinedAt?: string;      // ISO string
}

export interface Project {
  _id: string;
  name: string;
  key?: string;           // e.g., "ECP"
  description?: string;
  ownerId: string;
  members?: ProjectMember[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  // add any other fields your schema returns
}

// Create/Update DTOs — mirror your backend DTOs
export interface CreateProjectDto {
  name: string;
  key?: string;
  description?: string;
  tags?: string[];
  // ownerId is set server-side from @CurrentUser in controller
}

export interface UpdateProjectDto {
  name?: string;
  key?: string;
  description?: string;
  tags?: string[];
}

export interface AddMemberDto {
  userId: string;
}

// Optional pagination envelope (if you later switch to paginated lists)
export interface ListEnvelope<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

const base = '/projects';

// --------- Service ----------
export const ProjectsService = {
  /**
   * GET /projects
   * Returns projects for the current user (derived from JWT via @CurrentUser).
   */
  async findAll(): Promise<Project[] | ListEnvelope<Project>> {
    const { data } = await api.get<Project[] | ListEnvelope<Project>>(base);
    return data;
  },

  /**
   * GET /projects/:id
   */
  async findOne(id: string): Promise<Project> {
    const { data } = await api.get<Project>(`${base}/${id}`);
    return data;
  },

  /**
   * POST /projects
   * Note: ownerId is set on the server via @CurrentUser.
   */
  async create(dto: CreateProjectDto): Promise<Project> {
    const { data } = await api.post<Project>(base, dto);
    return data;
  },

  /**
   * PATCH /projects/:id
   */
  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const { data } = await api.patch<Project>(`${base}/${id}`, dto);
    return data;
  },

  /**
   * DELETE /projects/:id
   */
  async remove(id: string): Promise<{ deleted: boolean } | Project> {
    const { data } = await api.delete<{ deleted: boolean } | Project>(`${base}/${id}`);
    return data;
  },

  /**
   * POST /projects/:id/members
   */
  async addMember(id: string, userId: string): Promise<Project> {
    const payload: AddMemberDto = { userId };
    const { data } = await api.post<Project>(`${base}/${id}/members`, payload);
    return data;
  },

  /**
   * DELETE /projects/:id/members/:userId
   */
  async removeMember(id: string, userId: string): Promise<Project> {
    const { data } = await api.delete<Project>(`${base}/${id}/members/${userId}`);
    return data;
  },
};

export default ProjectsService;
