// components/billing/CreditsHistorySection.tsx

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Filter, RotateCcw } from "lucide-react";

import type {
  BillingData,
  PaginationState,
  DateFilter,
} from "@/types/billing/billing";
import { FilterSection } from "./filter-section";
import { InvoiceList } from "./invoice-list-section";
import { PaginationControls } from "./pagination-controls";

interface CreditsHistorySectionProps {
  billingData: BillingData | null;
  filteredInvoices: any[];
  paginatedInvoices: any[];
  pagination: PaginationState;
  filters: DateFilter;
  showFilters: boolean;
  onToggleFilters: () => void;
  onFilterChange: (field: keyof DateFilter, value: string) => void;
  onResetFilters: () => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: string) => void;
  onDownloadInvoice: (url: string) => void;
  statusOptions: Array<{ value: string; label: string }>;
}

export const CreditsHistorySection: React.FC<CreditsHistorySectionProps> = ({
  billingData,
  filteredInvoices,
  paginatedInvoices,
  pagination,
  filters,
  showFilters,
  onToggleFilters,
  onFilterChange,
  onResetFilters,
  onPageChange,
  onItemsPerPageChange,
  onDownloadInvoice,
  statusOptions,
}) => {
  const renderEmptyState = () => (
    <div className="text-center py-6">
      <p className="text-muted-foreground mb-4">
        {billingData?.creditsInvoices.length
          ? "No invoices match your current filters"
          : "No credits invoices available"}
      </p>
      {billingData?.creditsInvoices.length && (
        <Button
          variant="outline"
          onClick={onResetFilters}
          className="rounded-xl"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Credits Invoice History
            </CardTitle>
            <CardDescription>
              View your credits invoices ({filteredInvoices.length} of{" "}
              {billingData?.creditsInvoices.length || 0} total)
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            className="rounded-xl"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
        </div>

        <FilterSection
          showFilters={showFilters}
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          statusOptions={statusOptions}
        />
      </CardHeader>

      <CardContent>
        {paginatedInvoices.length ? (
          <>
            <InvoiceList
              invoices={paginatedInvoices}
              onDownloadInvoice={onDownloadInvoice}
            />
            <PaginationControls
              pagination={pagination}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          </>
        ) : (
          renderEmptyState()
        )}
      </CardContent>
    </Card>
  );
};
