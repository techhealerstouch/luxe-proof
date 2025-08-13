"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

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
interface Account {
  name: string;
  slug: string;
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
  updateUser: (userData: Partial<User>) => Promise<User | void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
        sessionStorage.setItem("auth_token", data.access_token);

        // Assign account explicitly if returned
        const userWithAccount: User = {
          ...data.user,
          account: data.account || null,
        };
        sessionStorage.setItem("user", JSON.stringify(userWithAccount));
        setUser(userWithAccount);

        sessionStorage.setItem("loggedIn", "true");
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
        role: data.user.role ?? "user",
        account: {
          name: data.account.name,
          slug: data.account.slug,
        },
      };

      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));

      console.log(data.message);
      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Registration failed";
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("auth_token");
    router.push("/login");
  };

  const updateUser = async (userData: {
    name?: string;
    email?: string;
    password?: string;
    businessSlug?: string;
    businessName?: string;
    password_confirmation?: string;
  }): Promise<User | void> => {
    const userString = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("auth_token");

    if (!userString || !token) return;

    const currentUser: User = JSON.parse(userString);

    try {
      const payload: any = {
        name: userData.name ?? currentUser.name,
        email: userData.email ?? currentUser.email,
        account: {
          name: userData.businessName ?? currentUser.account?.name ?? "",
          slug: userData.businessSlug ?? currentUser.account?.slug ?? "",
        },
      };

      // Do not include password here for security — handle password changes separately
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user`,
        payload,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.data);
      sessionStorage.setItem("user", JSON.stringify(response.data.data));
      toast.success("Profile Updated Successfully!");
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        toast.error("Profile Update Failed!");
        throw error.response.data.errors;
      }
      toast.error("Profile Update Failed!", error.message);
      throw error;
    }
  };

  // New: Change password function calling dedicated endpoint
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) throw new Error("User is not authenticated");

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/change-password`,
        {
          currentPassword,
          newPassword,
          newPassword_confirmation: confirmPassword,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Password changed successfully!");
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        toast.error("Failed to change password. Please try again.");
        throw new Error("Failed to change password. Please try again.");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateUser, changePassword }}
    >
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
