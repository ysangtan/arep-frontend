import { TraceabilityLink, CoverageMetrics, OrphanRequirement, OrphanArtifact, TraceabilityMatrix } from '@/types/traceability.types';
import { mockRequirements } from './mockData';

export const mockTraceabilityLinks: TraceabilityLink[] = [
  // Links for REQ-001
  {
    id: 'link-1',
    requirementId: 'REQ-001',
    artifactType: 'test',
    artifactId: 'TEST-001',
    artifactName: 'User Authentication Test Suite',
    artifactUrl: '/tests/auth.test.ts',
    linkType: 'verifies',
    status: 'active',
    createdBy: '1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'link-2',
    requirementId: 'REQ-001',
    artifactType: 'code',
    artifactId: 'CODE-001',
    artifactName: 'AuthService.ts',
    artifactUrl: '/src/services/auth.service.ts',
    linkType: 'implements',
    status: 'active',
    createdBy: '1',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'link-3',
    requirementId: 'REQ-001',
    artifactType: 'doc',
    artifactId: 'DOC-001',
    artifactName: 'Authentication Flow Documentation',
    artifactUrl: '/docs/auth-flow.md',
    linkType: 'describes',
    status: 'active',
    createdBy: '1',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
  },
  // Links for REQ-002
  {
    id: 'link-4',
    requirementId: 'REQ-002',
    artifactType: 'test',
    artifactId: 'TEST-002',
    artifactName: 'Dashboard UI Tests',
    linkType: 'verifies',
    status: 'active',
    createdBy: '2',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
  },
  {
    id: 'link-5',
    requirementId: 'REQ-002',
    artifactType: 'code',
    artifactId: 'CODE-002',
    artifactName: 'Dashboard.tsx',
    artifactUrl: '/src/pages/Dashboard.tsx',
    linkType: 'implements',
    status: 'active',
    createdBy: '2',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'link-6',
    requirementId: 'REQ-002',
    artifactType: 'design',
    artifactId: 'DESIGN-001',
    artifactName: 'Dashboard Mockups',
    artifactUrl: '/designs/dashboard.fig',
    linkType: 'describes',
    status: 'active',
    createdBy: '2',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  },
  // Links for REQ-003
  {
    id: 'link-7',
    requirementId: 'REQ-003',
    artifactType: 'test',
    artifactId: 'TEST-003',
    artifactName: 'Requirements CRUD Tests',
    linkType: 'verifies',
    status: 'active',
    createdBy: '1',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: 'link-8',
    requirementId: 'REQ-003',
    artifactType: 'code',
    artifactId: 'CODE-003',
    artifactName: 'RequirementsTable.tsx',
    artifactUrl: '/src/pages/requirements/RequirementsTable.tsx',
    linkType: 'implements',
    status: 'active',
    createdBy: '1',
    createdAt: '2024-01-17T11:00:00Z',
    updatedAt: '2024-01-17T11:00:00Z',
  },
  // REQ-004 has broken link
  {
    id: 'link-9',
    requirementId: 'REQ-004',
    artifactType: 'code',
    artifactId: 'CODE-004',
    artifactName: 'ReviewQueue.tsx (MOVED)',
    artifactUrl: '/src/pages/old/ReviewQueue.tsx',
    linkType: 'implements',
    status: 'broken',
    createdBy: '3',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-03-20T15:00:00Z',
    notes: 'File has been moved or deleted',
  },
  // Links for REQ-005
  {
    id: 'link-10',
    requirementId: 'REQ-005',
    artifactType: 'test',
    artifactId: 'TEST-005',
    artifactName: 'Search Performance Tests',
    linkType: 'verifies',
    status: 'active',
    createdBy: '2',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
  },
  {
    id: 'link-11',
    requirementId: 'REQ-005',
    artifactType: 'code',
    artifactId: 'CODE-005',
    artifactName: 'SearchService.ts',
    linkType: 'implements',
    status: 'active',
    createdBy: '2',
    createdAt: '2024-01-19T11:00:00Z',
    updatedAt: '2024-01-19T11:00:00Z',
  },
  {
    id: 'link-12',
    requirementId: 'REQ-005',
    artifactType: 'doc',
    artifactId: 'DOC-005',
    artifactName: 'Search Algorithm Documentation',
    linkType: 'describes',
    status: 'active',
    createdBy: '2',
    createdAt: '2024-01-19T12:00:00Z',
    updatedAt: '2024-01-19T12:00:00Z',
  },
];

export const mockCoverageMetrics: CoverageMetrics = {
  testCoverage: 75,
  codeCoverage: 85,
  docCoverage: 60,
  designCoverage: 45,
  overallCoverage: 66,
};

export const mockOrphanRequirements: OrphanRequirement[] = [
  {
    requirementId: 'REQ-006',
    title: 'Real-time Notifications',
    missingArtifacts: ['test', 'code', 'doc', 'design'],
  },
  {
    requirementId: 'REQ-007',
    title: 'Export to PDF',
    missingArtifacts: ['test', 'code'],
  },
];

export const mockOrphanArtifacts: OrphanArtifact[] = [
  {
    artifactType: 'test',
    artifactId: 'TEST-099',
    artifactName: 'Legacy API Tests',
    noLinkedRequirements: true,
  },
  {
    artifactType: 'code',
    artifactId: 'CODE-099',
    artifactName: 'OldUtilsService.ts',
    noLinkedRequirements: true,
  },
];

// Service functions
export const traceabilityService = {
  getAllLinks: async (): Promise<TraceabilityLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTraceabilityLinks), 300);
    });
  },

  getLinksForRequirement: async (requirementId: string): Promise<TraceabilityLink[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const links = mockTraceabilityLinks.filter((link) => link.requirementId === requirementId);
        resolve(links);
      }, 200);
    });
  },

  getTraceabilityMatrix: async (): Promise<TraceabilityMatrix[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const matrix = mockRequirements.map((req) => {
          const links = mockTraceabilityLinks.filter((link) => link.requirementId === req.reqId);
          return {
            requirementId: req.reqId,
            requirementTitle: req.title,
            tests: links.filter((l) => l.artifactType === 'test'),
            code: links.filter((l) => l.artifactType === 'code'),
            docs: links.filter((l) => l.artifactType === 'doc'),
            design: links.filter((l) => l.artifactType === 'design'),
          };
        });
        resolve(matrix);
      }, 400);
    });
  },

  createLink: async (input: Omit<TraceabilityLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<TraceabilityLink> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLink: TraceabilityLink = {
          ...input,
          id: `link-${mockTraceabilityLinks.length + 1}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockTraceabilityLinks.push(newLink);
        resolve(newLink);
      }, 300);
    });
  },

  updateLink: async (id: string, updates: Partial<TraceabilityLink>): Promise<TraceabilityLink> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockTraceabilityLinks.findIndex((link) => link.id === id);
        if (index === -1) {
          reject(new Error('Link not found'));
          return;
        }
        mockTraceabilityLinks[index] = {
          ...mockTraceabilityLinks[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(mockTraceabilityLinks[index]);
      }, 300);
    });
  },

  deleteLink: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockTraceabilityLinks.findIndex((link) => link.id === id);
        if (index !== -1) {
          mockTraceabilityLinks.splice(index, 1);
        }
        resolve();
      }, 300);
    });
  },

  getCoverageMetrics: async (): Promise<CoverageMetrics> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCoverageMetrics), 200);
    });
  },

  getOrphanRequirements: async (): Promise<OrphanRequirement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockOrphanRequirements), 300);
    });
  },

  getOrphanArtifacts: async (): Promise<OrphanArtifact[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockOrphanArtifacts), 300);
    });
  },
};
