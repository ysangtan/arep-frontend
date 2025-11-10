import { AuditLogEntry } from '@/types/audit.types';

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: '2024-03-23T14:35:22Z',
    userId: '1',
    userName: 'John Smith',
    userRole: 'admin',
    action: 'create',
    entityType: 'requirement',
    entityId: 'REQ-010',
    entityName: 'Multi-Factor Authentication',
    description: 'Created new requirement: Multi-Factor Authentication',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
  {
    id: '2',
    timestamp: '2024-03-23T14:22:15Z',
    userId: '2',
    userName: 'Sarah Johnson',
    userRole: 'project-manager',
    action: 'approve',
    entityType: 'change-request',
    entityId: 'CR-002',
    entityName: 'Add Bulk Operations',
    description: 'Approved change request: Add Bulk Operations',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: '3',
    timestamp: '2024-03-23T13:45:33Z',
    userId: '3',
    userName: 'Michael Chen',
    userRole: 'business-analyst',
    action: 'update',
    entityType: 'requirement',
    entityId: 'REQ-005',
    entityName: 'Search Functionality',
    changes: [
      { field: 'status', oldValue: 'draft', newValue: 'in-review' },
      { field: 'assignee', oldValue: null, newValue: 'Sarah Johnson' },
    ],
    description: 'Updated requirement status and assigned reviewer',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
  {
    id: '4',
    timestamp: '2024-03-23T12:18:44Z',
    userId: '1',
    userName: 'John Smith',
    userRole: 'admin',
    action: 'create',
    entityType: 'validation-rule',
    entityId: '7',
    entityName: 'Title Length Check',
    description: 'Created new validation rule: Title Length Check',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
  {
    id: '5',
    timestamp: '2024-03-23T11:52:11Z',
    userId: '4',
    userName: 'Emily Davis',
    userRole: 'developer',
    action: 'status-change',
    entityType: 'requirement',
    entityId: 'REQ-003',
    entityName: 'Requirements CRUD Operations',
    changes: [
      { field: 'status', oldValue: 'approved', newValue: 'implemented' },
    ],
    description: 'Marked requirement as implemented',
    ipAddress: '192.168.1.115',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: '6',
    timestamp: '2024-03-23T11:30:05Z',
    userId: '2',
    userName: 'Sarah Johnson',
    userRole: 'project-manager',
    action: 'create',
    entityType: 'project',
    entityId: '7',
    entityName: 'Mobile App v2.0',
    description: 'Created new project: Mobile App v2.0',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  {
    id: '7',
    timestamp: '2024-03-23T10:45:22Z',
    userId: '5',
    userName: 'David Wilson',
    userRole: 'tester',
    action: 'update',
    entityType: 'review',
    entityId: 'REV-015',
    entityName: 'Q1 Requirements Review',
    changes: [
      { field: 'decision', oldValue: 'pending', newValue: 'approved' },
    ],
    description: 'Approved review: Q1 Requirements Review',
    ipAddress: '192.168.1.120',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
  {
    id: '8',
    timestamp: '2024-03-23T10:12:44Z',
    userId: '1',
    userName: 'John Smith',
    userRole: 'admin',
    action: 'delete',
    entityType: 'user',
    entityId: '8',
    entityName: 'inactive.user@arep.com',
    description: 'Deleted inactive user account',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
  {
    id: '9',
    timestamp: '2024-03-23T09:55:33Z',
    userId: '3',
    userName: 'Michael Chen',
    userRole: 'business-analyst',
    action: 'create',
    entityType: 'traceability-link',
    entityId: 'link-15',
    description: 'Created traceability link between REQ-008 and TEST-012',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
  {
    id: '10',
    timestamp: '2024-03-23T09:30:11Z',
    userId: '6',
    userName: 'Lisa Brown',
    userRole: 'stakeholder',
    action: 'login',
    entityType: 'user',
    entityId: '6',
    description: 'User logged in successfully',
    ipAddress: '192.168.1.125',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
];

export const auditService = {
  getAuditLog: async (filters?: any): Promise<AuditLogEntry[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockAuditLog];

        if (filters?.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(
            (entry) =>
              entry.userName.toLowerCase().includes(search) ||
              entry.entityName?.toLowerCase().includes(search) ||
              entry.description.toLowerCase().includes(search)
          );
        }

        if (filters?.action && filters.action.length > 0) {
          filtered = filtered.filter((entry) => filters.action.includes(entry.action));
        }

        if (filters?.entityType && filters.entityType.length > 0) {
          filtered = filtered.filter((entry) => filters.entityType.includes(entry.entityType));
        }

        if (filters?.userId) {
          filtered = filtered.filter((entry) => entry.userId === filters.userId);
        }

        if (filters?.startDate) {
          filtered = filtered.filter((entry) => entry.timestamp >= filters.startDate);
        }

        if (filters?.endDate) {
          filtered = filtered.filter((entry) => entry.timestamp <= filters.endDate);
        }

        resolve(filtered);
      }, 300);
    });
  },

  exportAuditLog: async (format: 'csv' | 'json' | 'pdf'): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Exporting audit log as ${format.toUpperCase()}...`);
        resolve();
      }, 1000);
    });
  },
};
