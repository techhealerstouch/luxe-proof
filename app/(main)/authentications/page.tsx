"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Settings2,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { fetchCredits } from "@/lib/credit-service"; // Adjust path as needed
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import types and utilities
import { WatchAuthentication } from "@/types/watch-authentication";
import { useAuthenticationData } from "@/hooks/use-authentication-data";
import { createTableColumns } from "@/components/authentications/table-columns";
import { WatchViewModal } from "@/components/watch-details/watch-view-modal";
import { generateAuthenticationPDF } from "@/utils/pdf-generator";
// import { useUserDetails, useProvenanceAudit } from "@/hooks/useDetails";

// Debounce hook
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// Loading skeleton component
function TableSkeleton() {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 9 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 9 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Enhanced loading component
function LoadingState() {
  return (
    <Card className="mt-4 border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg font-medium">Loading Authentications</span>
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          We're fetching your authentication records. This might take a
          moment...
        </p>
        <div className="w-full max-w-xs">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Filter badge component
interface FilterBadgeProps {
  label: string;
  value: string;
  onRemove: () => void;
}

function FilterBadge({ label, value, onRemove }: FilterBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 ml-1 hover:bg-muted-foreground/20 rounded-full"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Remove {label} filter</span>
      </Button>
    </Badge>
  );
}

export default function AuthenticationsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // State management
  const [search, setSearch] = useState("");
  const [selectedWatch, setSelectedWatch] =
    useState<WatchAuthentication | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Filter states
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [verdictFilter, setVerdictFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Added status filter

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [credits, setCredits] = useState<number | null>(null);

  // Custom hooks
  const debouncedSearch = useDebounce(search, 250);
  const { authentications, isLoading, error, fetchData } =
    useAuthenticationData();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, router]);
  useEffect(() => {
    if (user) {
      fetchCredits()
        .then((balance) => setCredits(balance))
        .catch((err) => {
          console.error("Failed to fetch credits:", err);
          setCredits(0); // fallback
        });
    }
  }, [user]);

  if (!user) return null;
  useEffect(() => {
    setGlobalFilter(debouncedSearch);
  }, [debouncedSearch]);

  // Apply filters with improved logic - Updated to include status filter
  useEffect(() => {
    const filters: ColumnFiltersState = [];

    if (brandFilter !== "all") {
      filters.push({ id: "brand", value: brandFilter });
    }

    if (verdictFilter !== "all") {
      filters.push({ id: "authenticity_verdict", value: verdictFilter });
    }

    if (yearFilter !== "all") {
      filters.push({
        id: "estimated_production_year",
        value: parseInt(yearFilter),
      });
    }

    if (statusFilter !== "all") {
      filters.push({ id: "status", value: statusFilter });
    }

    setColumnFilters(filters);
  }, [brandFilter, verdictFilter, yearFilter, statusFilter]);

  // Memoized filter options with better sorting - Updated to include status options
  const filterOptions = useMemo(() => {
    if (!authentications || authentications.length === 0) {
      return { brands: [], verdicts: [], years: [], statuses: [] };
    }

    // Extract brands and filter out null/undefined values
    const brands = Array.from(
      new Set(
        authentications
          .map((auth) => auth.brand)
          .filter(
            (brand): brand is string =>
              typeof brand === "string" && brand.trim().length > 0
          )
      )
    ).sort((a, b) => String(a).localeCompare(String(b)));

    // Extract verdicts and filter out null/undefined values
    const verdicts = Array.from(
      new Set(
        authentications
          .map((auth) => auth.authenticity_verdict)
          .filter(
            (verdict): verdict is string =>
              typeof verdict === "string" && verdict.trim().length > 0
          )
      )
    ).sort((a, b) => String(a).localeCompare(String(b)));

    // Extract years and filter out null/undefined/invalid values
    const years = Array.from(
      new Set(
        authentications
          .map((auth) => auth.estimated_production_year)
          .map((year) => {
            // Convert string to number if needed
            if (typeof year === "string") {
              const parsed = parseInt(year, 10);
              return isNaN(parsed) ? null : parsed;
            }
            return year;
          })
          .filter(
            (year): year is number =>
              year !== null &&
              year !== undefined &&
              typeof year === "number" &&
              !isNaN(year) &&
              year > 0
          )
      )
    ).sort((a, b) => b - a); // Sort years descending (newest first)

    // Extract statuses - Added status filtering
    const statuses = Array.from(
      new Set(
        authentications.map((auth) => {
          // Determine status based on document_sent_at and status field
          if (auth.status === "voided") return "voided";
          if (auth.status === "completed") return "completed";
          if (auth.document_sent_at || auth.status === "sent") return "sent";
          return "pendings";
        })
      )
    ).sort((a, b) => String(a).localeCompare(String(b)));

    return { brands, verdicts, years, statuses };
  }, [authentications]);

  // Event handlers
  const handleView = (id: string) => {
    const watchData = authentications.find(
      (watch) => String(watch.id) === String(id)
    );

    if (watchData) {
      setSelectedWatch(watchData);
      setIsViewModalOpen(true);
    } else {
      console.error("Watch not found with ID:", id);
    }
  };

  const handleEdit = (id: string) => {
    const watchData = authentications.find(
      (watch) => String(watch.id) === String(id)
    );

    if (watchData) {
      const isDocumentSent =
        watchData.status === "sent" || watchData.document_sent_at;
      const isVoided = watchData.status === "voided";

      if (isDocumentSent || isVoided) {
        toast({
          title: "Cannot Edit",
          description: isVoided
            ? "Cannot edit voided authentication records"
            : "Cannot edit authentication after document has been sent",
          variant: "destructive",
        });
        return;
      }
    }

    router.push(`/authentications/edit/${id}`);
  };

  const handleDownloadPDF = async (watchData: WatchAuthentication) => {
    console.log(watchData);
    try {
      await generateAuthenticationPDF(watchData);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedWatch(null);
  };

  const clearFilters = () => {
    setBrandFilter("all");
    setVerdictFilter("all");
    setYearFilter("all");
    setStatusFilter("all"); // Clear status filter
    setSearch("");
  };

  const clearSearch = () => {
    setSearch("");
  };

  // Table configuration - Simplified and using the new table columns
  const tableColumns = useMemo(
    () =>
      createTableColumns({
        handleView,
        handleEdit,
        handleDownloadPDF,
      }),
    [handleView, handleEdit, handleDownloadPDF]
  );

  const table = useReactTable({
    data: authentications,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Updated active filters count to include status filter
  const activeFiltersCount = useMemo(() => {
    return (
      [brandFilter, verdictFilter, yearFilter, statusFilter].filter(
        (f) => f !== "all"
      ).length + (search ? 1 : 0)
    );
  }, [brandFilter, verdictFilter, yearFilter, statusFilter, search]);

  // Early return for unauthenticated users
  if (!user) return null;

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Authentication Records
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your watch authentication records
          </p>
        </div>
        <Button
          size="default"
          className="shrink-0"
          onClick={() => router.push("/authentications/intro")}
          disabled={credits === null || credits <= 0}
        >
          <Plus className="h-4 w-4" />
          New Authentications
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
              <Input
                placeholder="Search by name, brand, serial number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10 border-2 focus:border-primary transition-colors"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {/* Brand Filter */}
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="w-[140px] border-2 focus:border-primary">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {filterOptions.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Verdict Filter */}
              <Select value={verdictFilter} onValueChange={setVerdictFilter}>
                <SelectTrigger className="w-[140px] border-2 focus:border-primary">
                  <SelectValue placeholder="All Verdicts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verdicts</SelectItem>
                  {filterOptions.verdicts.map((verdict) => (
                    <SelectItem key={verdict} value={verdict}>
                      {verdict}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Filter */}
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[120px] border-2 focus:border-primary">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {filterOptions.years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter - Added this filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] border-2 focus:border-primary">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Document Sent</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="voided">Voided</SelectItem>
                </SelectContent>
              </Select>

              {/* Column Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-2">
                    <Settings2 className="mr-2 h-4 w-4" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== "undefined" &&
                        column.getCanHide()
                    )
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id.replace(/_/g, " ")}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-2 border-destructive/20 text-destructive hover:bg-destructive/10"
                >
                  Clear Filters
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {activeFiltersCount}
                  </Badge>
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display - Updated to include status filter */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm font-medium text-muted-foreground">
                Active Filters:
              </span>
              {search && (
                <FilterBadge
                  label="Search"
                  value={`"${search}"`}
                  onRemove={clearSearch}
                />
              )}
              {brandFilter !== "all" && (
                <FilterBadge
                  label="Brand"
                  value={brandFilter}
                  onRemove={() => setBrandFilter("all")}
                />
              )}
              {verdictFilter !== "all" && (
                <FilterBadge
                  label="Verdict"
                  value={verdictFilter}
                  onRemove={() => setVerdictFilter("all")}
                />
              )}
              {yearFilter !== "all" && (
                <FilterBadge
                  label="Year"
                  value={yearFilter}
                  onRemove={() => setYearFilter("all")}
                />
              )}
              {statusFilter !== "all" && (
                <FilterBadge
                  label="Status"
                  value={
                    statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
                  }
                  onRemove={() => setStatusFilter("all")}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-destructive mb-1">
                  Error Loading Data
                </h3>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
              <Button
                variant="outline"
                onClick={fetchData}
                disabled={isLoading}
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  "Try Again"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && <LoadingState />}

      {/* Data Table */}
      {!isLoading && !error && (
        <Card>
          <CardContent className="p-0">
            {authentications.length > 0 ? (
              <>
                <div className="rounded-md border-0 overflow-hidden">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                          key={headerGroup.id}
                          className="border-b bg-muted/50"
                        >
                          {headerGroup.headers.map((header) => (
                            <TableHead
                              key={header.id}
                              className="font-semibold"
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={tableColumns.length}
                            className="h-24 text-center text-muted-foreground"
                          >
                            {activeFiltersCount > 0 ? (
                              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                <div className="rounded-full bg-muted p-3 mb-4">
                                  <Search className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                  No results found
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                  No authentication records match your current
                                  filters. Try adjusting your search criteria or
                                  clearing some filters.
                                </p>
                                <Button
                                  variant="outline"
                                  onClick={clearFilters}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Clear All Filters
                                </Button>
                              </div>
                            ) : (
                              "No results found for your current filters."
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Simple Pagination */}
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                      <>
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">Rows per page</p>
                      <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                          table.setPageSize(Number(value));
                        }}
                      >
                        <SelectTrigger className="h-8 w-[70px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                      Page {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Go to first page</span>
                        <ChevronLeft className="h-4 w-4" />
                        <ChevronLeft className="h-4 w-4 -ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="sr-only">Go to last page</span>
                        <ChevronRight className="h-4 w-4" />
                        <ChevronRight className="h-4 w-4 -ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between text-xs text-muted-foreground p-4 border-t bg-muted/10">
                  <div>
                    Showing {table.getRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} entries
                    {table.getFilteredRowModel().rows.length !==
                      authentications.length &&
                      ` (filtered from ${authentications.length} total)`}
                  </div>
                  {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <div>
                      {table.getFilteredSelectedRowModel().rows.length} of{" "}
                      {table.getFilteredRowModel().rows.length} row(s) selected
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No authentications found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Get started by creating your first watch authentication
                  record. Track and manage all your authentication certificates
                  in one place.
                </p>
                <Button asChild>
                  <Link
                    href="/authentications/intro"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create First Authentication
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* View Modal */}
      {selectedWatch && (
        <WatchViewModal
          isOpen={isViewModalOpen}
          onClose={handleCloseModal}
          watchData={selectedWatch}
        />
      )}
    </DashboardLayout>
  );
}
