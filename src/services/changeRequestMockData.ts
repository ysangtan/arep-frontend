import { ChangeRequest, ImpactAnalysis } from '@/types/changeRequest.types';

export const mockImpactAnalyses: Record<string, ImpactAnalysis> = {
  'CR-001': {
    changeRequestId: 'CR-001',
    affectedRequirements: [
      {
        requirementId: 'REQ-001',
        title: 'User Authentication',
        impactType: 'direct',
        changeDescription: 'Add OAuth2.0 support alongside existing authentication',
      },
      {
        requirementId: 'REQ-002',
        title: 'Dashboard',
        impactType: 'indirect',
        changeDescription: 'Update user profile display to support OAuth providers',
      },
    ],
    impactedArtifacts: [
      {
        artifactType: 'code',
        artifactId: 'CODE-001',
        artifactName: 'AuthService.ts',
        estimatedEffort: 8,
      },
      {
        artifactType: 'code',
        artifactId: 'CODE-002',
        artifactName: 'UserProfile.tsx',
        estimatedEffort: 4,
      },
      {
        artifactType: 'test',
        artifactId: 'TEST-001',
        artifactName: 'Auth Test Suite',
        estimatedEffort: 6,
      },
      {
        artifactType: 'doc',
        artifactId: 'DOC-001',
        artifactName: 'Authentication Documentation',
        estimatedEffort: 3,
      },
    ],
    dependencyCount: 4,
    effortEstimation: {
      analysis: 4,
      development: 16,
      testing: 8,
      documentation: 4,
      total: 32,
    },
    risks: [
      {
        id: 'risk-1',
        type: 'technical',
        description: 'Integration with third-party OAuth providers may have rate limits',
        level: 'medium',
        mitigation: 'Implement proper error handling and fallback mechanisms',
      },
      {
        id: 'risk-2',
        type: 'schedule',
        description: 'OAuth integration complexity may extend timeline',
        level: 'medium',
        mitigation: 'Start with one provider (Google) before adding others',
      },
      {
        id: 'risk-3',
        type: 'dependency',
        description: 'Requires coordination with security team for review',
        level: 'low',
        mitigation: 'Schedule security review early in the development cycle',
      },
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Phased Implementation',
        description: 'Implement OAuth providers one at a time, starting with Google',
        priority: 'high',
      },
      {
        id: 'rec-2',
        title: 'Backward Compatibility',
        description: 'Ensure existing authentication continues to work during migration',
        priority: 'high',
      },
      {
        id: 'rec-3',
        title: 'Security Audit',
        description: 'Schedule security team review before going to production',
        priority: 'medium',
      },
    ],
    overallImpact: 'medium',
    analyzedAt: '2024-03-20T10:00:00Z',
    analyzedBy: '1',
  },
  'CR-002': {
    changeRequestId: 'CR-002',
    affectedRequirements: [
      {
        requirementId: 'REQ-003',
        title: 'Requirements Management',
        impactType: 'direct',
        changeDescription: 'Add bulk operations for requirements',
      },
    ],
    impactedArtifacts: [
      {
        artifactType: 'code',
        artifactId: 'CODE-003',
        artifactName: 'RequirementsTable.tsx',
        estimatedEffort: 12,
      },
      {
        artifactType: 'test',
        artifactId: 'TEST-003',
        artifactName: 'Requirements CRUD Tests',
        estimatedEffort: 8,
      },
    ],
    dependencyCount: 1,
    effortEstimation: {
      analysis: 2,
      development: 12,
      testing: 6,
      documentation: 2,
      total: 22,
    },
    risks: [
      {
        id: 'risk-4',
        type: 'technical',
        description: 'Bulk operations may impact performance with large datasets',
        level: 'low',
        mitigation: 'Implement pagination and limit bulk operations to 100 items',
      },
    ],
    recommendations: [
      {
        id: 'rec-4',
        title: 'Add Progress Indicators',
        description: 'Show progress for bulk operations to improve UX',
        priority: 'medium',
      },
    ],
    overallImpact: 'low',
    analyzedAt: '2024-03-21T14:30:00Z',
    analyzedBy: '2',
  },
  'CR-003': {
    changeRequestId: 'CR-003',
    affectedRequirements: [
      {
        requirementId: 'REQ-001',
        title: 'User Authentication',
        impactType: 'direct',
        changeDescription: 'Complete rewrite to support multi-factor authentication',
      },
      {
        requirementId: 'REQ-002',
        title: 'Dashboard',
        impactType: 'indirect',
        changeDescription: 'Add MFA setup wizard',
      },
      {
        requirementId: 'REQ-005',
        title: 'Search Functionality',
        impactType: 'indirect',
        changeDescription: 'Update user permissions check',
      },
    ],
    impactedArtifacts: [
      {
        artifactType: 'code',
        artifactId: 'CODE-001',
        artifactName: 'AuthService.ts',
        estimatedEffort: 24,
      },
      {
        artifactType: 'code',
        artifactId: 'CODE-006',
        artifactName: 'MFAComponent.tsx',
        estimatedEffort: 16,
      },
      {
        artifactType: 'test',
        artifactId: 'TEST-001',
        artifactName: 'Auth Test Suite',
        estimatedEffort: 16,
      },
      {
        artifactType: 'doc',
        artifactId: 'DOC-001',
        artifactName: 'Authentication Documentation',
        estimatedEffort: 8,
      },
      {
        artifactType: 'design',
        artifactId: 'DESIGN-002',
        artifactName: 'MFA Flow Mockups',
        estimatedEffort: 12,
      },
    ],
    dependencyCount: 8,
    effortEstimation: {
      analysis: 8,
      development: 48,
      testing: 24,
      documentation: 10,
      total: 90,
    },
    risks: [
      {
        id: 'risk-5',
        type: 'technical',
        description: 'MFA implementation is complex and prone to security vulnerabilities',
        level: 'high',
        mitigation: 'Use battle-tested libraries and conduct thorough security audit',
      },
      {
        id: 'risk-6',
        type: 'schedule',
        description: 'Large scope may delay other critical features',
        level: 'high',
        mitigation: 'Consider breaking into smaller phases',
      },
      {
        id: 'risk-7',
        type: 'resource',
        description: 'Requires specialized security expertise',
        level: 'medium',
        mitigation: 'Engage security consultant early',
      },
    ],
    recommendations: [
      {
        id: 'rec-5',
        title: 'Use Established MFA Libraries',
        description: 'Leverage existing, well-tested MFA libraries rather than building from scratch',
        priority: 'high',
      },
      {
        id: 'rec-6',
        title: 'Phased Rollout',
        description: 'Roll out to internal users first, then gradually to all users',
        priority: 'high',
      },
      {
        id: 'rec-7',
        title: 'User Communication Plan',
        description: 'Prepare clear documentation and support materials for users',
        priority: 'medium',
      },
    ],
    overallImpact: 'critical',
    analyzedAt: '2024-03-22T09:15:00Z',
    analyzedBy: '1',
  },
};

export const mockChangeRequests: ChangeRequest[] = [
  {
    id: '1',
    crId: 'CR-001',
    projectId: '1',
    title: 'Add OAuth 2.0 Authentication Support',
    description: 'Users are requesting the ability to sign in using Google, GitHub, and Microsoft accounts in addition to email/password.',
    type: 'enhancement',
    status: 'under-review',
    priority: 'high',
    requestedBy: '2',
    requestedByName: 'Sarah Johnson',
    businessJustification: 'Reduces friction in user onboarding. Competitor analysis shows 60% of similar platforms offer social login. User survey indicates 45% would prefer OAuth login.',
    urgency: 'high',
    targetRequirements: ['REQ-001', 'REQ-002'],
    impactAnalysis: mockImpactAnalyses['CR-001'],
    createdAt: '2024-03-20T09:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    crId: 'CR-002',
    projectId: '1',
    title: 'Add Bulk Operations for Requirements',
    description: 'Allow users to select multiple requirements and perform bulk actions (status change, assign, delete, export).',
    type: 'enhancement',
    status: 'approved',
    priority: 'medium',
    requestedBy: '1',
    requestedByName: 'John Smith',
    businessJustification: 'Power users managing 100+ requirements report significant time savings with bulk operations. Estimated 30% reduction in time spent on administrative tasks.',
    urgency: 'medium',
    targetRequirements: ['REQ-003'],
    impactAnalysis: mockImpactAnalyses['CR-002'],
    approvedBy: '3',
    approvedByName: 'Michael Chen',
    createdAt: '2024-03-21T14:00:00Z',
    updatedAt: '2024-03-21T16:30:00Z',
    reviewedAt: '2024-03-21T16:30:00Z',
  },
  {
    id: '3',
    crId: 'CR-003',
    projectId: '1',
    title: 'Implement Multi-Factor Authentication (MFA)',
    description: 'Add support for TOTP-based MFA (Google Authenticator, Authy) and SMS-based MFA for enhanced security.',
    type: 'enhancement',
    status: 'pending',
    priority: 'high',
    requestedBy: '3',
    requestedByName: 'Michael Chen',
    businessJustification: 'Enterprise clients require MFA for compliance (SOC 2, HIPAA). Blocking 3 enterprise deals worth $250K ARR. Security audit flagged lack of MFA as high-risk.',
    urgency: 'immediate',
    targetRequirements: ['REQ-001', 'REQ-002', 'REQ-005'],
    impactAnalysis: mockImpactAnalyses['CR-003'],
    createdAt: '2024-03-22T08:30:00Z',
    updatedAt: '2024-03-22T09:15:00Z',
  },
  {
    id: '4',
    crId: 'CR-004',
    projectId: '1',
    title: 'Fix Requirements Export PDF Formatting',
    description: 'PDF exports have broken formatting when requirements contain tables or images. Tables overflow page boundaries and images are not scaled properly.',
    type: 'bug-fix',
    status: 'implemented',
    priority: 'high',
    requestedBy: '2',
    requestedByName: 'Sarah Johnson',
    businessJustification: 'Users are unable to share requirements with external stakeholders in professional format. 15 support tickets filed in last week. Impacts sales demos.',
    urgency: 'high',
    targetRequirements: ['REQ-006'],
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-19T14:00:00Z',
    reviewedAt: '2024-03-16T11:00:00Z',
    approvedBy: '1',
    approvedByName: 'John Smith',
    implementationNotes: 'Fixed using updated PDF library with better table handling. Added image scaling and pagination logic.',
  },
  {
    id: '5',
    crId: 'CR-005',
    projectId: '1',
    title: 'Expand Search to Include Attachments',
    description: 'Current search only indexes requirement titles and descriptions. Users want to search within attached documents (PDF, Word, Excel).',
    type: 'scope-change',
    status: 'rejected',
    priority: 'low',
    requestedBy: '4',
    requestedByName: 'Emily Davis',
    businessJustification: 'Nice-to-have feature requested by 3 users. Low priority compared to other roadmap items.',
    urgency: 'low',
    targetRequirements: ['REQ-005'],
    rejectionReason: 'Requires significant infrastructure changes (document parsing service, expanded search index). Cost-benefit analysis shows low ROI. Recommend revisiting in Q4 if user demand increases.',
    createdAt: '2024-03-18T11:00:00Z',
    updatedAt: '2024-03-19T15:30:00Z',
    reviewedAt: '2024-03-19T15:30:00Z',
  },
];

export const changeRequestService = {
  getAllChangeRequests: async (): Promise<ChangeRequest[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockChangeRequests), 300);
    });
  },

  getChangeRequestById: async (id: string): Promise<ChangeRequest | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockChangeRequests.find((cr) => cr.id === id)), 200);
    });
  },

  createChangeRequest: async (input: Partial<ChangeRequest>): Promise<ChangeRequest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCR: ChangeRequest = {
          id: String(mockChangeRequests.length + 1),
          crId: `CR-${String(mockChangeRequests.length + 1).padStart(3, '0')}`,
          projectId: input.projectId || '1',
          title: input.title || '',
          description: input.description || '',
          type: input.type || 'enhancement',
          status: 'pending',
          priority: input.priority || 'medium',
          requestedBy: input.requestedBy || '1',
          requestedByName: input.requestedByName || 'Current User',
          businessJustification: input.businessJustification || '',
          urgency: input.urgency || 'medium',
          targetRequirements: input.targetRequirements || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockChangeRequests.push(newCR);
        resolve(newCR);
      }, 500);
    });
  },

  updateChangeRequest: async (id: string, updates: Partial<ChangeRequest>): Promise<ChangeRequest> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockChangeRequests.findIndex((cr) => cr.id === id);
        if (index === -1) {
          reject(new Error('Change request not found'));
          return;
        }
        mockChangeRequests[index] = {
          ...mockChangeRequests[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(mockChangeRequests[index]);
      }, 300);
    });
  },

  approveChangeRequest: async (id: string, approvedBy: string, approvedByName: string): Promise<ChangeRequest> => {
    return changeRequestService.updateChangeRequest(id, {
      status: 'approved',
      approvedBy,
      approvedByName,
      reviewedAt: new Date().toISOString(),
    });
  },

  rejectChangeRequest: async (id: string, reason: string): Promise<ChangeRequest> => {
    return changeRequestService.updateChangeRequest(id, {
      status: 'rejected',
      rejectionReason: reason,
      reviewedAt: new Date().toISOString(),
    });
  },

  requestMoreInfo: async (id: string, message: string): Promise<ChangeRequest> => {
    return changeRequestService.updateChangeRequest(id, {
      implementationNotes: message,
    });
  },
};
