// hooks/use-authentication-data.ts
import { useState, useEffect } from "react";
import { WatchAuthentication } from "@/types/watch-authentication";

interface UseAuthenticationDataReturn {
  authentications: WatchAuthentication[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  updateAuthentication: (
    id: string,
    data: Partial<WatchAuthentication>
  ) => Promise<WatchAuthentication>;
  createAuthentication: (
    data: Partial<WatchAuthentication>
  ) => Promise<WatchAuthentication>;
  deleteAuthentication: (id: string) => Promise<void>;
  getAuthenticationById: (id: string) => WatchAuthentication | undefined;
  refreshData: () => Promise<void>;
}

export const useAuthenticationData = (): UseAuthenticationDataReturn => {
  const [authentications, setAuthentications] = useState<WatchAuthentication[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapApiDataToWatchAuthentication = (
    apiData: any
  ): WatchAuthentication => ({
    // Basic fields
    id: apiData.id,
    name: apiData.name,
    user_information: apiData.user_information || apiData.id,
    brand: apiData.brand,
    model: apiData.model,
    serial_number: apiData.serial_number,
    authenticity_verdict: apiData.authenticity_verdict,
    estimated_production_year: apiData.estimated_production_year,
    final_summary: apiData.final_summary,
    date_of_sale: apiData.date_of_sale,
    created_at: apiData.created_at,
    updated_at: apiData.updated_at,

    // Status-related fields
    status: apiData.status || "pending",
    document_sent_at: apiData.document_sent_at,
    resend_count: apiData.resend_count || 0,
    last_resent_at: apiData.last_resent_at,
    void_reason: apiData.void_reason,
    voided_at: apiData.voided_at,
    voided_by: apiData.voided_by,

    // Map nested objects using your existing structure
    provenance_documentation_audit:
      apiData.provenance_documentation_audit || apiData.documents,
    serial_and_model_number_cross_reference:
      apiData.serial_and_model_number_cross_reference || apiData.serial_info,
    case_bezel_and_crystal_analysis:
      apiData.case_bezel_and_crystal_analysis || apiData.case_analysis,
    dial_hands_and_date_scrutiny:
      apiData.dial_hands_and_date_scrutiny || apiData.dial_analysis,
    bracelet_strap_and_clasp_inspection:
      apiData.bracelet_strap_and_clasp_inspection || apiData.bracelet_analysis,
    movement_examination:
      apiData.movement_examination || apiData.movement_analysis,
    performance_and_function_test:
      apiData.performance_and_function_test || apiData.performance_test,
    final_condition_and_grading:
      apiData.final_condition_and_grading || apiData.final_summary,
  });

  const getAuthToken = (): string => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Access token not found in localStorage");
    }
    return token;
  };

  const updateLocalStorage = (newAuthentications: WatchAuthentication[]) => {
    localStorage.setItem("authentications", JSON.stringify(newAuthentications));
  };

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }

      const json = await response.json();
      const authenticatedWatches = json.data;

      console.log("Authentication data received:", authenticatedWatches);

      const mapped: WatchAuthentication[] = authenticatedWatches.map(
        mapApiDataToWatchAuthentication
      );

      setAuthentications(mapped);
      updateLocalStorage(mapped);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Fetch error:", e);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAuthentication = async (
    id: string,
    data: Partial<WatchAuthentication>
  ): Promise<WatchAuthentication> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      // Prepare the payload for API
      const payload = {
        // Basic information
        brand: data.brand,
        model: data.model,
        serial_number: data.serial_number,
        authenticity_verdict: data.authenticity_verdict,
        estimated_production_year: data.estimated_production_year,
        final_summary: data.final_summary,

        // Nested data structures
        provenance_documentation_audit: data.provenance_documentation_audit,
        serial_and_model_number_cross_reference:
          data.serial_and_model_number_cross_reference,
        case_bezel_and_crystal_analysis: data.case_bezel_and_crystal_analysis,
        dial_hands_and_date_scrutiny: data.dial_hands_and_date_scrutiny,
        bracelet_strap_and_clasp_inspection:
          data.bracelet_strap_and_clasp_inspection,
        movement_examination: data.movement_examination,
        performance_and_function_test: data.performance_and_function_test,
        final_condition_and_grading: data.final_condition_and_grading,

        // Status fields if provided
        status: data.status,
        void_reason: data.void_reason,
      };

      // Remove undefined values
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== undefined)
      );

      console.log("Updating authentication with payload:", cleanPayload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth-products/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update authentication: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      const updatedAuth = mapApiDataToWatchAuthentication(
        result.data || result
      );

      console.log("Update response:", updatedAuth);

      // Update the local state
      setAuthentications((prev) => {
        const updated = prev.map((auth) =>
          auth.id === id ? updatedAuth : auth
        );
        updateLocalStorage(updated);
        return updated;
      });

      return updatedAuth;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to update authentication";
      console.error("Update error:", e);
      setError(errorMessage);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const createAuthentication = async (
    data: Partial<WatchAuthentication>
  ): Promise<WatchAuthentication> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      // Prepare the payload for API
      const payload = {
        // Basic information
        brand: data.brand,
        model: data.model,
        serial_number: data.serial_number,
        authenticity_verdict: data.authenticity_verdict,
        estimated_production_year: data.estimated_production_year,
        final_summary: data.final_summary,

        // Nested data structures
        provenance_documentation_audit: data.provenance_documentation_audit,
        serial_and_model_number_cross_reference:
          data.serial_and_model_number_cross_reference,
        case_bezel_and_crystal_analysis: data.case_bezel_and_crystal_analysis,
        dial_hands_and_date_scrutiny: data.dial_hands_and_date_scrutiny,
        bracelet_strap_and_clasp_inspection:
          data.bracelet_strap_and_clasp_inspection,
        movement_examination: data.movement_examination,
        performance_and_function_test: data.performance_and_function_test,
        final_condition_and_grading: data.final_condition_and_grading,

        // Set default status for new authentications
        status: data.status || "pending",
      };

      // Remove undefined values
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== undefined)
      );

      console.log("Creating authentication with payload:", cleanPayload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth-products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to create authentication: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      const newAuth = mapApiDataToWatchAuthentication(result.data || result);

      console.log("Create response:", newAuth);

      // Update the local state
      setAuthentications((prev) => {
        const updated = [...prev, newAuth];
        updateLocalStorage(updated);
        return updated;
      });

      return newAuth;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to create authentication";
      console.error("Create error:", e);
      setError(errorMessage);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAuthentication = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth-products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to delete authentication: ${response.status} ${response.statusText}`
        );
      }

      // Update the local state
      setAuthentications((prev) => {
        const updated = prev.filter((auth) => auth.id !== id);
        updateLocalStorage(updated);
        return updated;
      });

      console.log(`Authentication ${id} deleted successfully`);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to delete authentication";
      console.error("Delete error:", e);
      setError(errorMessage);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthenticationById = (
    id: string
  ): WatchAuthentication | undefined => {
    return authentications.find((auth) => auth.id === id);
  };

  const refreshData = async (): Promise<void> => {
    await fetchData();
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem("authentications");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setAuthentications(parsed);
      } catch (e) {
        console.error("Failed to parse stored authentication data:", e);
        localStorage.removeItem("authentications");
      }
    }
  }, []);

  return {
    authentications,
    isLoading,
    error,
    fetchData,
    updateAuthentication,
    createAuthentication,
    deleteAuthentication,
    getAuthenticationById,
    refreshData,
  };
};
