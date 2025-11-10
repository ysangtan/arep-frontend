import { Review, ReviewComment } from '@/types/review.types';

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    requirementId: '2',
    requirementTitle: 'Dashboard Analytics View',
    requirementReqId: 'REQ-002',
    type: 'individual',
    reviewers: ['1', '3'],
    status: 'pending',
    dueDate: '2025-01-25T17:00:00Z',
    decisions: [],
    createdBy: '2',
    createdAt: '2025-01-18T11:00:00Z',
  },
  {
    id: 'review-2',
    requirementId: '5',
    requirementTitle: 'WCAG 2.1 AA Compliance',
    requirementReqId: 'REQ-005',
    type: 'individual',
    reviewers: ['1', '3'],
    status: 'in-progress',
    dueDate: '2025-01-24T17:00:00Z',
    decisions: [],
    createdBy: '2',
    createdAt: '2025-01-19T09:00:00Z',
  },
  {
    id: 'review-3',
    requirementId: '10',
    requirementTitle: 'API Rate Limiting',
    requirementReqId: 'REQ-010',
    type: 'individual',
    reviewers: ['1'],
    status: 'pending',
    dueDate: '2025-01-26T17:00:00Z',
    decisions: [],
    createdBy: '1',
    createdAt: '2025-01-20T12:00:00Z',
  },
  {
    id: 'review-4',
    requirementId: '1',
    requirementTitle: 'User Authentication System',
    requirementReqId: 'REQ-001',
    type: 'individual',
    reviewers: ['1', '3'],
    status: 'completed',
    decisions: ['approve', 'approve'],
    createdBy: '2',
    createdAt: '2025-01-10T10:00:00Z',
    completedAt: '2025-01-15T14:30:00Z',
  },
];

export const mockReviewComments: ReviewComment[] = [
  {
    id: 'comment-1',
    reviewId: 'review-2',
    userId: '1',
    userName: 'Admin User',
    content: 'The acceptance criteria for screen reader compatibility needs more specific examples. Can you list which screen readers we should test with?',
    createdAt: '2025-01-19T14:00:00Z',
  },
  {
    id: 'comment-2',
    reviewId: 'review-2',
    userId: '2',
    userName: 'Emily Johnson',
    content: 'Good point! We should test with JAWS, NVDA, and VoiceOver as the primary screen readers.',
    createdAt: '2025-01-19T15:30:00Z',
    parentId: 'comment-1',
  },
  {
    id: 'comment-3',
    reviewId: 'review-2',
    userId: '3',
    userName: 'Carlos Martinez',
    content: 'The color contrast ratio requirement is clear. Have we documented which color combinations pass the 4.5:1 test?',
    createdAt: '2025-01-20T09:00:00Z',
  },
];

export function getReviewsByUser(userId: string): Review[] {
  return mockReviews.filter(review => review.reviewers.includes(userId));
}

export function getReviewById(id: string): Review | undefined {
  return mockReviews.find(review => review.id === id);
}

export function getCommentsByReview(reviewId: string): ReviewComment[] {
  return mockReviewComments.filter(comment => comment.reviewId === reviewId);
}
