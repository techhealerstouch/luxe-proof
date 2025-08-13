"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth-service";
import axios from "axios";

interface User {
  name: string;
  email: string;
  account: {
    name: string;
    slug: string;
  };
}


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    businessName: string
  ) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

 useEffect(() => {
    const loadUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error("Invalid access token, logging out.");
        localStorage.removeItem("accessToken");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/luxeproof/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("loggedIn", "true"); // ✅ mark logged in
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    businessName: string
  ): Promise<boolean> => {
    try {
      const slug = businessName.toLowerCase().replace(/\s+/g, "-");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
        {
          slug,
          business_name: businessName,
          name,
          email,
          password,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = response;

      if (data.token) {
        localStorage.setItem("accessToken", data.token);
      }

      const userData: User = {
        id: data.user.id,
        account_id: data.user.account_id,
        name: data.user.name,
        email: data.user.email,
        businessName: data.user.businessName,
        businessSlug: data.user.businessSlug,
        role: data.user.role ?? "user",
      };

      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));

      return data.message;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.response?.data?.error;
      // Instead of returning false, throw an error
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      // Server will clear the HTTP-only refresh token cookie
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  const updateUser = async (userData: {
    name?: string;
    email?: string;
    password?: string;
  }) => {
    const userString = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("access_token");

    if (!userString || !token) {
      return;
    }

    const user = JSON.parse(userString);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${user.id}`,
        userData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state and storage
      setUser(response.data.data);
      localStorage.setItem("user", JSON.stringify(response.data.data));
    } catch (error: any) {
      if (error.response) {
        console.error("Validation failed:", error.response.data.errors);
      } else {
        console.error("Update failed:", error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
