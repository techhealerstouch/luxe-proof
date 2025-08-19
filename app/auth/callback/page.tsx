"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { exchangeAuthorizationCode, fetchUserData } = useAuth();
  const [status, setStatus] = useState<"processing" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!;

  // Use a ref to track if we've already started processing
  const processingStarted = useRef(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    // Prevent double execution
    if (processingStarted.current) {
      return;
    }
    processingStarted.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const state = searchParams.get("state");

    // Check for OAuth errors
    if (error) {
      console.error("OAuth error:", error);
      setStatus("error");
      setErrorMessage("Authentication was cancelled or failed");
      setTimeout(() => {
        router.push("/login?error=oauth_failed");
      }, 2000);
      return;
    }

    // Validate authorization code
    if (!code) {
      console.error("No authorization code received");
      setStatus("error");
      setErrorMessage("No authorization code received");
      setTimeout(() => {
        router.push("/login?error=no_code");
      }, 2000);
      return;
    }

    const handleAuth = async () => {
      // Double-check we're not already processing
      if (isProcessing.current) {
        console.log("Already processing authentication");
        return;
      }
      isProcessing.current = true;

      try {
        // Check if we've already exchanged this code
        const existingToken = localStorage.getItem("accessToken");
        const alreadyProcessed = sessionStorage.getItem("oauth_processed");

        if (existingToken && alreadyProcessed === code) {
          console.log("Code already processed, redirecting to dashboard");
          router.push("/dashboard");
          return;
        }

        // Mark that we're about to process this code
        sessionStorage.setItem("oauth_processed", code);
        sessionStorage.setItem("justLoggedIn", "true");

        console.log("Exchanging authorization code...");

        // Exchange code for tokens
        const data = await exchangeAuthorizationCode(code);

        if (!data || !data.access_token) {
          throw new Error("No access token received from server");
        }

        console.log("Token exchange successful");

        // Store access token
        localStorage.setItem("accessToken", data.access_token);

        // Store refresh token in httpOnly cookie if your backend supports it
        if (data.refresh_token) {
          try {
            await fetch(`${baseUrl}/api/store-refresh-token`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.access_token}`,
              },
              body: JSON.stringify({ refresh_token: data.refresh_token }),
            });
          } catch (error) {
            console.warn("Failed to store refresh token in cookie:", error);
            // Continue anyway - the refresh token might be handled differently
          }
        }

        // Fetch user data
        console.log("Fetching user data...");
        await fetchUserData(true); // This will redirect to dashboard
      } catch (error: any) {
        console.error("OAuth callback error:", error);

        // Clean up on error
        sessionStorage.removeItem("oauth_processed");
        sessionStorage.removeItem("justLoggedIn");
        localStorage.removeItem("accessToken");

        setStatus("error");

        // Parse error message
        if (error.message?.includes("invalid_grant")) {
          setErrorMessage(
            "Authorization code has expired or was already used. Please try logging in again."
          );
        } else if (error.message?.includes("redirect_uri")) {
          setErrorMessage("Configuration error. Please contact support.");
        } else {
          setErrorMessage(
            error.message || "Authentication failed. Please try again."
          );
        }

        setTimeout(() => {
          router.push("/login?error=auth_failed");
        }, 3000);
      } finally {
        isProcessing.current = false;
      }
    };

    // Start the authentication process
    handleAuth();
  }, []); // Empty dependency array - only run once

  if (status === "error") {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 bg-gray-50">
        <div className="text-red-500">
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-800 font-medium text-center max-w-md">
          {errorMessage}
        </p>
        <p className="text-sm text-gray-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4 bg-gray-50">
      <Loader2 className="h-10 w-10 animate-spin text-gray-700" />
      <p className="text-gray-800 font-medium text-lg">
        Completing authentication...
      </p>
      <p className="text-sm text-gray-500">
        Please wait while we set up your account
      </p>
    </div>
  );
}
