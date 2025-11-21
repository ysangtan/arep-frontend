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

function surfaceError(err: unknown): never {
  // Axios-style errors or generic ones; rethrow a readable message
  const anyErr = err as any;
  const msg =
    anyErr?.response?.data?.message ??
    anyErr?.message ??
    'Request failed';
  throw new Error(msg);
}

const base = '/projects';

// --------- Service ----------
export const ProjectsService = {
  /**
   * GET /projects
   * Returns projects for the current user (derived from JWT via @CurrentUser).
   */
  async findAll(): Promise<Project[] | ListEnvelope<Project>> {
    try {
      const { data } = await api.get<Project[] | ListEnvelope<Project>>(base);
      return unwrap(data);
    } catch (err) {
      surfaceError(err);
    }
  },

  /**
   * GET /projects/:id
   */
  async findOne(id: string): Promise<Project> {
    try {
      const { data } = await api.get<Project | ApiWrap<Project>>(`${base}/${encodeURIComponent(id)}`);
      return unwrap(data);
    } catch (err) {
      surfaceError(err);
    }
  },

  /**
   * POST /projects
   * Note: ownerId is set on the server via @CurrentUser.
   */
  async create(dto: CreateProjectDto): Promise<Project> {
    try {
      const { data } = await api.post<Project | ApiWrap<Project>>(base, dto);
      return unwrap(data);
    } catch (err) {
      surfaceError(err);
    }
  },

  /**
   * PATCH /projects/:id
   */
  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    try {
      const { data } = await api.patch<Project | ApiWrap<Project>>(
        `${base}/${encodeURIComponent(id)}`,
        dto
      );
      return unwrap(data);
    } catch (err) {
      surfaceError(err);
    }
  },

  /**
   * DELETE /projects/:id
   * Some backends return the deleted entity; others return { deleted: true }.
   */
  async remove(id: string): Promise<{ deleted: boolean } | Project> {
    try {
      const { data } = await api.delete<{ deleted: boolean } | Project | ApiWrap<{ deleted: boolean } | Project>>(
        `${base}/${encodeURIComponent(id)}`
      );
      return unwrap(data);
    } catch (err) {
      surfaceError(err);
    }
  },

  /**
   * POST /projects/:id/members
   */
  async addMember(id: string, userId: string): Promise<Project> {
    try {
      const payload: AddMemberDto = { userId };
      const { data } = await api.post<Project | ApiWrap<Project>>(
        `${base}/${encodeURIComponent(id)}/members`,
        payload
      );
      return unwrap(data);
    } catch (err) {
      surfaceError(err);
    }
  },

  /**
   * DELETE /projects/:id/members/:userId
   */
  async removeMember(id: string, userId: string): Promise<Project> {
    try {
      const { data } = await api.delete<Project | ApiWrap<Project>>(
        `${base}/${encodeURIComponent(id)}/members/${encodeURIComponent(userId)}`
      );
      return unwrap(data);
    } catch (err) {
      surfaceError(err);
    }
  },
};

export default ProjectsService;
