// src/services/users.service.ts
import api from './api';

// -------- Enums (mirror backend) --------
export enum AppRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project-manager',
  BUSINESS_ANALYST = 'business-analyst',
  DEVELOPER = 'developer',
  TESTER = 'tester',
  STAKEHOLDER = 'stakeholder',
  REVIEWER = 'reviewer',
  VIEWER = 'viewer',
}

// -------- Models (client view; no password in responses) --------
export interface User {
  _id: string;
  email: string;
  fullName: string;
  avatar?: string;
  timezone: string;               // default 'UTC'
  theme: 'light' | 'dark' | 'system';
  lastLogin?: string | Date;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // refreshToken is server-side hashed/optional; typically not returned
  refreshToken?: string | null;
}

export interface UserRole {
  _id: string;
  userId: string;
  role: AppRole;
  assignedBy?: string;
  assignedAt?: string | Date;
  createdAt: string;
  updatedAt: string;
}

// -------- DTOs (mirror backend DTOs) --------
export interface CreateUserDto {
  email: string;
  password: string;               // will be hashed on server
  fullName: string;
  avatar?: string;
  timezone?: string;
}

export interface UpdateUserDto {
  fullName?: string;
  avatar?: string;
  timezone?: string;
  theme?: 'light' | 'dark' | 'system' | string;
  isActive?: boolean;
  refreshToken?: string | null;
}

export interface AssignRoleDto {
  userId: string;
  role: AppRole;
}

// -------- Optional list envelope --------
export interface ListEnvelope<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// -------- API helpers --------
type ApiWrap<T> = { success?: boolean; data: T; message?: string };

function unwrap<T>(payload: T | ApiWrap<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

const base = '/users';

// -------- Service --------
export const UsersService = {
  /**
   * GET /users
   * Roles: ADMIN, PROJECT_MANAGER
   */
  async findAll(): Promise<User[] | ListEnvelope<User>> {
    const { data } = await api.get<User[] | ListEnvelope<User>>(base);
    return unwrap(data);
  },

  /**
   * GET /users/me
   * Current authenticated user
   */
  async getMe(): Promise<User> {
    const { data } = await api.get<User>(`${base}/me`);
    return unwrap(data);
  },

  /**
   * GET /users/:id
   * Roles: ADMIN, PROJECT_MANAGER
   */
  async findOne(id: string): Promise<User> {
    const { data } = await api.get<User>(`${base}/${encodeURIComponent(id)}`);
    return unwrap(data);
  },

  /**
   * POST /users
   * Role: ADMIN
   */
  async create(dto: CreateUserDto): Promise<User> {
    const { data } = await api.post<User>(base, dto);
    return unwrap(data);
  },

  /**
   * PATCH /users/:id
   * Role: ADMIN
   */
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const { data } = await api.patch<User>(`${base}/${encodeURIComponent(id)}`, dto);
    return unwrap(data);
  },

  /**
   * DELETE /users/:id
   * Role: ADMIN
   */
  async remove(id: string): Promise<{ deleted: boolean } | User> {
    const { data } = await api.delete<{ deleted: boolean } | User>(`${base}/${encodeURIComponent(id)}`);
    return unwrap(data);
  },

  /**
   * POST /users/roles
   * Role: ADMIN
   * Returns updated User or a UserRole based on backend; type it as unknown and unwrap to either.
   */
  async assignRole(
    dto: AssignRoleDto
  ): Promise<User | UserRole | { success: boolean; message?: string }> {
    const { data } = await api.post<User | UserRole | { success: boolean; message?: string }>(
      `${base}/roles`,
      dto
    );
    return unwrap(data);
  },
};

export default UsersService;
