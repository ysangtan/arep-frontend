export type RequirementType = 'functional' | 'non-functional' | 'constraint' | 'business-rule';

export type RequirementStatus = 
  | 'draft' 
  | 'in-review' 
  | 'approved' 
  | 'rejected' 
  | 'implemented' 
  | 'verified' 
  | 'closed';

export type Priority = 'high' | 'medium' | 'low';

export interface Requirement {
  id: string;
  reqId: string; // REQ-001
  projectId: string;
  title: string;
  description: string;
  type: RequirementType;
  status: RequirementStatus;
  priority: Priority;
  acceptanceCriteria: string[];
  tags: string[];
  assignee?: string; // User ID
  createdBy: string; // User ID
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  }>;
  versionHistory?: Array<{
    version: number;
    changes: Record<string, any>;
    modifiedBy: string;
    modifiedAt: string;
  }>;
  validationWarnings?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RequirementFilters {
  status?: RequirementStatus[];
  type?: RequirementType[];
  priority?: Priority[];
  assignee?: string;
  search?: string;
  tags?: string[];
}
