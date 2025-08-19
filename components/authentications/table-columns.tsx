// components/authentications/table-columns.tsx
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, ScanQrCode, Download } from "lucide-react";
import { WatchAuthentication } from "@/types/watch-authentication";

interface TableActionsProps {
  id: string;
  watchData: WatchAuthentication;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDownloadPDF: (data: WatchAuthentication) => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  id,
  watchData,
  onView,
  onEdit,
  onDownloadPDF,
}) => {
  const handleQRCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView(id);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView(id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownloadPDF(watchData);
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleQRCode}
        aria-label="QR Code"
        className="h-8 w-8 p-0"
      >
        <ScanQrCode className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleView}
        aria-label="View Details"
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        aria-label="Edit"
        className="h-8 w-8 p-0"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        aria-label="Download Certificate"
        className="h-8 w-8 p-0"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface AuthenticityBadgeProps {
  verdict?: string;
}

const AuthenticityBadge: React.FC<AuthenticityBadgeProps> = ({ verdict }) => {
  const isAuthentic =
    verdict?.toLowerCase() === "authentic" ||
    verdict?.toLowerCase() === "genuine";

  return (
    <Badge
      className={
        isAuthentic
          ? "bg-green-500 hover:bg-green-600 text-white"
          : verdict
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-gray-500 hover:bg-gray-600 text-white"
      }
    >
      {verdict || "Pending"}
    </Badge>
  );
};

interface ColumnHandlers {
  handleView: (id: string) => void;
  handleEdit: (id: string) => void;
  handleDownloadPDF: (data: WatchAuthentication) => void;
}

export const createTableColumns = ({
  handleView,
  handleEdit,
  handleDownloadPDF,
}: ColumnHandlers): ColumnDef<WatchAuthentication>[] => [
  {
    accessorKey: "serial_and_model_number_cross_reference.serial_number",
    header: "Serial Number",
    cell: ({ row }) => {
      const serialNumber =
        row.original.serial_and_model_number_cross_reference?.serial_number;
      return <div className="font-mono text-sm">{serialNumber || "N/A"}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => <div className="text-sm">{row.original.brand}</div>,
  },
  {
    accessorKey: "estimated_production_year",
    header: "Production Year",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.estimated_production_year || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "date_of_sale",
    header: "Date of Sale",
    cell: ({ row }) => {
      // You can replace this with actual date_of_sale from your data
      const saleDate = row.original.date_of_sale || "09-10-2025";
      return <div className="text-sm">{saleDate}</div>;
    },
  },
  {
    accessorKey: "final_summary",
    header: "Final Summary",
    cell: ({ row }) => (
      <div
        className="max-w-xs truncate text-sm"
        title={row.original.final_summary}
      >
        {row.original.final_summary || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "authenticity_verdict",
    header: "Authenticity",
    cell: ({ row }) => (
      <AuthenticityBadge verdict={row.original.authenticity_verdict} />
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: () => (
      <Badge className="bg-green-500 hover:bg-green-600 text-white">Done</Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = String(row.original.id);
      return (
        <TableActions
          id={id}
          watchData={row.original}
          onView={handleView}
          onEdit={handleEdit}
          onDownloadPDF={handleDownloadPDF}
        />
      );
    },
  },
];
