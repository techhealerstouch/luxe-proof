// lib/api/api-certificate.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Get access token from localStorage
 */
const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const certificateApi = {
  /**
   * Download PDF certificate
   */
  async downloadCertificate(productId: string): Promise<void> {
    const token = getAccessToken();

    if (!token) {
      throw new Error("No access token found. Please login again.");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth-products/${productId}/certificate/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error("Failed to download certificate");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Fix: Convert to string first, then pad
      a.download = `AUTH-${String(productId).padStart(8, "0")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    }
  },

  /**
   * Preview PDF in new tab
   */
  async previewCertificate(productId: string): Promise<void> {
    const token = getAccessToken();

    if (!token) {
      throw new Error("No access token found. Please login again.");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth-products/${productId}/certificate/preview`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error("Failed to preview certificate");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Clean up after a delay
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Preview failed:", error);
      throw error;
    }
  },
};
