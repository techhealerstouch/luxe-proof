"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { FileDown } from "lucide-react";

import type {
  BillingData,
  PaginationState,
  DateFilter,
} from "@/types/billing/billing";

import { exportPaymentsAsCSV } from "@/utils/generate-csv";
import {
  fetchCreditsInvoices,
  fetchSubscriptions,
} from "@/lib/billing-service";
import { CurrentPlanSection } from "./page";
import { CreditsHistorySection } from "./page";
export { BillingPageHeader } from "./components/billing-page-header";
export { CurrentPlanSection } from "./components/current-plan-section";
export { FilterSection } from "./components/filter-section";
export { InvoiceList } from "./components/invoice-list-section";
export { PaginationControls } from "./components/pagination-controls";
export { CreditsHistorySection } from "./components/credits-history";
interface BillingPageHeaderProps {
  isDownloading: boolean;
  onDownloadXML: () => void;
  hasData: boolean;
}
const mockBillingData: BillingData = {
  currentPlan: {
    name: "Free Plan",
    type: "free",
    price: 0,
    billingCycle: "monthly",
    features: ["Basic features", "Limited usage", "Community support"],
  },
  billingHistory: [],
  creditsInvoices: [],
  subscriptions: [],
};
// Utility Functions
const filterInvoices = (invoices: any[], filters: DateFilter) => {
  return invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.created_at);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    if (startDate && invoiceDate < startDate) return false;
    if (endDate && invoiceDate > endDate) return false;

    if (
      filters.status &&
      filters.status !== "all" &&
      invoice.status.toLowerCase() !== filters.status.toLowerCase()
    ) {
      return false;
    }

    return true;
  });
};

const paginateArray = (array: any[], page: number, itemsPerPage: number) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex);
};

// Component: Page Header
const BillingPageHeader: React.FC<BillingPageHeaderProps> = ({
  isDownloading,
  onDownloadXML,
  hasData,
}) => (
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
      <p className="text-muted-foreground">
        Manage your subscription and billing information
      </p>
    </div>

    <Button
      onClick={onDownloadXML}
      disabled={isDownloading || !hasData}
      className="rounded-xl"
    >
      {isDownloading ? (
        <>
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4 mr-2" />
          Export Filtered Payments (CSV)
        </>
      )}
    </Button>
  </div>
);

// Main Component
export default function BillingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<DateFilter>({
    startDate: "",
    endDate: "",
    status: "all",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Memoized filtered and paginated data
  const { filteredInvoices, paginatedInvoices } = useMemo(() => {
    if (!billingData?.creditsInvoices) {
      return { filteredInvoices: [], paginatedInvoices: [] };
    }

    const filtered = filterInvoices(billingData.creditsInvoices, filters);
    const totalPages = Math.ceil(filtered.length / pagination.itemsPerPage);

    setPagination((prev) => ({
      ...prev,
      totalItems: filtered.length,
      totalPages: totalPages,
      currentPage: prev.currentPage > totalPages ? 1 : prev.currentPage,
    }));

    const paginated = paginateArray(
      filtered,
      pagination.currentPage,
      pagination.itemsPerPage
    );

    return { filteredInvoices: filtered, paginatedInvoices: paginated };
  }, [
    billingData?.creditsInvoices,
    filters,
    pagination.currentPage,
    pagination.itemsPerPage,
  ]);

  const handleDownloadInvoice = (invoiceUrl: string) => {
    console.log("Download invoice:", invoiceUrl);
  };

  const handleDownloadAllPaymentsCSV = async () => {
    if (!billingData) return;

    setIsDownloading(true);
    try {
      await exportPaymentsAsCSV(billingData, filteredInvoices, "combined");
    } catch (error) {
      console.error("Failed to download CSV:", error);
      // You could add a toast notification here
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    setPagination((prev) => ({
      ...prev,
      itemsPerPage: parseInt(newItemsPerPage),
      currentPage: 1,
    }));
  };

  const handleFilterChange = (field: keyof DateFilter, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const resetFilters = () => {
    setFilters({ startDate: "", endDate: "", status: "all" });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const getStatusOptions = () => {
    if (!billingData?.creditsInvoices) return [];
    const statuses = [
      ...new Set(billingData.creditsInvoices.map((invoice) => invoice.status)),
    ];
    return statuses.map((status) => ({
      value: status.toLowerCase(),
      label: status,
    }));
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchBillingData = async () => {
      setIsLoading(true);
      try {
        const [creditsInvoices, subscriptions] = await Promise.all([
          fetchCreditsInvoices(),
          fetchSubscriptions(),
        ]);
        setBillingData({
          ...mockBillingData,
          creditsInvoices,
          subscriptions,
        });
      } catch (error) {
        console.error("Failed to fetch billing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingData();
  }, [user, router]);

  if (!user) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
            <p className="text-muted-foreground">
              Loading billing information...
            </p>
          </div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <BillingPageHeader
          isDownloading={isDownloading}
          onDownloadXML={handleDownloadAllPaymentsCSV}
          hasData={!!billingData}
        />

        <div className="grid gap-6">
          {/* <CurrentPlanSection billingData={billingData} /> */}

          <CreditsHistorySection
            billingData={billingData}
            filteredInvoices={filteredInvoices}
            paginatedInvoices={paginatedInvoices}
            pagination={pagination}
            filters={filters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onDownloadInvoice={handleDownloadInvoice}
            statusOptions={getStatusOptions()}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
