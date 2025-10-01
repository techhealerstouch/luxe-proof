// components/billing/PaginationControls.tsx

import type React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PaginationState } from "@/types/billing/billing";

interface PaginationControlsProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: string) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
  onItemsPerPageChange,
}) => {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Label htmlFor="items-per-page">Items per page:</Label>
        <Select
          value={pagination.itemsPerPage.toString()}
          onValueChange={onItemsPerPageChange}
        >
          <SelectTrigger className="w-20 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="rounded-xl"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="rounded-xl"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
