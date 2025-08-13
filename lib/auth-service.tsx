import type { User } from "./api-service"

class AuthService {
  // Replace with your actual backend API domain
  //private baseUrl = "http://localhost:3000/api" 
  private baseUrl = process.env.NEXT_PUBLIC_API_URL!;


async login(email: string, password: string) {
  const domain = "luxesuite";

  const response = await fetch(`${this.baseUrl}/api/${domain}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });



  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const json = await response.json();
  return json;
}


  async register(data: {
    businessName: string;
    slug: string;
    fullName: string;
    email: string;
    password: string;
  }) {
    const response = await fetch(`${this.baseUrl}/api/register`, {
      method: "POST",
      credentials: "include", // ⬅️ include cookies for security headers
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  }

async exchangeAuthorizationCode(code: string) {
  const clientId = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/auth/callback`;

  const codeVerifier = sessionStorage.getItem("pkce_code_verifier");
  if (!codeVerifier) {
    throw new Error(
      "PKCE code verifier missing. Please start the login process again."
    );
  }

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", clientId);
  params.append("redirect_uri", redirectUri);
  params.append("code", code);
  params.append("code_verifier", codeVerifier);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("OAuth token error response:", data);
    throw new Error(data.error_description || "Failed to exchange authorization code");
  }

  // Clean up the stored code_verifier after successful token exchange
  sessionStorage.removeItem("pkce_code_verifier");

  return data; // access_token, refresh_token, etc.
}


async getUser(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  }




async getCurrentUser(): Promise<User> {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${this.baseUrl}/api/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) throw new Error("User fetch failed");

  const json = await response.json();
  return json.data; // ✅ only return the actual user object
}

  async refreshAccessToken() {
    const response = await fetch(`${this.baseUrl}/api/refresh-token`, {
      method: "POST",
      credentials: "include", // ⬅️ Important for sending cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    return data.access_token;
  }

async logout() {
  try {
    // Remove access token from localStorage
    localStorage.removeItem("accessToken");

    // Call backend to clear the refresh token cookie
    await fetch(`${this.baseUrl}/api/logout`, {
      method: "POST",
      credentials: "include", // include cookies
    });

    // Optionally redirect or update UI
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
}

export const authService = new AuthService();
