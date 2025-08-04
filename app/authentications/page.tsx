"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react";
import {
  type WatchAuthentication,
  INITIAL_AUTHENTICATIONS,
} from "@/components/watch-data";
import Link from "next/link";
import Image from "next/image";

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

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data: Payment[] = [
  {
    id: "1",
    name: "Shang Chain",
    amount: 699,
    status: "success",
    email: "shang07@yahoo.com",
  },
  {
    id: "2",
    name: "Kevin Lincoln",
    amount: 242,
    status: "success",
    email: "kevinli09@gmail.com",
  },
  {
    id: "3",
    name: "Milton Rose",
    amount: 655,
    status: "processing",
    email: "rose96@gmail.com",
  },
  {
    id: "4",
    name: "Silas Ryan",
    amount: 874,
    status: "success",
    email: "silas22@gmail.com",
  },
  {
    id: "5",
    name: "Ben Tenison",
    amount: 541,
    status: "failed",
    email: "bent@hotmail.com",
  },
];

export type Payment = {
  id: string;
  name: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};
export const columns: ColumnDef<WatchAuthentication>[] = [
  {
    accessorKey: "model_number",
    header: "Model Number",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("model_number")}</div>
    ),
  },
  {
    accessorKey: "authenticity_verdict",
    header: "Verdict",
    cell: ({ row }) => <div>{row.getValue("authenticity_verdict")}</div>,
  },
  {
    accessorKey: "estimated_year_of_production",
    header: "Year",
    cell: ({ row }) => (
      <div>{row.getValue("estimated_year_of_production")}</div>
    ),
  },
  {
    accessorKey: "authorized_dealer",
    header: "Authorized Dealer",
    cell: ({ row }) => (
      <div>{row.getValue("authorized_dealer") ? "Yes" : "No"}</div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => <div>{row.getValue("notes")}</div>,
  },
];

export default function AuthenticationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [authentications, setAuthentications] = useState<WatchAuthentication[]>(
    []
  );

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Load authentications from localStorage or use initial data
    const stored = localStorage.getItem("authentications");
    if (stored) {
      setAuthentications(JSON.parse(stored));
    } else {
      setAuthentications(INITIAL_AUTHENTICATIONS);
      localStorage.setItem(
        "authentications",
        JSON.stringify(INITIAL_AUTHENTICATIONS)
      );
    }
  }, [user, router]);

  if (!user) return null;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: authentications,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Authentication List
          </h2>
          <p className="text-muted-foreground">
            Manage your watch authentication records
          </p>
        </div>
        <Button asChild>
          <Link href="/authentications/intro">
            <Plus className="mr-2 h-4 w-4" />
            Create Authentication
          </Link>
        </Button>
      </div>
      {/* TABLE */}
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
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
                    colSpan={columns.length}
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
      {/* table */}
      {authentications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                No authentications found
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first watch authentication.
              </p>
              <Button asChild>
                <Link href="/authentications/intro">
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
