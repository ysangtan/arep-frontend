export type UserRole = 'admin' | 'project-manager' | 'business-analyst' | 'developer' | 'tester' | 'stakeholder' | 'ba' | 'reviewer' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  preferences?: {
    notifications?: {
      email: boolean;
      frequency: 'real-time' | 'daily' | 'weekly';
    };
    timezone?: string;
    theme?: string;
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}
