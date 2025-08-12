import { useCallback, useState } from "react";

type UserDetails = {
  watchbrand: string;
  usertype: string;
  full_name: string;
  email_address: string;
  phone_number?: string;
  preferred_contact_method: string;
};

type ProvenanceDetails = {
  authorized_dealer: boolean;
  warranty_card: File[];
  purchase_receipts: File[];
  service_records?: File[];
  warranty_card_notes: string;
  service_history_notes?: string;
};

export const useUserDetails = () => {
  const [detailsMap, setDetailsMap] = useState<Record<string, UserDetails>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const fetchUserDetails = useCallback(
    async (id: string) => {
      if (detailsMap[id] || loadingMap[id]) return;

      setLoadingMap((m) => ({ ...m, [id]: true }));
      try {
        const res = await fetch(
          `hhttp://localhost:8000/api/auth-products/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch user details");
        const user = await res.json();

        // Replace this mapping with real API fields when available
        setDetailsMap((m) => ({
          ...m,
          [id]: {
            watchbrand: "Rolex",
            usertype: "Admin",
            full_name: "Alice Johnson",
            email_address: "alice.johnson@example.com",
            phone_number: "+1 (555) 987-6543",
            preferred_contact_method: "Phone",
          },
        }));
      } catch (e) {
        console.warn("Failed to fetch user details", e);
      } finally {
        setLoadingMap((m) => ({ ...m, [id]: false }));
      }
    },
    [detailsMap, loadingMap]
  );

  return { detailsMap, loadingMap, fetchUserDetails };
};

export const useProvenanceAudit = () => {
  const [detailsMap, setDetailsMap] = useState<
    Record<string, ProvenanceDetails>
  >({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const fetchProvenanceDocumentationAudit = useCallback(
    async (id: string) => {
      if (detailsMap[id] || loadingMap[id]) return;

      setLoadingMap((prev) => ({ ...prev, [id]: true }));

      try {
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Hardcoded fake data (replace this with real fetch)
        setDetailsMap((prev) => ({
          ...prev,
          [id]: {
            authorized_dealer: true,
            warranty_card: [new File(["warranty"], "warranty.pdf")],
            purchase_receipts: [new File(["receipt"], "receipt.pdf")],
            service_records: [new File(["record"], "record.pdf")],
            warranty_card_notes:
              "This is a valid warranty card issued at the time of purchase.",
            service_history_notes: "Serviced once in 2022.",
          },
        }));
      } catch (e) {
        console.warn("Failed to fetch provenance audit", e);
      } finally {
        setLoadingMap((prev) => ({ ...prev, [id]: false }));
      }
    },
    [detailsMap, loadingMap]
  );

  return { detailsMap, loadingMap, fetchProvenanceDocumentationAudit };
};
