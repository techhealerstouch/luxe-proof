// API interceptor for handling authentication tokens with HTTP-only cookie for refresh token
class ApiInterceptor {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;
  private lastRefreshAttempt = 0;

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string, expiresIn?: number) {
    localStorage.setItem("accessToken", token);

    if (expiresIn) {
      // Store the absolute expiry time in ms
      const expiryTime = Date.now() + expiresIn * 1000;
      localStorage.setItem("tokenExpiry", String(expiryTime));
    }
  }

  /**
   * Check if token is expired or close to expiry (within 60s)
   */
  private isTokenExpired(): boolean {
    const expiry = Number(localStorage.getItem("tokenExpiry") || 0);
    if (!expiry) return false; // No expiry info means we don't force refresh
    return Date.now() >= expiry - 60_000;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    // Add authorization header if token exists
    let token = localStorage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: "include", // Always include cookies
    };

    try {
      // If token is expired or about to expire, refresh it before making the request
      if (this.isTokenExpired() && !this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshPromise = this.refreshToken();
        token = await this.refreshPromise;
        this.isRefreshing = false;
        this.refreshPromise = null;

        if (token) {
          localStorage.setItem("accessToken", token);
          requestOptions.headers = {
            ...requestOptions.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      } else if (this.isRefreshing && this.refreshPromise) {
        // Wait if another refresh is already happening
        token = await this.refreshPromise;
        if (token) {
          requestOptions.headers = {
            ...requestOptions.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      }

      const response = await fetch(url, requestOptions);

      // Handle 401 (e.g., token expired unexpectedly)
      if (response.status === 401) {
        try {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshPromise = this.refreshToken();
          }

          const newToken = await this.refreshPromise;
          this.isRefreshing = false;
          this.refreshPromise = null;

          if (newToken) {
            localStorage.setItem("accessToken", newToken);
            return this.request(endpoint, options); // Retry original request
          }
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("tokenExpiry");
          window.location.href = "/login";
          throw refreshError;
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

        const error: any = new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  private async refreshToken(): Promise<string> {
    const now = Date.now();

    // Avoid spam-refreshing within 1 second
    if (now - this.lastRefreshAttempt < 1000) {
      return localStorage.getItem("accessToken") || "";
    }
    this.lastRefreshAttempt = now;

    try {
      const { access_token, expires_in } =
        await authService.refreshAccessToken();

      // Save both token and expiry
      this.setAccessToken(access_token, expires_in);
      return access_token;
    } catch (error) {
      console.error("Refresh failed:", error);
      throw error;
    }
  }

  // Convenience methods
  get(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint: string, data?: any, options?: RequestInit) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put(endpoint: string, data?: any, options?: RequestInit) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { authService } from "./auth-service";
export const apiClient = new ApiInterceptor(BASE_URL);
