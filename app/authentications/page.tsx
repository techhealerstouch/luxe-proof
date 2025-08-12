"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type {
  ColumnDef,
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

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Eye, Pencil, Trash, Plus } from "lucide-react";
import { useUserDetails, useProvenanceAudit } from "@/hooks/useDetails";

import type { WatchAuthentication } from "@/components/watch-data";

// --- Debounce helper ---
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// --- Columns factory ---
const getColumns = (
  detailsMap: Record<string, any>,
  loadingMap: Record<string, boolean>,
  handleView: (id: string) => void,
  handleEdit: (id: string) => void,
  fetchData: () => void
): ColumnDef<WatchAuthentication>[] => [
  {
    accessorKey: "user_information",
    header: "User Information",
    cell: ({ row }) => {
      const item = row.original as any;
      return <div>{item.user_information}</div>;
    },
  },

  {
    accessorKey: "provenance_documentation_audit",
    header: "Provenance & Documentation Audit",
    cell: ({ row }) => {
      const item = row.original as any;

      const provenance = item.provenance_documentation_audit;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm space-y-2">
            <div>
              <strong>Authorized Dealer:</strong>{" "}
              {provenance.is_authorized_dealer ? "Yes" : "No"}
            </div>
            <div>
              <strong>Warranty Card:</strong>{" "}
              {provenance.warranty_card_path ?? "N/A"}
            </div>
            <div>
              <strong>Purchase Receipts:</strong>{" "}
              {provenance.purchase_receipt_path ?? "N/A"}
            </div>
            <div>
              <strong>Service Records:</strong>{" "}
              {provenance.service_records_path ?? "N/A"}
            </div>
            <div>
              <strong>Warranty Card Notes:</strong>
              <br />
              {provenance.warranty_card_notes || "N/A"}
            </div>
            <div>
              <strong>Service History Notes:</strong>
              <br />
              {provenance.service_history_notes || "N/A"}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },

  {
    accessorKey: "serial_and_model_number_cross_reference",
    header: "Serial & Model Number Cross-Reference",
    cell: ({ row }) => {
      const item = row.original as any;
      const serial = item.serial_and_model_number_cross_reference;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm space-y-2">
            <div>
              <strong>Engraving Quality:</strong>{" "}
              {serial.engraving_quality || "N/A"}
            </div>
            <div>
              <strong>Matches Documents:</strong>{" "}
              {serial.matches_documents ? "Yes" : "No"}
            </div>
            <div>
              <strong>Model Number:</strong> {serial.model_number || "N/A"}
            </div>
            <div>
              <strong>Notes:</strong>
              <br />
              {serial.notes || "N/A"}
            </div>
            <div>
              <strong>Serial Found Location:</strong>{" "}
              {serial.serial_found_location || "N/A"}
            </div>
            <div>
              <strong>Serial Number:</strong> {serial.serial_number || "N/A"}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },

  {
    accessorKey: "case_bezel_and_crystal_analysis",
    header: "Case, Bezel, and Crystal Analysis",
    cell: ({ row }) => {
      const item = row.original as any;
      const case_bezel_and_crystal = item.case_bezel_and_crystal_analysis;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 text-sm space-y-2">
            <div>
              <strong>Bezel Action:</strong>{" "}
              {case_bezel_and_crystal.bezel_action || "N/A"}
            </div>
            <div>
              <strong>Case Material Verified:</strong>{" "}
              {case_bezel_and_crystal.case_material_verified ? "Yes" : "No"}
            </div>
            <div>
              <strong>Case Weight Feel:</strong>{" "}
              {case_bezel_and_crystal.case_weight_feel || "N/A"}
            </div>
            <div>
              <strong>Crown Logo Sharpness:</strong>{" "}
              {case_bezel_and_crystal.crown_logo_sharpness || "N/A"}
            </div>
            <div>
              <strong>Crystal Type:</strong>{" "}
              {case_bezel_and_crystal.crystal_type || "N/A"}
            </div>
            <div>
              <strong>Finishing Transitions:</strong>{" "}
              {case_bezel_and_crystal.finishing_transitions || "N/A"}
            </div>
            <div>
              <strong>Laser Etched Crown:</strong>{" "}
              {case_bezel_and_crystal.laser_etched_crown ? "Yes" : "No"}
            </div>
            <div>
              <strong>Notes:</strong>
              <br />
              {case_bezel_and_crystal.notes || "N/A"}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },

  {
    accessorKey: "dial_hands_and_date_scrutiny",
    header: "Dial, Hands, and Date Scrutiny",
    cell: ({ row }) => {
      const item = row.original as any;
      const dial_hands_and_date = item.dial_hands_and_date_scrutiny;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 text-sm space-y-2">
            <div>
              <strong>Dial Text Quality:</strong>{" "}
              {dial_hands_and_date.dial_text_quality || "N/A"}
            </div>
            <div>
              <strong>Case Material Verified:</strong>{" "}
              {dial_hands_and_date.case_material_verified ? "Yes" : "No"}
            </div>
            <div>
              <strong>Case Weight Feel:</strong>{" "}
              {dial_hands_and_date.case_weight_feel || "N/A"}
            </div>
            <div>
              <strong>Crown Logo Sharpness:</strong>{" "}
              {dial_hands_and_date.crown_logo_sharpness || "N/A"}
            </div>
            <div>
              <strong>Crystal Type:</strong>{" "}
              {dial_hands_and_date.crystal_type || "N/A"}
            </div>
            <div>
              <strong>Finishing Transitions:</strong>{" "}
              {dial_hands_and_date.finishing_transitions || "N/A"}
            </div>
            <div>
              <strong>Laser Etched Crown:</strong>{" "}
              {dial_hands_and_date.laser_etched_crown ? "Yes" : "No"}
            </div>
            <div>
              <strong>Notes:</strong>
              <br />
              {dial_hands_and_date.notes || "N/A"}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },

  {
    accessorKey: "bracelet_strap_and_clasp_inspection",
    header: "Bracelet/Strap and Clasp Inspection",
    cell: ({ row }) => {
      const item = row.original as any;
      const bracelet_analysis = item.bracelet_strap_and_clasp_inspection;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 text-sm space-y-2">
            <div>
              <strong>Bracelet Link Type:</strong>{" "}
              {bracelet_analysis.bracelet_link_type || "N/A"}
            </div>
            <div>
              <strong>Clasp Action:</strong>{" "}
              {bracelet_analysis.clasp_action || "N/A"}
            </div>
            <div>
              <strong>Clasp Engravings:</strong>{" "}
              {bracelet_analysis.clasp_engravings || "N/A"}
            </div>
            <div>
              <strong>Connection Type:</strong>{" "}
              {bracelet_analysis.connection_type || "N/A"}
            </div>
            <div>
              <strong>Micro Adjustment Functioning:</strong>{" "}
              {bracelet_analysis.micro_adjustment_functioning ? "Yes" : "No"}
            </div>
            <div>
              <strong>Notes:</strong>
              <br />
              {bracelet_analysis.notes || "N/A"}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "movement_examination",
    header: "Movement Examination",
    cell: ({ row }) => {
      const item = row.original as any;
      const movement_analysis = item.movement_examination;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 text-sm space-y-2">
            <div>
              <strong>Movement Caliber:</strong>{" "}
              {movement_analysis.movement_caliber || "N/A"}
            </div>
            <div>
              <strong>Movement Engraving Quality:</strong>{" "}
              {movement_analysis.movement_engraving_quality || "N/A"}
            </div>
            <div>
              <strong>Has Blue Parachrom Hairspring:</strong>{" "}
              {movement_analysis.has_blue_parachrom_hairspring ? "Yes" : "No"}
            </div>
            <div>
              <strong>Has Côtes de Genève:</strong>{" "}
              {movement_analysis.has_cotes_de_geneve ? "Yes" : "No"}
            </div>
            <div>
              <strong>Has Perlage:</strong>{" "}
              {movement_analysis.has_perlage ? "Yes" : "No"}
            </div>
            <div>
              <strong>Has Purple Reversing Wheels:</strong>{" "}
              {movement_analysis.has_purple_reversing_wheels ? "Yes" : "No"}
            </div>
            <div>
              <strong>Movement Other:</strong>{" "}
              {movement_analysis.movement_other || "N/A"}
            </div>
            <div>
              <strong>Movement Notes:</strong>
              <br />
              {movement_analysis.movement_notes || "N/A"}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "performance_and_function_test",
    header: "Performance & Function Test",
    cell: ({ row }) => {
      const item = row.original as any;
      const performance_analysis = item.performance_and_function_test;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 text-sm space-y-2">
            <div>
              <strong>Amplitude (°):</strong>{" "}
              {performance_analysis.amplitude_degrees || "N/A"}
            </div>
            <div>
              <strong>Beat Error (ms):</strong>{" "}
              {performance_analysis.beat_error_ms || "N/A"}
            </div>
            <div>
              <strong>Chronograph Works:</strong>{" "}
              {performance_analysis.chronograph_works ? "Yes" : "No"}
            </div>
            <div>
              <strong>Date Change Works:</strong>{" "}
              {performance_analysis.date_change_works ? "Yes" : "No"}
            </div>
            <div>
              <strong>Power Reserve Test Result:</strong>{" "}
              {performance_analysis.power_reserve_test_result || "N/A"}
            </div>
            <div>
              <strong>Rate (s/day):</strong>{" "}
              {performance_analysis.rate_seconds_per_day || "N/A"}
            </div>
            <div>
              <strong>Time Setting Works:</strong>{" "}
              {performance_analysis.time_setting_works ? "Yes" : "No"}
            </div>
            <div>
              <strong>Notes:</strong>
              <br />
              {performance_analysis.notes || "N/A"}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "final_condition_and_grading",
    header: "Final Condition & Grading",
    cell: ({ row }) => {
      const id = String((row.original as any).id);
      const details = detailsMap[id];
      const isLoading = loadingMap[id];
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = String((row.original as any).id);
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(id)}
            aria-label="View"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(id)}
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <DeleteConfirmationDialog
            id={id}
            fetchData={fetchData}
            label={<Trash className="w-4 h-4" />}
            confirmTitle="Delete this Watch Authentication"
            confirmDescription="This Watch Authentication will be permanently removed from your database."
          />
        </div>
      );
    },
  },
];

export default function AuthenticationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [authentications, setAuthentications] = useState<WatchAuthentication[]>(
    []
  );

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  const { detailsMap, loadingMap, fetchUserDetails } = useUserDetails();
  const { fetchProvenanceDocumentationAudit } = useProvenanceAudit();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) throw new Error("Access token not found in session storage");

      const res = await fetch("http://localhost:8000/api/auth-products", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();
      const authenticatedWatches = json.data;

      const mapped: WatchAuthentication[] = authenticatedWatches.map(
        (u: any) => {
          return {
            id: u.id,
            user_information: u.id,
            provenance_documentation_audit: u.documents,
            serial_and_model_number_cross_reference: u.serial_info,
            case_bezel_and_crystal_analysis: u.case_analysis,
            dial_hands_and_date_scrutiny: u.dial_analysis,
            bracelet_strap_and_clasp_inspection: u.bracelet_analysis,
            movement_examination: u.movement_analysis,
            performance_and_function_test: u.performance_test,
            final_condition_and_grading: u.final_summary,
          };
        }
      );

      setAuthentications(mapped);
      localStorage.setItem("authentications", JSON.stringify(mapped));
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchData();
  }, [user, router]);
  if (!user) return null;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>("");

  useEffect(() => {
    setGlobalFilter(debouncedSearch);
  }, [debouncedSearch]);

  const handleView = (id: string) => {
    // placeholder: open detail modal or navigate
    console.log("View", id);
  };
  const handleEdit = (id: string) => {
    router.push(`/authentications/edit/${id}`);
  };

  const columnsDef = useMemo(
    () =>
      getColumns(
        detailsMap,
        loadingMap,
        handleView,
        handleEdit,
        fetchData // ← add this
      ),
    [
      fetchUserDetails,
      fetchProvenanceDocumentationAudit,
      detailsMap,
      loadingMap,
      authentications,
    ]
  );

  const table = useReactTable({
    data: authentications,
    columns: columnsDef,

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
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Authentication List
          </h2>
          <p className="text-muted-foreground">
            Manage your watch authentication records
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <div>
            <Input
              placeholder="Search authentications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search"
            />
          </div>
          <Button asChild>
            <Link href="/authentications/intro" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Authentication
            </Link>
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full mt-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
                    colSpan={columnsDef.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Default data table
        </p>
      </div>

      {authentications.length === 0 && (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                No authentications found
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first watch authentication.
              </p>
              <Button asChild>
                <Link
                  href="/authentications/intro"
                  className="flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Authentication
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
