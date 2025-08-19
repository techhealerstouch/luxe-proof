"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface Account {
  name: string;
  slug: string;
}

interface User {
  id: string;
  account_id: string;
  name: string;
  email: string;
  role: string;
  businessName?: string;
  businessSlug?: string;
  password?: string;
  password_confirmation?: string;
  account: Account;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<User | void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
  exchangeAuthorizationCode: (code: string) => Promise<TokenResponse>;
  refreshAccessToken: () => Promise<string>;
  fetchUserData: (shouldRedirect?: boolean) => Promise<User>;
  isAuthenticated: () => boolean;
  authenticatedRequest: (
    url: string,
    options?: RequestInit
  ) => Promise<Response>;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  LOGGED_IN: "loggedIn",
  JUST_LOGGED_IN: "justLoggedIn",
  AUTH_TOKEN: "auth_token",
  PKCE_VERIFIER: "pkce_code_verifier",
} as const;

const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
} as const;

// ============================================================================
// Context & Provider
// ============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!;

  // ============================================================================
  // Storage Utilities
  // ============================================================================

  const clearAuthStorage = useCallback(() => {
    // Clear all auth-related items from storage
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }, []);

  const storeUserData = useCallback((userData: User) => {
    sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    sessionStorage.setItem(STORAGE_KEYS.LOGGED_IN, "true");
    setUser(userData);
  }, []);

  const getStoredUser = useCallback((): User | null => {
    try {
      const storedUser = sessionStorage.getItem(STORAGE_KEYS.USER);
      if (!storedUser) return null;

      const parsedUser = JSON.parse(storedUser);
      // Handle both nested and direct user object structures
      return parsedUser.data || parsedUser;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      sessionStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  }, []);

  // ============================================================================
  // Token Management
  // ============================================================================

  const exchangeAuthorizationCode = useCallback(
    async (code: string): Promise<TokenResponse> => {
      const clientId = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID!;
      const redirectUri = `${process.env.NEXT_PUBLIC_URL}/auth/callback`;
      const codeVerifier = localStorage.getItem(STORAGE_KEYS.PKCE_VERIFIER);

      if (!codeVerifier) {
        throw new Error(
          "PKCE code verifier missing. Please start the login process again."
        );
      }

      const params = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code: code,
        code_verifier: codeVerifier,
      });

      try {
        const response = await fetch(`${baseUrl}/oauth/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: params.toString(),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("OAuth token error response:", data);
          throw new Error(
            data.error_description || "Failed to exchange authorization code"
          );
        }

        // Clean up after successful exchange
        localStorage.removeItem(STORAGE_KEYS.PKCE_VERIFIER);
        return data;
      } catch (error) {
        console.error("Token exchange failed:", error);
        throw error;
      }
    },
    [baseUrl]
  );

  const refreshAccessToken = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch(`${baseUrl}/api/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      window.location.href = ROUTES.LOGIN;
      throw error;
    }
  }, [baseUrl]);

  // ============================================================================
  // User Data Management
  // ============================================================================

  const fetchUserData = useCallback(
    async (shouldRedirect = false): Promise<User> => {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!accessToken) {
        throw new Error("No access token available");
      }

      try {
        const response = await fetch(`${baseUrl}/api/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired, try to refresh
            const newToken = await refreshAccessToken();
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
            // Retry with new token
            return fetchUserData(shouldRedirect);
          }
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        const userObject = userData.data || userData;

        // Store user data
        storeUserData(userObject);

        // Show success message only for new logins
        if (sessionStorage.getItem(STORAGE_KEYS.JUST_LOGGED_IN)) {
          toast.success("Logged in successfully!");
          sessionStorage.removeItem(STORAGE_KEYS.JUST_LOGGED_IN);
        }

        // Handle redirect if needed
        if (shouldRedirect) {
          router.push(ROUTES.DASHBOARD);
        }

        return userObject;
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
      }
    },
    [baseUrl, refreshAccessToken, router, storeUserData]
  );

  const updateUser = useCallback(
    async (userData: Partial<User>): Promise<User | void> => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        throw new Error("No auth token found");
      }

      const payload = {
        name: userData.name,
        email: userData.email,
        account: {
          name: userData.businessName,
          slug: userData.businessSlug,
        },
      };

      try {
        const response = await axios.put(`${baseUrl}/api/user`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const userObject = response.data.data || response.data;
        storeUserData(userObject);
        toast.success("Profile Updated Successfully!");
        return userObject;
      } catch (error) {
        toast.error("Profile Update Failed!");
        throw error;
      }
    },
    [baseUrl, storeUserData]
  );

  // ============================================================================
  // Authentication Methods
  // ============================================================================

  const isAuthenticated = useCallback((): boolean => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const user = sessionStorage.getItem(STORAGE_KEYS.USER);
    return !!(accessToken && user);
  }, []);

  const authenticatedRequest = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const makeRequest = async (token: string) => {
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      };

      const response = await makeRequest(accessToken);

      // Handle token expiration
      if (response.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
          return makeRequest(newToken);
        } catch (error) {
          await logout();
          throw error;
        }
      }

      return response;
    },
    [refreshAccessToken]
  );

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
      confirmPassword: string
    ): Promise<void> => {
      console.log(currentPassword);
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      try {
        const apiBaseUrl = baseUrl;
        const response = await authenticatedRequest(
          `${apiBaseUrl}/api/user/change-password`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
              currentPassword,
              newPassword,
              newPassword_confirmation: confirmPassword,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to change password");
        }

        toast.success("Password changed successfully!");
      } catch (error: any) {
        toast.error(error.message || "Password change failed");
        throw error;
      }
    },
    [authenticatedRequest, baseUrl]
  );

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        await fetch(`${baseUrl}/api/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clean up client-side
      clearAuthStorage();
      setUser(null);
      window.location.href = ROUTES.LOGIN;
    }
  }, [baseUrl, clearAuthStorage]);

  // ============================================================================
  // Initialization Effect
  // ============================================================================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const justLoggedIn = sessionStorage.getItem(
          STORAGE_KEYS.JUST_LOGGED_IN
        );

        // Case 1: Just completed OAuth login
        if (justLoggedIn && accessToken) {
          await fetchUserData(true); // Redirect to dashboard
          return;
        }

        // Case 2: Check for existing session
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          // Redirect to dashboard if user is already logged in and not on dashboard
          if (window.location.pathname === ROUTES.LOGIN) {
            router.push(ROUTES.DASHBOARD);
          }
          return;
        }

        // Case 3: Has token but no user data (refresh scenario)
        if (accessToken) {
          try {
            await fetchUserData(true); // Redirect to dashboard
          } catch (error) {
            console.error("Failed to restore session:", error);
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []); // Only run once on mount

  // ============================================================================
  // Context Value
  // ============================================================================

  const contextValue: AuthContextType = {
    user,
    isLoading,
    logout,
    updateUser,
    changePassword,
    exchangeAuthorizationCode,
    refreshAccessToken,
    fetchUserData,
    isAuthenticated,
    authenticatedRequest,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// ============================================================================
// Custom Hook
// ============================================================================

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
