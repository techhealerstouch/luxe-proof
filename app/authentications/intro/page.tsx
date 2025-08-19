"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";
import { Plus, Shield, User, CheckCircle, Award } from "lucide-react";
import Link from "next/link";

export default function Intro() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <Card className="w-full max-w-4xl shadow-2xl rounded-3xl p-8 transform hover:scale-[1.02] transition-all duration-500 ease-out animate-in fade-in-0 slide-in-from-bottom-4 border-2">
          <CardContent className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-in zoom-in-0 duration-700 delay-300">
                <Shield className="w-8 h-8 text-primary animate-pulse" />
              </div>

              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text animate-in slide-in-from-top-2 duration-700 delay-150">
                The Expert's 8-Step Watch
                <br /> Authentication Protocol
              </h1>

              <p className="text-muted-foreground text-base max-w-1xl mx-auto leading-relaxed animate-in slide-in-from-bottom-2 duration-700 delay-300">
                This protocol provides a systematic framework for the
                comprehensive authentication and condition assessment of luxury
                timepieces. Each step builds upon the last, creating a complete
                picture of the watch's history, authenticity, and current state.
              </p>

              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-full text-xs text-blue-700 dark:text-blue-300 animate-in fade-in-0 duration-700 delay-500">
                <User className="w-3 h-3" />
                <span>Includes comprehensive user information collection</span>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 animate-in slide-in-from-left-2 duration-700 delay-700">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800 dark:text-green-300 text-sm">
                  Comprehensive
                </h3>
                <p className="text-xs text-green-700 dark:text-green-400">
                  Complete evaluation framework
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 animate-in slide-in-from-bottom-2 duration-700 delay-800">
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 text-sm">
                  Professional
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Expert-grade assessment
                </p>
              </div>

              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 animate-in slide-in-from-right-2 duration-700 delay-900">
                <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 text-sm">
                  Detailed
                </h3>
                <p className="text-xs text-purple-700 dark:text-purple-400">
                  Thorough documentation
                </p>
              </div>
            </div>

            <div className="flex justify-center animate-in zoom-in-0 duration-700 delay-1000">
              <Button
                asChild
                size="sm"
                className="px-6 py-2 text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <Link
                  href="/authentications/create"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  Start 8-Step Authentication
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
