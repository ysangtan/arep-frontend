export type VoteType = 'approve' | 'reject' | 'needs-discussion';

export type SessionStatus = 'scheduled' | 'active' | 'paused' | 'completed';

export interface Participant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Vote {
  userId: string;
  userName: string;
  voteType: VoteType;
  timestamp: string;
  comment?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  mentions?: string[]; // User IDs mentioned
  replyTo?: string; // Comment ID being replied to
}

export interface RequirementReview {
  requirementId: string;
  requirementTitle: string;
  votes: Vote[];
  comments: Comment[];
  finalDecision?: 'approved' | 'rejected' | 'deferred';
  reviewedAt?: string;
}

export interface ReviewSession {
  id: string;
  name: string;
  description: string;
  projectId: string;
  status: SessionStatus;
  requirementIds: string[];
  currentRequirementIndex: number;
  participants: Participant[];
  reviews: RequirementReview[];
  createdBy: string;
  createdByName: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionSummary {
  sessionId: string;
  sessionName: string;
  totalRequirements: number;
  reviewed: number;
  approved: number;
  rejected: number;
  deferred: number;
  duration: number; // in minutes
  participantCount: number;
  averageVotesPerRequirement: number;
  totalComments: number;
}
