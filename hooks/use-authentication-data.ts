// hooks/use-authentication-data.ts
import { useState, useEffect } from "react";
import { WatchAuthentication } from "@/types/watch-authentication";

interface UseAuthenticationDataReturn {
  authentications: WatchAuthentication[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
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
    id: apiData.id,
    name: apiData.name,
    user_information: apiData.id,
    brand: apiData.brand,
    authenticity_verdict: apiData.authenticity_verdict,
    estimated_production_year: apiData.estimated_production_year,
    final_summary: apiData.final_summary,
    date_of_sale: apiData.date_of_sale,
    created_at: apiData.created_at,
    updated_at: apiData.updated_at,

    // Map nested objects properly
    provenance_documentation_audit: apiData.documents,
    serial_and_model_number_cross_reference: apiData.serial_info,
    case_bezel_and_crystal_analysis: apiData.case_analysis,
    dial_hands_and_date_scrutiny: apiData.dial_analysis,
    bracelet_strap_and_clasp_inspection: apiData.bracelet_analysis,
    movement_examination: apiData.movement_analysis,
    performance_and_function_test: apiData.performance_test,
    final_condition_and_grading: apiData.final_summary,
  });

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Access token not found in session storage");
      }

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
      localStorage.setItem("authentications", JSON.stringify(mapped));
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Fetch error:", e);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    authentications,
    isLoading,
    error,
    fetchData,
  };
};
