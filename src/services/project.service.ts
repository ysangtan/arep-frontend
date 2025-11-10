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

// --- Types ---
export interface ProjectMember {
  userId: string;
  role?: string;
  joinedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  key: string; // required on backend
  description?: string;
  template?: ProjectTemplate;
  status?: ProjectStatus;
  ownerId: string;
  members?: ProjectMember[];
  requirementCount?: number;
  createdAt: string;
  updatedAt: string;
}

// --- DTOs (mirror backend DTOs exactly) ---
export interface CreateProjectDto {
  name: string;
  key: string; // required
  description?: string;
  template?: ProjectTemplate; // optional on backend
  status?: ProjectStatus;     // optional on backend
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;     // optional on backend
}

export interface AddMemberDto {
  userId: string;
}

export interface ListEnvelope<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

type ApiWrap<T> = { success?: boolean; data: T; message?: string };

function unwrap<T>(payload: T | ApiWrap<T>): T {
  return (payload as any)?.data ?? (payload as T);
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
    return unwrap(data);
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
