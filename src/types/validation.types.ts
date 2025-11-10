export type ValidationRuleType = 
  | 'required-field'
  | 'format-check'
  | 'dependency'
  | 'business-logic'
  | 'custom';

export type AppliesTo = 'requirement' | 'change-request' | 'review' | 'all';

export type FieldType = 
  | 'title'
  | 'description'
  | 'status'
  | 'priority'
  | 'acceptanceCriteria'
  | 'tags'
  | 'assignee'
  | 'custom';

export type ConditionOperator = 
  | 'equals'
  | 'not-equals'
  | 'contains'
  | 'not-contains'
  | 'greater-than'
  | 'less-than'
  | 'is-empty'
  | 'is-not-empty';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationCondition {
  field: string;
  operator: ConditionOperator;
  value?: any;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  ruleType: ValidationRuleType;
  appliesTo: AppliesTo;
  field: FieldType;
  conditions: ValidationCondition[];
  severity: ValidationSeverity;
  errorMessage: string;
  enabled: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  executionCount?: number;
  violationCount?: number;
}

export interface ValidationTestResult {
  passed: boolean;
  message: string;
  violations?: string[];
}
