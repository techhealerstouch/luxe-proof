// components/billing/InvoiceList.tsx

import type React from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Copy } from "lucide-react";

import { formatDate, formatCurrency } from "@/utils/formatting";
import { getStatusBadge } from "@/utils/badges";
import { openInvoiceLink, copyInvoiceLink } from "@/lib/billing-service";

interface InvoiceListProps {
  invoices: any[];
  onDownloadInvoice: (url: string) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onDownloadInvoice,
}) => (
  <div className="space-y-4">
    {invoices.map((invoice) => (
      <div
        key={invoice.id}
        className="flex items-center justify-between p-4 border rounded-xl"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="font-medium">
              {invoice.credit?.name || "Credits Top up"} - {invoice.quantity}{" "}
              credits
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(invoice.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">{formatCurrency(invoice.amount)}</p>
            {getStatusBadge(invoice.status)}
          </div>

          <div className="flex gap-2">
            {invoice.payment_url && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openInvoiceLink(invoice.payment_url)}
                  className="rounded-xl"
                  title="Open invoice link"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyInvoiceLink(invoice.payment_url)}
                  className="rounded-xl"
                  title="Copy invoice link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);
