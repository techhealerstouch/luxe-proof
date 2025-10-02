import Link from "next/link";
import {
  FileQuestion,
  Home,
  ArrowLeft,
  Search,
  LayoutDashboard,
} from "lucide-react";
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

export default function MainNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Card */}
        <Card className="border-2 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="bg-primary/10 rounded-full p-8 inline-block">
                <FileQuestion className="h-20 w-20 text-primary" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight">
                404 - Page Not Found
              </CardTitle>
              <CardDescription className="text-lg">
                The page you're looking for doesn't exist or has been moved
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Alert with suggestions */}
            <Alert>
              <Search className="h-5 w-5" />
              <AlertDescription className="ml-2">
                <p className="font-semibold mb-2">Here's what you can do:</p>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Check the URL for any typos</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Return to your dashboard</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Use the navigation menu to find what you need</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Contact support if you believe this is an error</span>
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                asChild
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="text-xs">Dashboard</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/products">
                  <Search className="h-5 w-5" />
                  <span className="text-xs">Products</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/support">
                  <FileQuestion className="h-5 w-5" />
                  <span className="text-xs">Support</span>
                </Link>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              className="w-full sm:flex-1"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
            <Button
              asChild
              variant="default"
              size="lg"
              className="w-full sm:flex-1"
            >
              <Link href="/dashboard">
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Additional Help */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground">
              Still having trouble?{" "}
              <Link
                href="/support"
                className="text-primary hover:underline font-semibold"
              >
                Contact our support team
              </Link>{" "}
              for assistance
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
