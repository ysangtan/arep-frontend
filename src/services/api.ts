// api.ts
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const ACCESS_TOKEN_KEY = 'arep_token';
const REFRESH_TOKEN_KEY = 'arep_refresh_token';
const USER_KEY = 'arep_user';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ---------- Request: attach access token ----------
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? new AxiosHeaders();
      (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- 401 handling with refresh ----------
let isRefreshing = false;
let queue: Array<{ resolve: (v?: unknown) => void; reject: (e: unknown) => void }> = [];

const flushQueue = (error: unknown, token: string | null) => {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token as unknown);
  });
  queue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status !== 401 || !original) {
      return Promise.reject(error);
    }

    // avoid infinite loop
    if (original._retry) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
      return Promise.reject(error);
    }
    original._retry = true;

    // if a refresh is in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(() => api(original));
    }

    isRefreshing = true;
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw error;

      // call refresh with Bearer refresh token
      const resp = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { headers: new AxiosHeaders({ Authorization: `Bearer ${refreshToken}` }) }
      );

      // ⬇️ unwrap backend envelope: { success, data: { accessToken, refreshToken, user } }
      const raw = resp.data as any;
      const d = raw?.data ?? raw;

      const newAccess: string | undefined = d?.accessToken ?? d?.token;
      const newRefresh: string | undefined = d?.refreshToken;

      if (!newAccess || !newRefresh) throw new Error('Invalid refresh response');

      localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);

      flushQueue(null, newAccess);

      // retry original with new token
      original.headers =
        original.headers instanceof AxiosHeaders
          ? original.headers
          : new AxiosHeaders(original.headers);

      (original.headers as AxiosHeaders).set('Authorization', `Bearer ${newAccess}`);

      return api(original);
    } catch (err) {
      flushQueue(err, null);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
