// ============================================================================
// app/login/page.tsx - Updated Login Page
// ============================================================================
"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { AuthLoading } from "@/components/auth-loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// PKCE Helpers
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
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check for error messages in URL
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "oauth_failed":
          setError("OAuth authentication failed. Please try again.");
          break;
        case "no_code":
          setError("Authentication incomplete. Please try again.");
          break;
        case "auth_failed":
          setError("Authentication failed. Please check your credentials.");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
    }

    // Redirect if already logged in
    if (!isLoading && user) {
      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
    }
  }, [user, isLoading, router, searchParams]);

  const redirectToOAuth = async () => {
    setIsRedirecting(true);
    const clientId = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID!;
    const redirectUri = `${process.env.NEXT_PUBLIC_URL}/auth/callback`;

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem("pkce_code_verifier", codeVerifier);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const authUrl = `${
      process.env.NEXT_PUBLIC_API_URL
    }/oauth/authorize?${params.toString()}`;

    window.location.href = authUrl;
  };

  // Show loading while checking auth status
  if (isLoading) {
    return <AuthLoading />;
  }

  // Prevent flash of login page if user is authenticated
  if (user) {
    return <AuthLoading />;
  }

  // Show loading when redirecting to OAuth
  if (isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
        <p className="text-gray-600">Redirecting to Lux Suite...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="relative w-full md:w-1/2 h-48 md:h-auto">
          <Image
            src="/images/watch-login.png"
            alt="Login illustration"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex items-center justify-center w-full md:w-1/2 p-8">
          <Card className="w-full border-none shadow-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-3xl font-extrabold tracking-tight text-gray-900">
                Welcome Back 👋
              </CardTitle>
              <CardDescription className="text-left leading-relaxed text-center">
                To access your personalized dashboard and manage your Lux Suite
                account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full rounded-xl"
                onClick={redirectToOAuth}
                disabled={isRedirecting}
              >
                {isRedirecting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                    Redirecting...
                  </span>
                ) : (
                  "Log-in with Lux Suite"
                )}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col items-center space-y-4">
              <p className="text-center text-sm text-gray-600">
                {"Don't have an account? "}
                <Link href="/register" className="font-bold text-black">
                  Register
                </Link>
              </p>
              <p className="text-xs text-gray-500">
                Need support?{" "}
                <Link href="/support" className="underline">
                  Contact our help team
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
