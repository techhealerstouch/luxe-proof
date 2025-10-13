"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import {
  XCircle,
  CreditCard,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface InvoiceData {
  external_id?: string;
  invoice_id?: string;
  failure_reason?: string;
}

export default function PaymentFailure() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get query parameters from URL
    const external_id = searchParams.get("external_id");
    const invoice_id = searchParams.get("invoice_id");
    const failure_reason = searchParams.get("failure_reason");

    if (external_id || invoice_id) {
      setInvoiceData({
        external_id: external_id || undefined,
        invoice_id: invoice_id || undefined,
        failure_reason: failure_reason || "Payment was not completed",
      });
    }

    setLoading(false);
  }, [searchParams]);

  const handleRetry = () => {
    router.push("/credits/topup");
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-destructive"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Payment Failed - Credits Top Up</title>
        <meta name="description" content="Payment could not be processed" />
      </Head>

      <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Payment Failed
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                We couldn't process your payment. Please try again or contact
                support if the problem persists.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Alert */}
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Payment Processing Failed</AlertTitle>
                <AlertDescription>
                  Your payment could not be completed at this time.
                </AlertDescription>
              </Alert>

              {/* Failure Details */}
              {invoiceData && (
                <Card className="bg-red-50 border-red-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                      <CreditCard className="h-5 w-5" />
                      Transaction Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {invoiceData.external_id && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700">
                          Transaction ID:
                        </span>
                        <span className="font-mono text-sm font-medium text-red-900">
                          {invoiceData.external_id}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-red-700">Status:</span>
                      <Badge variant="destructive">Failed</Badge>
                    </div>
                    <Separator className="bg-red-200" />
                    <div>
                      <span className="text-sm text-red-700">Reason:</span>
                      <p className="text-sm text-red-800 mt-1">
                        {invoiceData.failure_reason}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Common Issues */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Common Issues</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Insufficient funds in your account</li>
                    <li>• Expired or invalid payment method</li>
                    <li>• Network connection issues</li>
                    <li>• Payment session timeout</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>

                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>

                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/support">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 flex-wrap">
              <HelpCircle className="h-3 w-3" />
              Payment issues? Check our{" "}
              <Link href="/faq" className="text-primary hover:underline">
                FAQ
              </Link>{" "}
              or contact{" "}
              <Link href="/support" className="text-primary hover:underline">
                support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
