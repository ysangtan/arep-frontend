// authService.ts
import api from "./api";
import {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from "@/types/user.types";

const ACCESS_TOKEN_KEY = "arep_token";
const REFRESH_TOKEN_KEY = "arep_refresh_token";
const USER_KEY = "arep_user";

// Mock data for frontend development
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@arep.com",
    fullName: "Admin User",
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "ba@arep.com",
    fullName: "Emily Johnson",
    role: "ba",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Toggle via env if you want: const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const USE_MOCK = false;

// Allow either {accessToken} or {token}
type AnyAuthResponse = {
  user: User;
  accessToken?: string;
  token?: string;
  refreshToken: string;
};
// helpers at top of file (below imports)
type RawAuth = {
  user: User;
  accessToken?: string;
  token?: string;
  refreshToken: string;
};
const unwrapAuth = (raw: any): RawAuth => (raw?.data ? raw.data : raw); // <-- unwrap { data: ... }

// keep your existing persistSession, but it expects access token present
function persistSession(res: RawAuth) {
  const access = res.accessToken ?? res.token;
  if (!access) throw new Error("Missing access token");
  localStorage.setItem("arep_token", access);
  localStorage.setItem("arep_refresh_token", res.refreshToken);
  localStorage.setItem("arep_user", JSON.stringify(res.user));
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const user = MOCK_USERS.find((u) => u.email === credentials.email);
      if (!user || credentials.password !== "password123")
        throw new Error("Invalid credentials");

      const mockResponse: AnyAuthResponse = {
        user,
        accessToken: "mock-jwt-token-" + user.id,
        refreshToken: "mock-refresh-token-" + user.id,
      };
      persistSession(mockResponse);

      // normalize return to your AuthResponse type
      return {
        user,
        token: mockResponse.accessToken!,
        refreshToken: mockResponse.refreshToken,
      } as unknown as AuthResponse;
    }

    const { data } = await api.post("/auth/login", credentials);
    const auth = unwrapAuth(data);
    persistSession(auth);
    return {
      user: auth.user,
      token: auth.accessToken ?? auth.token!,
      refreshToken: auth.refreshToken,
    } as AuthResponse;
  }

  async register(payload: RegisterData): Promise<AuthResponse> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const newUser: User = {
        id: String(MOCK_USERS.length + 1),
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role || "viewer",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_USERS.push(newUser);

      const mockResponse: AnyAuthResponse = {
        user: newUser,
        accessToken: "mock-jwt-token-" + newUser.id,
        refreshToken: "mock-refresh-token-" + newUser.id,
      };
      persistSession(mockResponse);

      return {
        user: newUser,
        token: mockResponse.accessToken!,
        refreshToken: mockResponse.refreshToken,
      } as unknown as AuthResponse;
    }

    const { data } = await api.post("/auth/register", payload);
    const auth = unwrapAuth(data);
    persistSession(auth);
    return {
      user: auth.user,
      token: auth.accessToken ?? auth.token!,
      refreshToken: auth.refreshToken,
    } as AuthResponse;
  }

  async logout(): Promise<void> {
    try {
      if (!USE_MOCK) {
        await api.post("/auth/logout");
      }
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  getCurrentUser(): User | null {
    const str = localStorage.getItem(USER_KEY);
    if (!str) return null;
    try {
      return JSON.parse(str) as User;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }
}

export const authService = new AuthService();
