export type ReviewStatus = 'pending' | 'in-progress' | 'completed';
export type ReviewDecision = 'approve' | 'reject' | 'defer';
export type ReviewType = 'individual' | 'facilitated-session';

export interface Review {
  id: string;
  requirementId: string;
  requirementTitle: string;
  requirementReqId: string;
  type: ReviewType;
  reviewers: string[]; // User IDs
  status: ReviewStatus;
  dueDate?: string;
  decisions: ReviewDecision[];
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export interface ReviewComment {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  parentId?: string; // For threaded comments
}

export interface ReviewChecklist {
  clearAndUnambiguous: boolean;
  testable: boolean;
  feasible: boolean;
  complete: boolean;
  consistent: boolean;
}

export interface FacilitatedSessionVote {
  userId: string;
  vote: 'approve' | 'reject' | 'needs-discussion';
  timestamp: string;
}
