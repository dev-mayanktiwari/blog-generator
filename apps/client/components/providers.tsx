"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import apiClient, { authService } from "@/lib/apiClient";
import { TUserLoginInput, TUserRegistrationInput } from "@workspace/types";

interface User {
  id?: string;
  email: string;
  name: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  );
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkUser = async () => {
      setLoading(true);
      try {
        const res = await authService.checkAuth();
        console.log("Check auth response:", res);
        // @ts-ignore
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const credentials: TUserLoginInput = {
        email,
        password,
        registerType: "EMAIL",
      };
      const res = await authService.login(credentials);
      console.log("Login response:", res);
      // @ts-ignore
      setUser(res.data.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const userData: TUserRegistrationInput = {
        name,
        email,
        password,
        registerType: "EMAIL",
      };
      const res = await authService.signup(userData);
      console.log("Registration response:", res);
      // setUser(res.data.user); 
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiClient.post("/auth/logout");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isLoggedIn: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
