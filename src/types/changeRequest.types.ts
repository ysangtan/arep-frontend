export type ChangeRequestType = 'enhancement' | 'bug-fix' | 'scope-change' | 'technical';

export type ChangeRequestStatus = 
  | 'pending' 
  | 'under-review' 
  | 'approved' 
  | 'rejected' 
  | 'implemented';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface AffectedRequirement {
  requirementId: string;
  title: string;
  impactType: 'direct' | 'indirect';
  changeDescription: string;
}

export interface ImpactedArtifact {
  artifactType: 'test' | 'code' | 'doc' | 'design';
  artifactId: string;
  artifactName: string;
  estimatedEffort: number; // hours
}

export interface EffortEstimation {
  analysis: number; // hours
  development: number; // hours
  testing: number; // hours
  documentation: number; // hours
  total: number; // hours
}

export interface Risk {
  id: string;
  type: 'technical' | 'schedule' | 'dependency' | 'resource';
  description: string;
  level: RiskLevel;
  mitigation: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ImpactAnalysis {
  changeRequestId: string;
  affectedRequirements: AffectedRequirement[];
  impactedArtifacts: ImpactedArtifact[];
  dependencyCount: number;
  effortEstimation: EffortEstimation;
  risks: Risk[];
  recommendations: Recommendation[];
  overallImpact: ImpactLevel;
  analyzedAt: string;
  analyzedBy: string;
}

export interface ChangeRequest {
  id: string;
  crId: string; // CR-001
  projectId: string;
  title: string;
  description: string;
  type: ChangeRequestType;
  status: ChangeRequestStatus;
  priority: 'high' | 'medium' | 'low';
  requestedBy: string;
  requestedByName: string;
  businessJustification: string;
  urgency: 'immediate' | 'high' | 'medium' | 'low';
  targetRequirements: string[]; // Requirement IDs
  impactAnalysis?: ImpactAnalysis;
  approvedBy?: string;
  approvedByName?: string;
  rejectionReason?: string;
  implementationNotes?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
}

export interface ChangeRequestFilters {
  status?: ChangeRequestStatus[];
  type?: ChangeRequestType[];
  priority?: ('high' | 'medium' | 'low')[];
  impactLevel?: ImpactLevel[];
  search?: string;
}
