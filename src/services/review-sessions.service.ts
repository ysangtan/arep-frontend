// src/services/review-sessions.service.ts
import api from "./api";

// ---------- Enums (match backend string literals) ----------
export enum SessionStatus {
  SCHEDULED = "scheduled",
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
}

export enum VoteType {
  APPROVE = "approve",
  REJECT = "reject",
  NEEDS_DISCUSSION = "needs-discussion",
}

// ---------- Subdocuments ----------
export interface Participant {
  userId: string; // ObjectId as string on FE
  isOnline?: boolean;
  lastSeen?: string | Date;
}

export interface RequirementReview {
  requirementId: string; // ObjectId as string
  finalDecision?: "approved" | "rejected" | "deferred";
  reviewedAt?: string | Date;
}

// ---------- Main Models ----------
export interface ReviewSession {
  _id: string;
  name: string;
  description?: string;
  projectId: string;
  status: SessionStatus;
  requirementIds: string[];
  currentRequirementIndex: number;
  participants: Participant[];
  reviews: RequirementReview[];
  createdBy: string;
  scheduledAt?: string | Date;
  startedAt?: string | Date;
  completedAt?: string | Date;
  createdAt: string; // ISO strings from backend
  updatedAt: string;
}

export interface SessionVote {
  _id: string;
  sessionId: string;
  requirementId: string;
  userId: string;
  voteType: VoteType;
  comment?: string;
  createdAt: string;
  // updatedAt exists via timestamps, but schema only shows createdAt explicitly
  updatedAt?: string;
}

// ---------- DTOs ----------
export interface CreateReviewSessionDto {
  name: string;
  projectId: string;
  description?: string;
  requirementIds?: string[];
  scheduledAt?: string | Date;
  // Optional initial participants; backend may enrich
  participants?: { userId: string }[];
  // status omitted – server defaults to 'scheduled'
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

const base = "/review-sessions";

// ---------- Service ----------
export const ReviewSessionsService = {
  /**
   * GET /review-sessions?projectId=...
   */
  async findAll(
    projectId?: string
  ): Promise<ReviewSession[] | ListEnvelope<ReviewSession>> {
    const url = projectId
      ? `${base}?projectId=${encodeURIComponent(projectId)}`
      : base;

    const { data } = await api.get<
      ReviewSession[] | ListEnvelope<ReviewSession>
    >(url);
    return unwrap(data);
  },

  /**
   * GET /review-sessions/:id
   */
  async findOne(id: string): Promise<ReviewSession> {
    const { data } = await api.get<ReviewSession>(`${base}/${id}`);
    return unwrap(data);
  },

  /**
   * GET /review-sessions/:id/votes?requirementId=...
   * Returns SessionVote[] or a paginated envelope depending on backend.
   */
  async getVotes(
    sessionId: string,
    requirementId?: string
  ): Promise<SessionVote[] | ListEnvelope<SessionVote>> {
    const url = requirementId
      ? `${base}/${encodeURIComponent(
          sessionId
        )}/votes?requirementId=${encodeURIComponent(requirementId)}`
      : `${base}/${encodeURIComponent(sessionId)}/votes`;

    const { data } = await api.get<SessionVote[] | ListEnvelope<SessionVote>>(
      url
    );
    return unwrap(data);
  },

  /**
   * POST /review-sessions
   * createdBy is injected server-side from JWT (@CurrentUser)
   */
  async create(dto: CreateReviewSessionDto): Promise<ReviewSession> {
    const { data } = await api.post<ReviewSession>(base, dto);
    return unwrap(data);
  },

  /**
   * PATCH /review-sessions/:id/start
   */
  async startSession(id: string): Promise<ReviewSession> {
    const { data } = await api.patch<ReviewSession>(
      `${base}/${encodeURIComponent(id)}/start`,
      {}
    );
    return unwrap(data);
  },
  // Keep everything else as you have it; just make castVote typed & consistent
  async castVote(
    sessionId: string,
    requirementId: string,
    voteType: VoteType | string,
    comment?: string
  ): Promise<SessionVote> {
    console.log("[ReviewSessionsService] POST castVote", {
      sessionId,
      requirementId,
      voteType,
      comment,
    });
    const { data } = await api.post<SessionVote>(
      `/review-sessions/${encodeURIComponent(sessionId)}/votes`,
      { requirementId, voteType, comment }
    );
    return data;
  },
  async endSession(id: string) {
    const { data } = await api.patch(`${base}/${id}/end`);
    return unwrap(data);
  },
};

export default ReviewSessionsService;
