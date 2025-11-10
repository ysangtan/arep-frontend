import api from './api';
import { User, AuthResponse, LoginCredentials, RegisterData } from '@/types/user.types';

// Mock data for frontend development
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@arep.com',
    fullName: 'Admin User',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'ba@arep.com',
    fullName: 'Emily Johnson',
    role: 'ba',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Use mock mode for development until backend is ready
const USE_MOCK = true;

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      // Mock login
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      const user = MOCK_USERS.find(u => u.email === credentials.email);
      if (!user || credentials.password !== 'password123') {
        throw new Error('Invalid credentials');
      }

      const mockResponse: AuthResponse = {
        user,
        token: 'mock-jwt-token-' + user.id,
        refreshToken: 'mock-refresh-token-' + user.id,
      };

      // Store token
      localStorage.setItem('arep_token', mockResponse.token);
      localStorage.setItem('arep_user', JSON.stringify(user));

      return mockResponse;
    }

    // Real API call (when backend is ready)
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Store token
    localStorage.setItem('arep_token', response.data.token);
    localStorage.setItem('arep_user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    if (USE_MOCK) {
      // Mock register
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        id: String(MOCK_USERS.length + 1),
        email: data.email,
        fullName: data.fullName,
        role: data.role || 'viewer',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      MOCK_USERS.push(newUser);

      const mockResponse: AuthResponse = {
        user: newUser,
        token: 'mock-jwt-token-' + newUser.id,
        refreshToken: 'mock-refresh-token-' + newUser.id,
      };

      localStorage.setItem('arep_token', mockResponse.token);
      localStorage.setItem('arep_user', JSON.stringify(newUser));

      return mockResponse;
    }

    const response = await api.post<AuthResponse>('/auth/register', data);
    
    localStorage.setItem('arep_token', response.data.token);
    localStorage.setItem('arep_user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async logout(): Promise<void> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      localStorage.removeItem('arep_token');
      localStorage.removeItem('arep_user');
      return;
    }

    await api.post('/auth/logout');
    localStorage.removeItem('arep_token');
    localStorage.removeItem('arep_user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('arep_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('arep_token');
  }
}

export const authService = new AuthService();
