import Link from "next/link";
import { AlertTriangle, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/logo";

export default function PublicNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo width={250} height={60} />
        </div>

        {/* Main Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-4 pb-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-amber-100 rounded-full p-6 inline-block">
                  <AlertTriangle className="h-16 w-16 text-amber-600" />
                </div>
                <div className="absolute -top-2 -right-2 bg-red-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-lg">
                  !
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight">
                404 - Page Not Found
              </CardTitle>
              <CardDescription className="text-lg">
                The product or page you're looking for doesn't exist
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Alert with possible reasons */}
            <Alert className="bg-blue-50 border-blue-200">
              <Search className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-900 ml-2">
                <p className="font-semibold mb-2">This could be because:</p>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>The reference code is incorrect or invalid</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      The product hasn't been registered in our system
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>The NFC tag may be damaged or unreadable</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>The URL was mistyped or is outdated</span>
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Help text */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 text-center">
                Need assistance verifying your product?{" "}
                <a
                  href="mailto:support@luxproof.com"
                  className="text-blue-600 hover:text-blue-700 font-semibold underline"
                >
                  Contact our support team
                </a>
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              onClick={() => window.location.reload()}
              variant="default"
              size="lg"
              className="w-full sm:flex-1"
            >
              <Search className="mr-2 h-5 w-5" />
              Try Again
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:flex-1"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Go to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Powered by <span className="font-semibold">Lux Proof</span>
          </p>
        </div>
      </div>
    </div>
  );
}
