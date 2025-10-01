// lib/api-nfc-service.ts

interface NfcLink {
  id: number;
  ref_code: string;
  account_id: number | null;
  authenticated_products_id: number | null;
  status: "unused" | "used";
  created_at: string;
  updated_at: string;
}

interface ExistingNfcCheck {
  has_nfc: boolean;
  nfc_data?: {
    ref_code: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

interface ApiResponse<T = any> {
  success?: boolean;
  valid?: boolean;
  message: string;
  data?: T;
}

const getAuthToken = (): string => {
  return localStorage?.getItem("accessToken") || "";
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Check if a product already has an NFC assigned
 */
export const checkExistingNfc = async (
  productId: string
): Promise<ExistingNfcCheck> => {
  const authToken = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/nfc/${productId}/nfc-status`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to check existing NFC");
  }

  return await response.json();
};

/**
 * Check if a reference code is valid
 */
export const checkRefCode = async (
  refCode: string
): Promise<ApiResponse<NfcLink>> => {
  const authToken = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/nfc/check-ref-code/${refCode}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to check reference code");
  }

  return await response.json();
};

/**
 * Link an NFC card to a product
 */
export const linkNfc = async (
  refCode: string,
  productId: string
): Promise<ApiResponse> => {
  const authToken = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/nfc/${refCode}/link/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to link NFC");
  }

  return await response.json();
};

// Export types for use in components
export type { NfcLink, ExistingNfcCheck, ApiResponse };
