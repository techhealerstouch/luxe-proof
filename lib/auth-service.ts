// interface TokenResponse {
//   access_token: string;
//   refresh_token: string;
//   token_type: string;
//   expires_in: number;
// }

// interface UserData {
//   id: string;
//   account_id: string;
//   name: string;
//   email: string;
//   role: string;
//   account: {
//     name: string;
//     slug: string;
//   };
// }

// class AuthService {
//   private baseUrl: string;

//   constructor() {
//     this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
//   }

//   /**
//    * Exchange authorization code for access and refresh tokens
//    */
//   async exchangeAuthorizationCode(code: string): Promise<TokenResponse> {
//     const clientId = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID!;
//     const redirectUri = `${process.env.NEXT_PUBLIC_URL}/auth/callback`;

//     const codeVerifier = localStorage.getItem("pkce_code_verifier");
//     if (!codeVerifier) {
//       throw new Error(
//         "PKCE code verifier missing. Please start the login process again."
//       );
//     }

//     const params = new URLSearchParams();
//     params.append("grant_type", "authorization_code");
//     params.append("client_id", clientId);
//     params.append("redirect_uri", redirectUri);
//     params.append("code", code);
//     params.append("code_verifier", codeVerifier);

//     const response = await fetch(`${this.baseUrl}/oauth/token`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         Accept: "application/json",
//       },
//       body: params.toString(),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("OAuth token error response:", data);
//       throw new Error(
//         data.error_description || "Failed to exchange authorization code"
//       );
//     }

//     // Clean up the stored code_verifier after successful token exchange
//     localStorage.removeItem("pkce_code_verifier");

//     return data; // access_token, refresh_token, etc.
//   }

//   /**
//    * Refresh the access token using the refresh token stored in HTTP-only cookie
//    */
//   async refreshAccessToken(): Promise<string> {
//     try {
//       const response = await fetch(`${this.baseUrl}/api/refresh-token`, {
//         method: "POST",
//         credentials: "include", // Include HTTP-only cookies
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to refresh token");
//       }

//       const data = await response.json();
//       return data.access_token;
//     } catch (error) {
//       console.error("Token refresh failed:", error);
//       // Redirect to login if refresh fails
//       window.location.href = "/login";
//       throw error;
//     }
//   }

//   /**
//    * Fetch user data using the current access token
//    */
//   async fetchUserData(): Promise<UserData> {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       throw new Error("No access token available");
//     }

//     const response = await fetch(`${this.baseUrl}/api/user`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         // Token expired, try to refresh
//         const newToken = await this.refreshAccessToken();
//         localStorage.setItem("accessToken", newToken);

//         // Retry with new token
//         return this.fetchUserData();
//       }
//       throw new Error("Failed to fetch user data");
//     }

//     const userData = await response.json();

//     // Store user data in sessionStorage (consistent with your auth provider)
//     sessionStorage.setItem("user", JSON.stringify(userData));
//     sessionStorage.setItem("loggedIn", "true");

//     return userData;
//   }

//   /**
//    * Check if user is authenticated
//    */
//   isAuthenticated(): boolean {
//     const accessToken = localStorage.getItem("accessToken");
//     const user = sessionStorage.getItem("user");
//     return !!(accessToken && user);
//   }

//   /**
//    * Logout user by clearing tokens and redirecting
//    */
//   async logout(): Promise<void> {
//     try {
//       // Revoke tokens on server
//       await fetch(`${this.baseUrl}/api/logout`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });
//     } catch (error) {
//       console.error("Logout API call failed:", error);
//       // Continue with client-side cleanup even if server call fails
//     }

//     // Clear local storage and session storage
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("justLoggedIn");
//     localStorage.removeItem("pkce_code_verifier");
//     sessionStorage.removeItem("user");
//     sessionStorage.removeItem("auth_token");
//     sessionStorage.removeItem("loggedIn");

//     // Redirect to login
//     window.location.href = "/login";
//   }

//   /**
//    * Make authenticated API requests with automatic token refresh
//    */
//   async authenticatedRequest(
//     url: string,
//     options: RequestInit = {}
//   ): Promise<Response> {
//     let accessToken = localStorage.getItem("accessToken");

//     if (!accessToken) {
//       throw new Error("No access token available");
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${accessToken}`,
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     });

//     // If token is expired, try to refresh and retry
//     if (response.status === 401) {
//       try {
//         const newToken = await this.refreshAccessToken();
//         localStorage.setItem("accessToken", newToken);

//         // Retry the original request with new token
//         return fetch(url, {
//           ...options,
//           headers: {
//             ...options.headers,
//             Authorization: `Bearer ${newToken}`,
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//         });
//       } catch (error) {
//         // Refresh failed, redirect to login
//         await this.logout();
//         throw error;
//       }
//     }

//     return response;
//   }
// }

// export const authService = new AuthService();
