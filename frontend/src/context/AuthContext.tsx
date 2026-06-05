import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
export const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if a valid session exists
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get<{ success: boolean; user: User }>('/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  // ─── Actions ───────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<void> => {
    const { data } = await axiosInstance.post<{ success: boolean; user: User }>('/auth/login', {
      email,
      password,
    });
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const { data } = await axiosInstance.post<{ success: boolean; user: User }>('/auth/register', {
      name,
      email,
      password,
    });
    setUser(data.user);
  };

  const logout = async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
    setUser(null);
  };

  const extractMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string; errors?: { msg: string }[] } | undefined;
      return data?.message ?? data?.errors?.[0]?.msg ?? 'Something went wrong';
    }
    return 'Something went wrong';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: async (email, password) => {
          try {
            await login(email, password);
          } catch (err) {
            throw new Error(extractMessage(err));
          }
        },
        register: async (name, email, password) => {
          try {
            await register(name, email, password);
          } catch (err) {
            throw new Error(extractMessage(err));
          }
        },
        logout: async () => {
          try {
            await logout();
          } catch {
            setUser(null);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
