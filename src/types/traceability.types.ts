export type ArtifactType = 'test' | 'code' | 'doc' | 'design';

export type LinkType = 
  | 'verifies'
  | 'implements'
  | 'describes'
  | 'derives-from'
  | 'depends-on';

export type LinkStatus = 'active' | 'broken' | 'outdated';

export interface TraceabilityLink {
  id: string;
  requirementId: string;
  artifactType: ArtifactType;
  artifactId: string;
  artifactName: string;
  artifactUrl?: string;
  linkType: LinkType;
  status: LinkStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CoverageMetrics {
  testCoverage: number;
  codeCoverage: number;
  docCoverage: number;
  designCoverage: number;
  overallCoverage: number;
}

export interface OrphanRequirement {
  requirementId: string;
  title: string;
  missingArtifacts: ArtifactType[];
}

export interface OrphanArtifact {
  artifactType: ArtifactType;
  artifactId: string;
  artifactName: string;
  noLinkedRequirements: boolean;
}

export interface TraceabilityMatrix {
  requirementId: string;
  requirementTitle: string;
  tests: TraceabilityLink[];
  code: TraceabilityLink[];
  docs: TraceabilityLink[];
  design: TraceabilityLink[];
}
