import { ElicitationCard, ElicitationColumn } from '@/types/elicitation.types';

export const mockElicitationCards: ElicitationCard[] = [
  {
    id: 'card-1',
    title: 'User Profile Photo Upload',
    description: 'Allow users to upload and display profile photos',
    column: 'backlog',
    position: 0,
    priority: 'medium',
    tags: ['user-profile', 'media'],
    createdBy: '2',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-01-20T10:00:00Z',
  },
  {
    id: 'card-2',
    title: 'Dark Mode Support',
    description: 'Implement system-wide dark mode theme',
    column: 'backlog',
    position: 1,
    priority: 'low',
    tags: ['ui', 'theme'],
    createdBy: '2',
    createdAt: '2025-01-19T14:00:00Z',
    updatedAt: '2025-01-19T14:00:00Z',
  },
  {
    id: 'card-3',
    title: 'Bulk Requirements Import',
    description: 'Import multiple requirements from CSV/Excel',
    column: 'backlog',
    position: 2,
    priority: 'high',
    tags: ['import', 'data'],
    assignee: '1',
    createdBy: '2',
    createdAt: '2025-01-18T09:00:00Z',
    updatedAt: '2025-01-21T11:00:00Z',
  },
  {
    id: 'card-4',
    title: 'Real-time Collaboration',
    description: 'Show who is viewing/editing requirements in real-time',
    column: 'in-progress',
    position: 0,
    priority: 'high',
    assignee: '1',
    tags: ['collaboration', 'real-time'],
    createdBy: '2',
    createdAt: '2025-01-17T13:00:00Z',
    updatedAt: '2025-01-21T15:00:00Z',
  },
  {
    id: 'card-5',
    title: 'Advanced Search with Filters',
    description: 'Enhance search with multiple filter combinations',
    column: 'in-progress',
    position: 1,
    priority: 'medium',
    assignee: '2',
    tags: ['search', 'filters'],
    createdBy: '2',
    createdAt: '2025-01-16T11:00:00Z',
    updatedAt: '2025-01-20T09:00:00Z',
  },
  {
    id: 'card-6',
    title: 'Email Digest Preferences',
    description: 'Allow users to configure email notification digest frequency',
    column: 'review',
    position: 0,
    priority: 'medium',
    assignee: '2',
    tags: ['notifications', 'email'],
    createdBy: '2',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-21T08:00:00Z',
  },
  {
    id: 'card-7',
    title: 'Requirements Templates',
    description: 'Create and use requirement templates for common patterns',
    column: 'review',
    position: 1,
    priority: 'low',
    tags: ['templates', 'productivity'],
    createdBy: '2',
    createdAt: '2025-01-14T15:00:00Z',
    updatedAt: '2025-01-19T14:00:00Z',
  },
  {
    id: 'card-8',
    title: 'API Documentation',
    description: 'Generate comprehensive API documentation with examples',
    column: 'done',
    position: 0,
    priority: 'high',
    assignee: '1',
    tags: ['api', 'documentation'],
    createdBy: '1',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-18T16:00:00Z',
  },
  {
    id: 'card-9',
    title: 'Keyboard Shortcuts',
    description: 'Add keyboard shortcuts for common actions',
    column: 'done',
    position: 1,
    priority: 'medium',
    tags: ['ux', 'accessibility'],
    createdBy: '2',
    createdAt: '2025-01-12T12:00:00Z',
    updatedAt: '2025-01-17T10:00:00Z',
  },
];

export function getCardsByColumn(column: ElicitationColumn): ElicitationCard[] {
  return mockElicitationCards
    .filter(card => card.column === column)
    .sort((a, b) => a.position - b.position);
}

export function getAllCards(): ElicitationCard[] {
  return mockElicitationCards;
}

export function getCardById(id: string): ElicitationCard | undefined {
  return mockElicitationCards.find(card => card.id === id);
}

export function moveCard(
  cardId: string,
  targetColumn: ElicitationColumn,
  targetPosition: number
): ElicitationCard[] {
  const card = mockElicitationCards.find(c => c.id === cardId);
  if (!card) return mockElicitationCards;

  const oldColumn = card.column;
  
  // Update the moved card
  card.column = targetColumn;
  card.position = targetPosition;
  card.updatedAt = new Date().toISOString();

  // Reorder cards in old column
  mockElicitationCards
    .filter(c => c.column === oldColumn && c.id !== cardId)
    .sort((a, b) => a.position - b.position)
    .forEach((c, index) => {
      c.position = index;
    });

  // Reorder cards in new column
  mockElicitationCards
    .filter(c => c.column === targetColumn)
    .sort((a, b) => a.position - b.position)
    .forEach((c, index) => {
      c.position = index;
    });

  return mockElicitationCards;
}
