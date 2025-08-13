"use client";


import { useEffect, useState } from "react";

import type React from "react";
import { useRouter } from "next/navigation";
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

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth-provider";
import Image from "next/image";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Zod Schema for validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();

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
=======
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const success = await login(data.email, data.password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("root", {
          type: "manual",
          message: "Invalid email or password",
        });
      }
    } catch {
      setError("root", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl">
        {/* Left Side Image */}
        <div className="relative w-full md:w-1/2 h-48 md:h-auto">
          <Image
            src="/images/watch-login.png"
            alt="Login illustration"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right Side Form */}
        <div className="flex items-center justify-center w-full md:w-1/2 p-8">
          <Card className="w-full border-none shadow-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-left">
                Login
              </CardTitle>
              <CardDescription className="text-left">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {errors.root && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.root.message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    className="rounded-xl"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="rounded-xl"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
                <p className="text-center text-sm text-gray-600">
                  {"Don't have an account? "}
                  <Link href="/register" className="font-bold text-black">
                    Register
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

    </div>
  );
}
