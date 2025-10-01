// components/billing/CurrentPlanSection.tsx

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, CheckCircle } from "lucide-react";

import type { BillingData } from "@/types/billing/billing";
import { formatDate, formatCurrency } from "@/utils/formatting";
import { getStatusBadge, getPlanBadge } from "@/utils/badges";
import { getActiveSubscription } from "@/utils/billing";

interface CurrentPlanSectionProps {
  billingData: BillingData | null;
}

export const CurrentPlanSection: React.FC<CurrentPlanSectionProps> = ({
  billingData,
}) => {
  const renderActiveSubscription = () => {
    if (!billingData?.subscriptions || billingData.subscriptions.length === 0) {
      return renderFreePlan();
    }

    const activeSubscription = getActiveSubscription(billingData.subscriptions);

    if (!activeSubscription) {
      return (
        <div className="text-center py-6">
          <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">
            No active subscription found
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold">
              {activeSubscription.plan.name}
            </h3>
            {getStatusBadge(activeSubscription.status)}
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">
              {formatCurrency(activeSubscription.price)}
            </span>
            <span className="text-muted-foreground">/subscription</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Started: {formatDate(activeSubscription.start_date)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Ends: {formatDate(activeSubscription.end_date)}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Service:</span>
              <Badge variant="outline">{activeSubscription.service}</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Plan Features:</h4>
          {activeSubscription.plan.features &&
          activeSubscription.plan.features.length > 0 ? (
            <ul className="space-y-2">
              {activeSubscription.plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {activeSubscription.plan.description ||
                  "No description available"}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFreePlan = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold">
            {billingData?.currentPlan.name || "Free Plan"}
          </h3>
          {getPlanBadge(billingData?.currentPlan.type || "free")}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">
            {formatCurrency(billingData?.currentPlan.price || 0)}
          </span>
          <span className="text-muted-foreground">
            /{billingData?.currentPlan.billingCycle || "month"}
          </span>
        </div>

        {billingData?.currentPlan.nextBillingDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Next billing date:{" "}
            {formatDate(billingData.currentPlan.nextBillingDate)}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Plan Features:</h4>
        <ul className="space-y-2">
          {(billingData?.currentPlan.features || []).map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Current Plan
        </CardTitle>
        <CardDescription>
          Your current subscription plan and usage
        </CardDescription>
      </CardHeader>
      <CardContent>{renderActiveSubscription()}</CardContent>
    </Card>
  );
};
