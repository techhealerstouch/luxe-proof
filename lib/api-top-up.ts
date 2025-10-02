// lib/api-top-up.ts
import axios from "axios";

interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  freeAuthentications?: number;
  nfcCards?: number;
}

interface BackendCredit {
  id: number;
  name: string;
  quantity: number;
  price: string;
  currency: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Map backend credit data to frontend package format
const mapBackendToPackage = (credit: BackendCredit): Package => {
  const price = parseFloat(credit.price);
  const totalAuth = credit.quantity;

  // Calculate credits: quantity * 1000 (since each authentication = 1000 credits)
  const credits = totalAuth * 1000;

  // NFC cards match the total authentications
  const nfcCards = totalAuth;

  // Mark Basic Package as popular
  const popular = credit.name === "Basic Package";

  return {
    id: credit.id.toString(),
    name: credit.name,
    credits: credits,
    price: price,
    popular: popular,
    freeAuthentications: 0,
    nfcCards: nfcCards,
  };
};

/**
 * Fetch available credit packages from the backend
 * @returns Promise<Package[]> - Array of available packages
 * @throws Error if the request fails
 */
export const fetchPackages = async (): Promise<Package[]> => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(`${API_BASE_URL}/api/credits`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data
        .filter((credit: BackendCredit) => credit.name !== "Custom Package")
        .map(mapBackendToPackage);
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Failed to fetch packages:", error);
    throw error;
  }
};

/**
 * Create an invoice for a credit top-up purchase
 * @param userId - The user's ID
 * @param creditId - The credit package ID (required)
 * @param quantity - Number of authentications
 * @returns Promise<string> - The invoice URL
 * @throws Error if the request fails
 */
export const createInvoice = async (
  userId: string,
  creditId: string,
  quantity: number
): Promise<string> => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/authenticator/top-up`,
      {
        user_id: userId,
        credit_id: creditId,
        quantity: quantity,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success && response.data.invoice_url) {
      return response.data.invoice_url;
    }
    throw new Error(response.data.message || "Failed to create invoice");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        throw new Error("Network error. Please check your connection.");
      }
    }
    throw error;
  }
};

export type { Package, BackendCredit };
