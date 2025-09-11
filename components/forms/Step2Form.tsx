// components/forms/Step2Form.tsx
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
import { Input } from "@/components/ui/input";
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

type Step2FormProps = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onBack: () => void;
};

export function Step2Form({ form, onSubmit, onBack }: Step2FormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Serial Number */}
        <FormField
          name="serial_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Serial Number *</FormLabel>
              <FormControl>
                <Input
                  readOnly
                  className="bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                  {...field}
                  value={field.value ?? ""}
                  autoComplete="off"
                />
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">
                Current value: {field.value || "Not set"}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Model Number */}
        <FormField
          name="model_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Model Number *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  autoComplete="off"
                  className="text-sm"
                />
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">
                Current value: {field.value || "Not set"}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Serial Found Location */}
        <FormField
          name="serial_found_location"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel className="text-sm">
                Where was the serial found?
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Between lugs">Between lugs</SelectItem>
                    <SelectItem value="Rehaut">Rehaut</SelectItem>
                    <SelectItem value="Caseback">Caseback</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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

        {/* Matches Documents */}

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <FormField
            name="matches_documents"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Matches documents?
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
                  Current value:{" "}
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
        {/* Engraving Quality */}
        <FormField
          name="engraving_quality"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel className="text-sm">Engraving Quality</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sharp">Sharp</SelectItem>
                    <SelectItem value="Shallow">Shallow</SelectItem>
                    <SelectItem value="Acid-etched">Acid-etched</SelectItem>
                    <SelectItem value="Dotty">Dotty</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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

        {/* Serial Notes */}
        <FormField
          name="serial_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Notes *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={4}
                  className="resize-none text-sm"
                  placeholder="Please provide notes about the serial number..."
                />
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">
                Current value:{" "}
                {field.value ? `${field.value.length} characters` : "Empty"}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
