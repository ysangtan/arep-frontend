// src/services/reviews.service.ts
import api from "./api";

// ---------- Enums (match backend string literals) ----------
export enum ReviewStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export enum ReviewDecision {
  APPROVE = "approve",
  REJECT = "reject",
  DEFER = "defer",
}

export enum ReviewType {
  INDIVIDUAL = "individual",
  FACILITATED_SESSION = "facilitated-session",
}

// ---------- Subdocuments ----------
export interface Reviewer {
  userId: string; // ObjectId (as string on FE)
  decision?: ReviewDecision;
  completedAt?: string | Date;
}

export interface ReviewChecklist {
  clearAndUnambiguous?: boolean;
  testable?: boolean;
  feasible?: boolean;
  complete?: boolean;
  consistent?: boolean;
}

// ---------- Main Models ----------
export interface Review {
  _id: string;
  requirementId: string; // ObjectId (as string)
  type: ReviewType;
  status: ReviewStatus;
  reviewers: Reviewer[];
  dueDate?: string | Date;
  checklist?: ReviewChecklist;
  createdBy: string; // ObjectId (as string)
  completedAt?: string | Date;
  createdAt: string; // ISO string from backend
  updatedAt: string; // ISO string from backend
}

export interface ReviewComment {
  _id: string;
  reviewId: string;
  userId: string;
  content: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  // Optional UI helper for threaded trees
  children?: ReviewComment[];
}

// ---------- DTOs ----------
export interface CreateReviewDto {
  requirementId: string;
  type: ReviewType;
  // Optional fields (backend sets createdBy from JWT)
  reviewers?: { userId: string }[]; // decisions typically come later
  dueDate?: string | Date;
  checklist?: ReviewChecklist;
}

export interface AddCommentDto {
  content: string;
  parentId?: string;
}

export interface ListEnvelope<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ---------- API helpers ----------
type ApiWrap<T> = { success?: boolean; data: T; message?: string };

function unwrap<T>(payload: T | ApiWrap<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

const base = "/reviews";

// ---------- Service ----------
export const ReviewsService = {
  /**
   * GET /reviews?requirementId=...
   * Returns Review[] or a paginated envelope depending on backend.
   */
  async findAll(
    requirementId?: string
  ): Promise<Review[] | ListEnvelope<Review>> {
    const url = requirementId
      ? `${base}?requirementId=${encodeURIComponent(requirementId)}`
      : base;

    const { data } = await api.get<Review[] | ListEnvelope<Review>>(url);
    return unwrap(data);
  },

  /**
   * GET /reviews/:id
   */
  async findOne(id: string): Promise<Review> {
    const { data } = await api.get<Review>(`${base}/${id}`);
    return unwrap(data);
  },

  /**
   * GET /reviews/:id/comments
   * Returns ReviewComment[] or a paginated envelope.
   */
  async getComments(
    id: string
  ): Promise<ReviewComment[] | ListEnvelope<ReviewComment>> {
    const { data } = await api.get<
      ReviewComment[] | ListEnvelope<ReviewComment>
    >(`${base}/${id}/comments`);
    return unwrap(data);
  },

  /**
   * POST /reviews
   * createdBy is injected on the server using @CurrentUser
   */
  async create(dto: CreateReviewDto): Promise<Review> {
    const { data } = await api.post<Review>(base, dto);
    return unwrap(data);
  },

  /**
   * POST /reviews/:id/comments
   */
  async addComment(id: string, dto: AddCommentDto): Promise<ReviewComment> {
    const { data } = await api.post<ReviewComment>(
      `${base}/${id}/comments`,
      dto
    );
    return unwrap(data);
  },

 
};

export default ReviewsService;
