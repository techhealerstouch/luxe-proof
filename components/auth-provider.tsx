"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user session
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
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
        sessionStorage.setItem("access_token", data.access_token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("loggedIn", "true"); // ✅ mark logged in
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
        sessionStorage.setItem("auth_token", data.token);
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

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/login");
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
