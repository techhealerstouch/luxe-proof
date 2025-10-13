class AuthService {
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OAuth token error response:", data);
      throw new Error(
        data.error_description || "Failed to exchange authorization code"
      );
    }

    sessionStorage.removeItem("pkce_code_verifier");

    return data;
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

  async getCurrentUser() {
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

  async checkSerialNumber(serialNumber: string) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    const response = await fetch(
      `${this.baseUrl}/api/auth-products/check-serial`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serial_number: serialNumber.trim(),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.error ||
          "Failed to validate serial number"
      );
    }

    const data = await response.json();
    return data;
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
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
}

export const authService = new AuthService();
