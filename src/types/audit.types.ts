export type AuditAction = 
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'assign'
  | 'status-change'
  | 'login'
  | 'logout';

export type EntityType = 
  | 'requirement'
  | 'change-request'
  | 'review'
  | 'user'
  | 'project'
  | 'validation-rule'
  | 'traceability-link';

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  entityName?: string;
  changes?: AuditChange[];
  ipAddress?: string;
  userAgent?: string;
  description: string;
}

export interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: AuditAction[];
  entityType?: EntityType[];
  search?: string;
}
