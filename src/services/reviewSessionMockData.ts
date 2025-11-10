import { ReviewSession, SessionStatus, Participant } from '@/types/reviewSession.types';

export const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Admin',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Project Manager',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'Business Analyst',
    isOnline: false,
    lastSeen: '2024-03-23T14:30:00Z',
  },
  {
    id: '4',
    name: 'Emily Davis',
    role: 'Developer',
    isOnline: true,
  },
  {
    id: '5',
    name: 'David Wilson',
    role: 'Tester',
    isOnline: false,
    lastSeen: '2024-03-23T13:45:00Z',
  },
];

export const mockReviewSessions: ReviewSession[] = [
  {
    id: '1',
    name: 'Q1 Requirements Review',
    description: 'Review and approve Q1 feature requirements',
    projectId: '1',
    status: 'active',
    requirementIds: ['REQ-001', 'REQ-002', 'REQ-003', 'REQ-004', 'REQ-005'],
    currentRequirementIndex: 1,
    participants: mockParticipants,
    reviews: [
      {
        requirementId: 'REQ-001',
        requirementTitle: 'User Authentication',
        votes: [
          {
            userId: '1',
            userName: 'John Smith',
            voteType: 'approve',
            timestamp: '2024-03-23T15:00:00Z',
          },
          {
            userId: '2',
            userName: 'Sarah Johnson',
            voteType: 'approve',
            timestamp: '2024-03-23T15:00:15Z',
          },
          {
            userId: '4',
            userName: 'Emily Davis',
            voteType: 'needs-discussion',
            timestamp: '2024-03-23T15:00:30Z',
            comment: 'Need clarification on OAuth providers',
          },
        ],
        comments: [
          {
            id: 'c1',
            userId: '4',
            userName: 'Emily Davis',
            content: '@John Smith Should we support both Google and Microsoft OAuth?',
            timestamp: '2024-03-23T15:01:00Z',
            mentions: ['1'],
          },
          {
            id: 'c2',
            userId: '1',
            userName: 'John Smith',
            content: '@Emily Davis Yes, we need both for enterprise clients',
            timestamp: '2024-03-23T15:02:00Z',
            mentions: ['4'],
            replyTo: 'c1',
          },
        ],
        finalDecision: 'approved',
        reviewedAt: '2024-03-23T15:05:00Z',
      },
    ],
    createdBy: '1',
    createdByName: 'John Smith',
    scheduledAt: '2024-03-23T15:00:00Z',
    startedAt: '2024-03-23T15:00:00Z',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-23T15:10:00Z',
  },
  {
    id: '2',
    name: 'Security Requirements Review',
    description: 'Review security-related requirements',
    projectId: '1',
    status: 'scheduled',
    requirementIds: ['REQ-006', 'REQ-007', 'REQ-008'],
    currentRequirementIndex: 0,
    participants: mockParticipants.slice(0, 3),
    reviews: [],
    createdBy: '2',
    createdByName: 'Sarah Johnson',
    scheduledAt: '2024-03-25T14:00:00Z',
    createdAt: '2024-03-23T09:00:00Z',
    updatedAt: '2024-03-23T09:00:00Z',
  },
];

export const reviewSessionService = {
  getAllSessions: async (): Promise<ReviewSession[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockReviewSessions), 300);
    });
  },

  getSessionById: async (id: string): Promise<ReviewSession | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockReviewSessions.find((s) => s.id === id)), 200);
    });
  },

  createSession: async (input: Partial<ReviewSession>): Promise<ReviewSession> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSession: ReviewSession = {
          id: String(mockReviewSessions.length + 1),
          name: input.name || '',
          description: input.description || '',
          projectId: input.projectId || '1',
          status: 'scheduled',
          requirementIds: input.requirementIds || [],
          currentRequirementIndex: 0,
          participants: input.participants || [],
          reviews: [],
          createdBy: '1',
          createdByName: 'Current User',
          scheduledAt: input.scheduledAt,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockReviewSessions.push(newSession);
        resolve(newSession);
      }, 500);
    });
  },

  updateSession: async (id: string, updates: Partial<ReviewSession>): Promise<ReviewSession> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockReviewSessions.findIndex((s) => s.id === id);
        if (index === -1) {
          reject(new Error('Session not found'));
          return;
        }
        mockReviewSessions[index] = {
          ...mockReviewSessions[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(mockReviewSessions[index]);
      }, 300);
    });
  },

  startSession: async (id: string): Promise<ReviewSession> => {
    return reviewSessionService.updateSession(id, {
      status: 'active',
      startedAt: new Date().toISOString(),
    });
  },

  completeSession: async (id: string): Promise<ReviewSession> => {
    return reviewSessionService.updateSession(id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
  },
};
