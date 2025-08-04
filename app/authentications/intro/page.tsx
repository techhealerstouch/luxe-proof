"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Intro() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-xl shadow-xl rounded-2xl p-6">
          <CardContent>
            <h1 className="text-3xl font-bold mb-4 text-center">
              The Expert's 8-Step Watch Authentication Protocol
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              This protocol provides a systematic framework for the
              comprehensive authentication and condition assessment of a luxury
              timepiece.
              <br />
              Each step builds upon the last, creating a complete picture of the
              watch's history, authenticity, and current state.
            </p>

            <div className="flex justify-center">
              <Button asChild>
                <Link href="/authentications/create">
                  Start 8 Step Authentication
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
