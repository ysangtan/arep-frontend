export type NotificationType = 
  | 'review-assignment' 
  | 'mention' 
  | 'change-request' 
  | 'due-date' 
  | 'status-change'
  | 'comment';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  actionUrl?: string;
  relatedEntityId?: string;
  relatedEntityType?: 'requirement' | 'review' | 'change-request' | 'session';
  createdBy?: string;
  createdByName?: string;
  createdAt: string;
}

export type EmailDigestFrequency = 'immediate' | 'daily' | 'weekly' | 'never';

export interface NotificationPreferences {
  userId: string;
  emailNotifications: {
    reviewAssignments: boolean;
    mentions: boolean;
    changeRequests: boolean;
    dueDateReminders: boolean;
    statusChanges: boolean;
  };
  pushNotifications: {
    reviewAssignments: boolean;
    mentions: boolean;
    changeRequests: boolean;
    dueDateReminders: boolean;
    statusChanges: boolean;
  };
  emailDigestFrequency: EmailDigestFrequency;
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // HH:MM format
  quietHoursEnd?: string; // HH:MM format
  updatedAt: string;
}
