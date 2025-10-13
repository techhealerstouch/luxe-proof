"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { AuthLoading } from "./auth-loading";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/auth/callback",
];

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Check if it's a public route OR an NFC verification page
  const isPublicRoute =
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    // Match any route that looks like a ref_code (e.g., /ABC123, /XYZ789)
    /^\/[A-Za-z0-9_-]+$/.test(pathname);

  useEffect(() => {
    if (!isLoading) {
      // Redirect to login if accessing protected route without auth
      if (!isPublicRoute && !isAuthenticated()) {
        router.push(`/login?from=${encodeURIComponent(pathname)}`);
      }

      // Redirect to dashboard if accessing login while authenticated
      if (isPublicRoute && isAuthenticated() && pathname === "/login") {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, isPublicRoute, pathname, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <AuthLoading />;
  }

  // For protected routes, ensure user is loaded
  if (!isPublicRoute && !user) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}
