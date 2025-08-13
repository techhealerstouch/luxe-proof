"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/auth-service";
import { apiClient } from "@/lib/api-interceptor";
import { Loader2 } from "lucide-react";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  const executedRef = useRef(false); // ✅ prevent double execution

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || executedRef.current) return; // exit if already run

    executedRef.current = true;

    const handleAuth = async () => {
      try {
        localStorage.setItem("justLoggedIn", "true");

        // Exchange authorization code for access + refresh token
        const data = await authService.exchangeAuthorizationCode(code);

        // Store refresh token securely on backend
        await fetch(`${baseUrl}/api/store-refresh-token`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: data.refresh_token }),
        });

        // Store access token and expiry in localStorage
        apiClient.setAccessToken(data.access_token, data.expires_in);

        // Clean up PKCE verifier now that exchange succeeded
        sessionStorage.removeItem("pkce_code_verifier");

        // Redirect to dashboard
        window.location.href = "/dashboard";
      } catch (error: any) {
        console.error("OAuth callback error:", error);
        router.push("/login");
      }
    };

    handleAuth();
  }, [searchParams, router, baseUrl]);

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
      <p className="text-gray-600">Logging you in...</p>
    </div>
  );
}
