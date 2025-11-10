import { ValidationRule, ValidationTestResult } from '@/types/validation.types';

export const mockValidationRules: ValidationRule[] = [
  {
    id: '1',
    name: 'Title Length Check',
    description: 'Requirement titles must be between 10 and 100 characters',
    ruleType: 'format-check',
    appliesTo: 'requirement',
    field: 'title',
    conditions: [
      { field: 'title', operator: 'is-not-empty' },
    ],
    severity: 'error',
    errorMessage: 'Title must be between 10 and 100 characters',
    enabled: true,
    createdBy: '1',
    createdByName: 'John Smith',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    executionCount: 1247,
    violationCount: 23,
  },
  {
    id: '2',
    name: 'Acceptance Criteria Required',
    description: 'High priority requirements must have at least one acceptance criterion',
    ruleType: 'required-field',
    appliesTo: 'requirement',
    field: 'acceptanceCriteria',
    conditions: [
      { field: 'priority', operator: 'equals', value: 'high' },
      { field: 'acceptanceCriteria', operator: 'is-not-empty' },
    ],
    severity: 'error',
    errorMessage: 'High priority requirements must include acceptance criteria',
    enabled: true,
    createdBy: '1',
    createdByName: 'John Smith',
    createdAt: '2024-01-05T14:30:00Z',
    updatedAt: '2024-01-05T14:30:00Z',
    executionCount: 856,
    violationCount: 15,
  },
  {
    id: '3',
    name: 'Tag Recommendation',
    description: 'Requirements should have at least one tag for better organization',
    ruleType: 'business-logic',
    appliesTo: 'requirement',
    field: 'tags',
    conditions: [
      { field: 'tags', operator: 'is-not-empty' },
    ],
    severity: 'warning',
    errorMessage: 'Consider adding tags to improve requirement organization',
    enabled: true,
    createdBy: '2',
    createdByName: 'Sarah Johnson',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    executionCount: 2341,
    violationCount: 187,
  },
  {
    id: '4',
    name: 'Status Progression Validation',
    description: 'Requirements cannot skip from draft to implemented',
    ruleType: 'business-logic',
    appliesTo: 'requirement',
    field: 'status',
    conditions: [
      { field: 'status', operator: 'not-equals', value: 'implemented' },
    ],
    severity: 'error',
    errorMessage: 'Requirements must be approved before implementation',
    enabled: true,
    createdBy: '1',
    createdByName: 'John Smith',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    executionCount: 934,
    violationCount: 8,
  },
  {
    id: '5',
    name: 'Assignee Required for In Review',
    description: 'Requirements in review status must have an assignee',
    ruleType: 'dependency',
    appliesTo: 'requirement',
    field: 'assignee',
    conditions: [
      { field: 'status', operator: 'equals', value: 'in-review' },
      { field: 'assignee', operator: 'is-not-empty' },
    ],
    severity: 'error',
    errorMessage: 'Requirements in review must be assigned to a reviewer',
    enabled: true,
    createdBy: '2',
    createdByName: 'Sarah Johnson',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    executionCount: 645,
    violationCount: 12,
  },
  {
    id: '6',
    name: 'Description Quality Check',
    description: 'Requirement descriptions should be detailed (minimum 50 characters)',
    ruleType: 'format-check',
    appliesTo: 'requirement',
    field: 'description',
    conditions: [
      { field: 'description', operator: 'is-not-empty' },
    ],
    severity: 'warning',
    errorMessage: 'Consider adding more details to the description (min 50 characters)',
    enabled: false,
    createdBy: '3',
    createdByName: 'Michael Chen',
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-02-10T14:00:00Z',
    executionCount: 0,
    violationCount: 0,
  },
];

export const validationService = {
  getAllRules: async (): Promise<ValidationRule[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockValidationRules), 300);
    });
  },

  getRuleById: async (id: string): Promise<ValidationRule | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockValidationRules.find((r) => r.id === id)), 200);
    });
  },

  createRule: async (input: Omit<ValidationRule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'violationCount'>): Promise<ValidationRule> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRule: ValidationRule = {
          ...input,
          id: String(mockValidationRules.length + 1),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          executionCount: 0,
          violationCount: 0,
        };
        mockValidationRules.push(newRule);
        resolve(newRule);
      }, 500);
    });
  },

  updateRule: async (id: string, updates: Partial<ValidationRule>): Promise<ValidationRule> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockValidationRules.findIndex((r) => r.id === id);
        if (index === -1) {
          reject(new Error('Rule not found'));
          return;
        }

        mockValidationRules[index] = {
          ...mockValidationRules[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(mockValidationRules[index]);
      }, 300);
    });
  },

  deleteRule: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockValidationRules.findIndex((r) => r.id === id);
        if (index === -1) {
          reject(new Error('Rule not found'));
          return;
        }
        mockValidationRules.splice(index, 1);
        resolve();
      }, 300);
    });
  },

  toggleRule: async (id: string): Promise<ValidationRule> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockValidationRules.findIndex((r) => r.id === id);
        if (index === -1) {
          reject(new Error('Rule not found'));
          return;
        }
        mockValidationRules[index].enabled = !mockValidationRules[index].enabled;
        mockValidationRules[index].updatedAt = new Date().toISOString();
        resolve(mockValidationRules[index]);
      }, 300);
    });
  },

  testRule: async (ruleId: string, testData: any): Promise<ValidationTestResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rule = mockValidationRules.find((r) => r.id === ruleId);
        if (!rule) {
          resolve({
            passed: false,
            message: 'Rule not found',
          });
          return;
        }

        // Simple mock validation logic
        const passed = Math.random() > 0.3; // 70% pass rate for demo
        
        resolve({
          passed,
          message: passed 
            ? 'Validation passed! No violations detected.'
            : `Validation failed: ${rule.errorMessage}`,
          violations: passed ? [] : [rule.errorMessage],
        });
      }, 1000);
    });
  },
};
