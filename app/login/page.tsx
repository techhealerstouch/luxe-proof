"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authService } from "@/lib/auth-service";
import { Loader2 } from "lucide-react";

// Helper functions for PKCE
function base64UrlEncode(buffer: Uint8Array) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateCodeVerifier() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

export default function LoginPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        if (isMounted) setCheckingAuth(false);
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        if (user && isMounted) {
          router.replace("/dashboard");
        }
      } catch {
        localStorage.removeItem("accessToken");
        if (isMounted) setCheckingAuth(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (checkingAuth)
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
      </div>
    );

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      return null; // Prevent double redirect
    }
  }

  // Updated redirectToOAuth with PKCE support
  const redirectToOAuth = async () => {
    const clientId = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID!;
    const redirectUri = `${process.env.NEXT_PUBLIC_URL}/auth/callback`;

    // Generate code_verifier and code_challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Save code_verifier to localStorage for token exchange later
    sessionStorage.setItem("pkce_code_verifier", codeVerifier);

    // Build OAuth authorize URL with PKCE params
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "", // Add scopes if needed
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const authUrl = `${process.env.NEXT_PUBLIC_API_URL}/oauth/authorize?${params.toString()}`;

    // Redirect user to OAuth server
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <h1 className="text-2xl font-bold text-dark-600">Luxe Proof</h1>
          </div>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in using your Luxe Suite account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={redirectToOAuth} className="w-full">
              Sign in with Luxe Suite
            </Button>
            <div className="text-center text-sm">
              Don’t have an account?{" "}
              <Link href="/register" className="text-purple-600 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
