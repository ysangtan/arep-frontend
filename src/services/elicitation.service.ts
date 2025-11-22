// src/services/elicitation.service.ts
import api from './api';

// --- Types / DTOs ---
export interface Elicitation {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateElicitationDto {
  projectId: string;
  title: string;
  description?: string;
}

export interface UpdateElicitationDto {
  title?: string;
  description?: string;
  // ✅ allow drag persistence
  column?: 'backlog' | 'in-progress' | 'review' | 'done';
  position?: number;
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

const base = '/elicitation';

// --------- Service ----------
export const ElicitationService = {
  /**
   * GET /elicitation?projectId=...
   */
  async findAll(projectId?: string): Promise<Elicitation[] | ListEnvelope<Elicitation>> {
    const url = projectId ? `${base}?projectId=${projectId}` : base;
    const { data } = await api.get<Elicitation[] | ListEnvelope<Elicitation>>(url);
    return unwrap(data);
  },

  /**
   * GET /elicitation/:id
   */
  async findOne(id: string): Promise<Elicitation> {
    const { data } = await api.get<Elicitation>(`${base}/${id}`);
    return unwrap(data);
  },

  /**
   * POST /elicitation
   */
  async create(dto: CreateElicitationDto): Promise<Elicitation> {
    const { data } = await api.post<Elicitation>(base, dto);
    return unwrap(data);
  },

  /**
   * PATCH /elicitation/:id
   */
  async update(id: string, dto: UpdateElicitationDto): Promise<Elicitation> {
    const { data } = await api.patch<Elicitation>(`${base}/${id}`, dto);
    return unwrap(data);
  },

  /**
   * DELETE /elicitation/:id
   */
  async remove(id: string): Promise<{ deleted: boolean } | Elicitation> {
    const { data } = await api.delete<{ deleted: boolean } | Elicitation>(`${base}/${id}`);
    return unwrap(data);
  },
};

export default ElicitationService;
