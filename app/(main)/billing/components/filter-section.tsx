// components/billing/FilterSection.tsx

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

import type { DateFilter } from "@/types/billing/billing";

interface FilterSectionProps {
  showFilters: boolean;
  filters: DateFilter;
  onFilterChange: (field: keyof DateFilter, value: string) => void;
  onResetFilters: () => void;
  statusOptions: Array<{ value: string; label: string }>;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  showFilters,
  filters,
  onFilterChange,
  onResetFilters,
  statusOptions,
}) => {
  if (!showFilters) return null;

  return (
    <div className="mt-4 p-4 border rounded-xl bg-muted/20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange("startDate", e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange("endDate", e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>&nbsp;</Label>
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="w-full rounded-xl"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
