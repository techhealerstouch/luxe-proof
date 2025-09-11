// components/forms/Step4Form.tsx
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";

type Step4FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
  step: number;
};

export function Step4Form({ form, onSubmit, onBack, step }: Step4FormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Dial Text Quality */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="dial_text_quality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Dial Text Quality
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crisp">Crisp</SelectItem>
                      <SelectItem value="blurry">Blurry</SelectItem>
                      <SelectItem value="misaligned">Misaligned</SelectItem>
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

        {/* Lume Application */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="lume_application"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Lume Application
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select application" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="even">Even</SelectItem>
                      <SelectItem value="uneven">Uneven</SelectItem>
                      <SelectItem value="missing">Missing</SelectItem>
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

        {/* Cyclops Magnification */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="cyclops_magnification"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Cyclops Magnification
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="text-sm mt-3">
                      <SelectValue placeholder="Select magnification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true_2.5x">True 2.5x</SelectItem>
                      <SelectItem value="weak">Weak</SelectItem>
                      <SelectItem value="off_center">Off-center</SelectItem>
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

        {/* Date Alignment */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="date_alignment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Date Alignment
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={
                      field.value === true
                        ? "true"
                        : field.value === false
                        ? "false"
                        : ""
                    }
                    className="grid grid-cols-2 gap-3 mt-3"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem
                          value="true"
                          className="text-green-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer flex-1">
                        Yes
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem
                          value="false"
                          className="text-red-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer flex-1">
                        No
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <div className="text-xs text-gray-500 mt-1">
                  Current value:
                  {field.value === true
                    ? "Yes"
                    : field.value === false
                    ? "No"
                    : "Not selected"}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="dial_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold mb-2 block">
                  Dial, Hands & Date Notes
                </FormLabel>
                <p className="text-xs text-gray-600 mb-3">
                  Provide detailed analysis of the dial printing quality, hand
                  finishing, date window alignment, and any authenticity
                  observations.
                </p>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Example: Dial text is crisp with proper font weight, lume application is even across all indices, cyclops provides true 2.5x magnification, date sits centered in window..."
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
