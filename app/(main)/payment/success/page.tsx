"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { CheckCircle, CreditCard, ArrowRight, HelpCircle } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InvoiceData {
  external_id?: string;
  invoice_id?: string;
  amount?: string;
}

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get query parameters from URL
    const external_id = searchParams.get("external_id");
    const invoice_id = searchParams.get("invoice_id");
    const amount = searchParams.get("amount");

    if (external_id || invoice_id) {
      setInvoiceData({
        external_id: external_id || undefined,
        invoice_id: invoice_id || undefined,
        amount: amount || undefined,
      });
    }

    setLoading(false);
  }, [searchParams]);

  const handleContinue = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Payment Successful - Credits Top Up</title>
        <meta
          name="description"
          content="Your payment has been processed successfully"
        />
      </Head>

      <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Payment Successful!
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your credits have been successfully added to your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Success Alert */}
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Transaction completed successfully. You can now use your
                  credits.
                </AlertDescription>
              </Alert>

              {/* Invoice Details */}
              {invoiceData && (
                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Transaction Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {invoiceData.external_id && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Transaction ID:
                        </span>
                        <span className="font-mono text-sm font-medium">
                          {invoiceData.external_id}
                        </span>
                      </div>
                    )}
                    {invoiceData.amount && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Amount:
                        </span>
                        <span className="font-semibold text-foreground">
                          ₱{parseFloat(invoiceData.amount).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                      >
                        Completed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <Button onClick={handleContinue} className="w-full" size="lg">
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/billing">View Credits Balance</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <HelpCircle className="h-3 w-3" />
              Need help? Contact our{" "}
              <Link href="/support" className="text-primary hover:underline">
                support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
