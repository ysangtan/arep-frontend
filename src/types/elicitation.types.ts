import { Priority } from './requirement.types';

export type ElicitationColumn = 'backlog' | 'in-progress' | 'review' | 'done';

export interface ElicitationCard {
  id: string;
  title: string;
  description?: string;
  column: ElicitationColumn;
  position: number;
  priority: Priority;
  assignee?: string; // User ID
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  convertedToRequirement?: string; // Requirement ID if converted
}
