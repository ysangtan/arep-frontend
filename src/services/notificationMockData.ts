import { Notification, NotificationPreferences } from '@/types/notification.types';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'review-assignment',
    title: 'New Review Assignment',
    message: 'You have been assigned to review REQ-089: User Authentication System',
    priority: 'high',
    read: false,
    actionUrl: '/reviews',
    relatedEntityId: 'REQ-089',
    relatedEntityType: 'requirement',
    createdBy: 'user-2',
    createdByName: 'Sarah Chen',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: 'notif-002',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Carlos Rodriguez mentioned you in a discussion on REQ-087',
    priority: 'medium',
    read: false,
    actionUrl: '/review-sessions',
    relatedEntityId: 'session-001',
    relatedEntityType: 'session',
    createdBy: 'user-3',
    createdByName: 'Carlos Rodriguez',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'notif-003',
    type: 'change-request',
    title: 'Change Request Submitted',
    message: 'CR-015: Update payment processing flow has been submitted for review',
    priority: 'medium',
    read: false,
    actionUrl: '/impact-analysis',
    relatedEntityId: 'CR-015',
    relatedEntityType: 'change-request',
    createdBy: 'user-4',
    createdByName: 'Mike Johnson',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
  },
  {
    id: 'notif-004',
    type: 'due-date',
    title: 'Review Due Tomorrow',
    message: 'Your review for REQ-090: Payment Gateway Integration is due tomorrow',
    priority: 'high',
    read: false,
    actionUrl: '/reviews',
    relatedEntityId: 'REQ-090',
    relatedEntityType: 'requirement',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
  },
  {
    id: 'notif-005',
    type: 'status-change',
    title: 'Requirement Approved',
    message: 'REQ-087: Dashboard Analytics has been approved',
    priority: 'low',
    read: true,
    actionUrl: '/requirements/REQ-087',
    relatedEntityId: 'REQ-087',
    relatedEntityType: 'requirement',
    createdBy: 'user-3',
    createdByName: 'Carlos Rodriguez',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'notif-006',
    type: 'comment',
    title: 'New Comment',
    message: 'Emily Brown commented on REQ-091: Email Notification Service',
    priority: 'low',
    read: true,
    actionUrl: '/requirements/REQ-091',
    relatedEntityId: 'REQ-091',
    relatedEntityType: 'requirement',
    createdBy: 'user-5',
    createdByName: 'Emily Brown',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

export const mockNotificationPreferences: NotificationPreferences = {
  userId: 'user-1',
  emailNotifications: {
    reviewAssignments: true,
    mentions: true,
    changeRequests: true,
    dueDateReminders: true,
    statusChanges: false,
  },
  pushNotifications: {
    reviewAssignments: true,
    mentions: true,
    changeRequests: true,
    dueDateReminders: true,
    statusChanges: true,
  },
  emailDigestFrequency: 'daily',
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  updatedAt: new Date().toISOString(),
};

// Service functions
export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockNotifications];
  },

  getUnreadCount: async (): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockNotifications.filter(n => !n.read).length;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  },

  markAllAsRead: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockNotifications.forEach(n => n.read = true);
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockNotifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...mockNotificationPreferences };
  },

  updatePreferences: async (preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    Object.assign(mockNotificationPreferences, preferences);
    mockNotificationPreferences.updatedAt = new Date().toISOString();
    return { ...mockNotificationPreferences };
  },
};
