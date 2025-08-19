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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";

type Step8FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

export function Step8Form({ form, onSubmit, onBack, step }: Step8FormProps) {
  const { control, handleSubmit } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Authenticity Verdict */}
        <FormField
          name="authenticity_verdict"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authenticity Verdict</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select authenticity verdict" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="genuine">Genuine</SelectItem>
                  <SelectItem value="counterfeit">Counterfeit</SelectItem>
                  <SelectItem value="genuine_with_aftermarket_parts">
                    Genuine with Aftermarket Parts
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estimated Year of Production */}
        <FormField
          name="estimated_production_year"
          render={({ field }) => {
            const currentYear = new Date().getFullYear();
            const startYear = 1950;
            const years: string[] = Array.from(
              { length: currentYear - startYear + 1 },
              (_, i) => String(startYear + i)
            );

            return (
              <FormItem>
                <FormLabel>Estimated Year of Production</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {/* Final Summary */}
        <FormField
          name="final_summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Final Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your final summary..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
