// components/forms/Step8Form.tsx
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

type Step8FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

export function Step8Form({ form, onSubmit, onBack, step }: Step8FormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden Status Field */}
        <FormField
          name="status"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} value="pending" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Authenticity Verdict */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="authenticity_verdict"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Authenticity Verdict
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select authenticity verdict" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="genuine">Genuine</SelectItem>
                      <SelectItem value="counterfeit">Counterfeit</SelectItem>
                      <SelectItem value="genuine (aftermarket)">
                        Genuine (Aftermarket)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className="text-xs text-gray-500 mt-1">
                  Current value: {field.value || "Not selected"}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Estimated Year of Production */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="estimated_production_year"
            render={({ field }) => {
              const currentYear = new Date().getFullYear();
              const startYear = 1950;
              const years: string[] = Array.from(
                { length: currentYear - startYear + 1 },
                (_, i) => String(startYear + i)
              ).reverse(); // Show most recent years first

              return (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Estimated Year of Production
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger className="text-sm mt-3">
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">
                    Current value: {field.value || "Not selected"}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Final Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="final_summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-2 block">
                  Final Summary
                </FormLabel>
                <p className="text-xs text-gray-600 mb-3">
                  Provide a comprehensive summary of your authentication
                  analysis, including key findings, verdict rationale, and any
                  recommendations.
                </p>
                <FormControl>
                  <Textarea
                    placeholder="Example: Based on comprehensive analysis, this watch exhibits all authentic characteristics including proper serial engraving, genuine movement finishing, and correct component specifications. All documentation appears legitimate. Verdict: Genuine..."
                    {...field}
                    rows={6}
                    className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </FormControl>
                <div className="flex justify-between mt-2">
                  <FormMessage />
                  <span className="text-xs text-gray-400">
                    {field.value?.length || 0} characters
                  </span>
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
