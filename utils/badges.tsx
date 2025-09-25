import type React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import type { PlanType } from "@/types/billing/billing";

export const getStatusBadge = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "paid":
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          {status === "active" ? "Active" : "Paid"}
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "failed":
    case "cancelled":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {status === "cancelled" ? "Cancelled" : "Failed"}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getPlanBadge = (planType: PlanType) => {
  switch (planType) {
    case "free":
      return <Badge variant="secondary">Free</Badge>;
    case "pro":
      return <Badge variant="default">Pro</Badge>;
    case "enterprise":
      return <Badge variant="outline">Enterprise</Badge>;
    default:
      return <Badge variant="outline">{planType}</Badge>;
  }
};
