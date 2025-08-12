// API interceptor for handling authentication tokens with HTTP-only cookie for refresh token
class ApiInterceptor {
  private baseUrl: string
  private isRefreshing = false
  private refreshPromise: Promise<string> | null = null

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`

    // Add authorization header if token exists
    const token = localStorage.getItem("accessToken")
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    // Always include credentials to send cookies
    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: "include",
    }

    try {
      const response = await fetch(url, requestOptions)

      // Handle token refresh on 401
      if (response.status === 401) {
        // Try to refresh the token
        try {
          // Use a single refresh promise to prevent multiple refresh requests
          if (!this.isRefreshing) {
            this.isRefreshing = true
            this.refreshPromise = this.refreshToken()
          }

          // Wait for the refresh to complete
          const newToken = await this.refreshPromise

          // Update the access token
          localStorage.setItem("accessToken", newToken)

          // Reset refresh state
          this.isRefreshing = false
          this.refreshPromise = null

          // Retry original request with new token
          return this.request(endpoint, options)
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem("accessToken")
          window.location.href = "/login"
          throw refreshError
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = null;

        try {
          errorData = JSON.parse(errorText);
        } catch {
          // Not JSON, ignore parse error
        }

        // Use the API's error message if available, fallback to generic
        const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`



        const error: any = new Error(errorMessage);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

private lastRefreshAttempt = 0;

private async refreshToken(): Promise<string> {
  const now = Date.now();
  if (now - this.lastRefreshAttempt < 1000) {
    // If last refresh was less than 1s ago, avoid retrying immediately
    throw new Error("Refresh cooldown active");
  }
  this.lastRefreshAttempt = now;


  try {
    const newToken = await authService.refreshAccessToken();

    return newToken;
  } catch (error) {
    console.error("Refresh failed:", error);
    throw error;
  }
}


  // Convenience methods
  get(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: "GET" })
  }

  post(endpoint: string, data?: any, options?: RequestInit) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  put(endpoint: string, data?: any, options?: RequestInit) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: "DELETE" })
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
import { authService } from "./auth-service"
export const apiClient = new ApiInterceptor(BASE_URL)
