import { Requirement, RequirementStatus, RequirementType, Priority } from '@/types/requirement.types';

// Mock requirements data for development
export const mockRequirements: Requirement[] = [
  {
    id: '1',
    reqId: 'REQ-001',
    projectId: 'proj-1',
    title: 'User Authentication System',
    description: 'Implement a secure user authentication system with email/password login, password reset, and session management.',
    type: 'functional',
    status: 'approved',
    priority: 'high',
    acceptanceCriteria: [
      'Users can register with email and password',
      'Users can log in with valid credentials',
      'Users can reset forgotten passwords',
      'Sessions expire after 24 hours of inactivity',
      'Passwords are hashed using bcrypt'
    ],
    tags: ['authentication', 'security', 'user-management'],
    assignee: '2',
    createdBy: '2',
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-15T14:30:00Z',
  },
  {
    id: '2',
    reqId: 'REQ-002',
    projectId: 'proj-1',
    title: 'Dashboard Analytics View',
    description: 'Create a dashboard showing key metrics including total requirements, pending reviews, approval rate, and recent activity feed.',
    type: 'functional',
    status: 'in-review',
    priority: 'medium',
    acceptanceCriteria: [
      'Display 4 stat cards at the top',
      'Show recent activity in chronological order',
      'Include charts for requirements by status',
      'Update data in real-time'
    ],
    tags: ['dashboard', 'analytics', 'ui'],
    assignee: '1',
    createdBy: '2',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-18T11:00:00Z',
  },
  {
    id: '3',
    reqId: 'REQ-003',
    projectId: 'proj-1',
    title: 'Performance Optimization - Page Load Time',
    description: 'Optimize application performance to ensure pages load within 2 seconds on standard broadband connection.',
    type: 'non-functional',
    status: 'draft',
    priority: 'high',
    acceptanceCriteria: [
      'Homepage loads in under 2 seconds',
      'Dashboard loads in under 3 seconds',
      'Code splitting implemented for routes',
      'Images are lazy loaded',
      'Bundle size under 500KB'
    ],
    tags: ['performance', 'optimization'],
    assignee: '1',
    createdBy: '1',
    createdAt: '2025-01-12T15:00:00Z',
    updatedAt: '2025-01-12T15:00:00Z',
  },
  {
    id: '4',
    reqId: 'REQ-004',
    projectId: 'proj-1',
    title: 'Email Notification System',
    description: 'Send email notifications to users for important events like review assignments, status changes, and mentions.',
    type: 'functional',
    status: 'implemented',
    priority: 'medium',
    acceptanceCriteria: [
      'Emails sent within 1 minute of event',
      'Users can configure notification preferences',
      'Email templates are branded',
      'Includes unsubscribe link'
    ],
    tags: ['notifications', 'email', 'communication'],
    createdBy: '2',
    createdAt: '2025-01-08T12:00:00Z',
    updatedAt: '2025-01-20T16:00:00Z',
  },
  {
    id: '5',
    reqId: 'REQ-005',
    projectId: 'proj-1',
    title: 'WCAG 2.1 AA Compliance',
    description: 'Ensure application meets WCAG 2.1 Level AA accessibility standards for users with disabilities.',
    type: 'constraint',
    status: 'in-review',
    priority: 'high',
    acceptanceCriteria: [
      'All interactive elements keyboard accessible',
      'Color contrast ratio meets 4.5:1 minimum',
      'ARIA labels on all UI components',
      'Screen reader compatible',
      'Focus indicators visible'
    ],
    tags: ['accessibility', 'compliance', 'a11y'],
    assignee: '1',
    createdBy: '2',
    createdAt: '2025-01-14T10:00:00Z',
    updatedAt: '2025-01-19T09:00:00Z',
  },
  {
    id: '6',
    reqId: 'REQ-006',
    projectId: 'proj-1',
    title: 'Requirement Version History',
    description: 'Track and display all changes made to requirements with ability to view and compare previous versions.',
    type: 'functional',
    status: 'approved',
    priority: 'medium',
    acceptanceCriteria: [
      'Every edit creates a new version',
      'Users can view version history',
      'Compare any two versions side-by-side',
      'Show who made changes and when'
    ],
    tags: ['versioning', 'audit', 'history'],
    assignee: '1',
    createdBy: '2',
    createdAt: '2025-01-11T14:00:00Z',
    updatedAt: '2025-01-17T10:30:00Z',
  },
  {
    id: '7',
    reqId: 'REQ-007',
    projectId: 'proj-1',
    title: 'Comment Threading on Requirements',
    description: 'Allow users to add comments on requirements with support for threaded replies and @mentions.',
    type: 'functional',
    status: 'draft',
    priority: 'low',
    acceptanceCriteria: [
      'Users can add top-level comments',
      'Users can reply to comments (1 level deep)',
      '@mention functionality works',
      'Mentioned users receive notifications',
      'Comments show timestamp and author'
    ],
    tags: ['collaboration', 'comments', 'communication'],
    createdBy: '2',
    createdAt: '2025-01-16T11:00:00Z',
    updatedAt: '2025-01-16T11:00:00Z',
  },
  {
    id: '8',
    reqId: 'REQ-008',
    projectId: 'proj-1',
    title: 'Export Requirements to Excel',
    description: 'Provide functionality to export requirements data to Excel format with all fields and filters applied.',
    type: 'functional',
    status: 'rejected',
    priority: 'low',
    acceptanceCriteria: [
      'Export button available on requirements table',
      'All visible columns included in export',
      'Filters and search applied to export',
      'File downloads as .xlsx format'
    ],
    tags: ['export', 'excel', 'reporting'],
    createdBy: '2',
    validationWarnings: ['Consider PDF export as well', 'Need to specify maximum row limit'],
    createdAt: '2025-01-13T13:00:00Z',
    updatedAt: '2025-01-18T15:00:00Z',
  },
  {
    id: '9',
    reqId: 'REQ-009',
    projectId: 'proj-1',
    title: 'Two-Factor Authentication',
    description: 'Add optional two-factor authentication using SMS or authenticator app for enhanced security.',
    type: 'functional',
    status: 'approved',
    priority: 'high',
    acceptanceCriteria: [
      'SMS code sent within 30 seconds',
      'Authenticator app QR code displayed',
      'Code expires after 5 minutes',
      'Max 3 retry attempts',
      'Account locked for 15 minutes after 3 failed attempts'
    ],
    tags: ['security', 'authentication', '2fa'],
    assignee: '1',
    createdBy: '2',
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-21T14:00:00Z',
  },
  {
    id: '10',
    reqId: 'REQ-010',
    projectId: 'proj-1',
    title: 'API Rate Limiting',
    description: 'Implement rate limiting on all API endpoints to prevent abuse and ensure fair usage.',
    type: 'constraint',
    status: 'in-review',
    priority: 'medium',
    acceptanceCriteria: [
      'Limit of 100 requests per minute per user',
      'Return 429 status when limit exceeded',
      'Include rate limit headers in response',
      'Whitelist for admin users'
    ],
    tags: ['api', 'security', 'rate-limiting'],
    assignee: '1',
    createdBy: '1',
    createdAt: '2025-01-17T10:00:00Z',
    updatedAt: '2025-01-20T12:00:00Z',
  },
];

// Helper function to get requirement by ID
export function getRequirementById(id: string): Requirement | undefined {
  return mockRequirements.find(req => req.id === id);
}

// Helper function to filter requirements
export function filterRequirements(
  requirements: Requirement[],
  filters: {
    search?: string;
    status?: RequirementStatus[];
    type?: RequirementType[];
    priority?: Priority[];
    tags?: string[];
  }
): Requirement[] {
  let filtered = [...requirements];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      req =>
        req.reqId.toLowerCase().includes(searchLower) ||
        req.title.toLowerCase().includes(searchLower) ||
        req.description.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(req => filters.status!.includes(req.status));
  }

  // Type filter
  if (filters.type && filters.type.length > 0) {
    filtered = filtered.filter(req => filters.type!.includes(req.type));
  }

  // Priority filter
  if (filters.priority && filters.priority.length > 0) {
    filtered = filtered.filter(req => filters.priority!.includes(req.priority));
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(req =>
      filters.tags!.some(tag => req.tags.includes(tag))
    );
  }

  return filtered;
}

// Get all unique tags
export function getAllTags(): string[] {
  const tagsSet = new Set<string>();
  mockRequirements.forEach(req => {
    req.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
}
