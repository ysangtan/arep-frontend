import api from './api'; 
import type { AxiosProgressEvent } from 'axios';

export enum RequirementType {
  FUNCTIONAL = 'functional',
  NON_FUNCTIONAL = 'non-functional',
  CONSTRAINT = 'constraint',
  BUSINESS_RULE = 'business-rule',
}

export enum RequirementStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in-review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IMPLEMENTED = 'implemented',
  VERIFIED = 'verified',
  CLOSED = 'closed',
}

export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface Attachment {
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: string; // ISO from backend Date
}

export interface VersionHistory {
  version: number;
  changes: Record<string, any>;
  modifiedBy: string; // userId (ObjectId string)
  modifiedAt: string; // ISO
}

export interface Requirement {
  _id: string;
  reqId: string;
  projectId: string;
  title: string;
  description: string;
  type: RequirementType;
  status: RequirementStatus;
  priority: Priority;
  acceptanceCriteria: string[];
  tags: string[];
  assigneeId?: string;
  createdBy: string;
  attachments: Attachment[];
  versionHistory: VersionHistory[];
  validationWarnings: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------- DTOs (mirror backend) ----------
export interface CreateRequirementDto {
  projectId: string;
  title: string;              // 5..200
  description: string;        // >=10
  type: RequirementType;
  priority?: Priority;
  acceptanceCriteria?: string[];
  tags?: string[];
  assigneeId?: string;
}

export interface UpdateRequirementDto {
  title?: string;             // 5..200
  description?: string;       // >=10
  status?: RequirementStatus;
  priority?: Priority;
  acceptanceCriteria?: string[];
  tags?: string[];
  assigneeId?: string;
}

export interface FilterRequirementDto {
  projectId?: string;
  status?: RequirementStatus;
  priority?: Priority;
  type?: RequirementType;
  assigneeId?: string;
  tags?: string;   // backend expects string (e.g., "foo,bar")
  search?: string; // backend text filter
  // Optional common list params if you support them in the API (safe to pass; backend can ignore)
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

// ---------- Helpers ----------
const toQuery = (params: Record<string, unknown> = {}) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');

    
    

type ApiWrap<T> = { success?: boolean; data: T; message?: string };

function unwrap<T>(payload: T | ApiWrap<T>): T {
  return (payload as any)?.data ?? (payload as T);
}
const base = '/requirements';

// If your backend returns a paginated envelope, define it here and swap in below as needed.
export interface ListEnvelope<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ---------- Service ----------
export const RequirementsService = {
  // GET /requirements
  // If your backend returns an array, keep Requirement[].
  // If it returns a paginated envelope, change <Requirement[]> to <ListEnvelope<Requirement>>.
  async findAll(filter: FilterRequirementDto = {}): Promise<Requirement[] | ListEnvelope<Requirement>> {
    const qs = toQuery(filter);
    const { data } = await api.get<Requirement[] | ListEnvelope<Requirement>>(`${base}${qs ? `?${qs}` : ''}`);
    return unwrap(data);
  },

  // GET /requirements/search?projectId=...&q=...
  async search(projectId: string, q: string): Promise<Requirement[]> {
    const qs = toQuery({ projectId, q });
    const { data } = await api.get<Requirement[]>(`${base}/search?${qs}`);
    return data;
  },

  // GET /requirements/:id
  async findOne(id: string): Promise<Requirement> {
    const { data } = await api.get<Requirement>(`${base}/${id}`);
    return data;
  },

  // POST /requirements
  async create(dto: CreateRequirementDto): Promise<Requirement> {
    const { data } = await api.post<Requirement>(base, dto);
    return data;
  },

  // PATCH /requirements/:id
  async update(id: string, dto: UpdateRequirementDto): Promise<Requirement> {
    const { data } = await api.patch<Requirement>(`${base}/${id}`, dto);
    return data;
  },

  // DELETE /requirements/:id
  async remove(id: string): Promise<{ deleted: boolean } | Requirement> {
    // Some APIs return a boolean, others return the deleted entity—type to union to be safe
    const { data } = await api.delete<{ deleted: boolean } | Requirement>(`${base}/${id}`);
    return data;
  },

  // POST /requirements/:id/attachments   (multipart/form-data, field: "file")
  async uploadAttachment(
    id: string,
    file: File,
    onUploadProgress?: (e: AxiosProgressEvent) => void
  ): Promise<Requirement> {
    const form = new FormData();
    form.append('file', file);

    const { data } = await api.post<Requirement>(`${base}/${id}/attachments`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return data;
  },

  // DELETE /requirements/:id/attachments/:attachmentIndex
  async removeAttachment(id: string, attachmentIndex: number): Promise<Requirement> {
    const { data } = await api.delete<Requirement>(`${base}/${id}/attachments/${attachmentIndex}`);
    return data;
  },
};

export default RequirementsService;
