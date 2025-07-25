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

// Dummy users data
const DUMMY_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "user@example.com",
    password: "user123",
    role: "user",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = DUMMY_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        account_id: "345",
        email: foundUser.email,
        role: foundUser.role,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }
    return false;
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
        "http://127.0.0.1:8000/api/register",
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

      console.log("User data after registration:", userData);
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
    localStorage.removeItem("user");
    router.push("/login");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
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
